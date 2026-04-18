package com.webshop.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webshop.backend.config.RateLimitInterceptor;
import com.webshop.backend.config.SecurityConfig;
import com.webshop.backend.dto.PurchaseItem;
import com.webshop.backend.exception.ResourceNotFoundException;
import com.webshop.backend.model.Product;
import com.webshop.backend.service.IdempotencyService;
import com.webshop.backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@Import(SecurityConfig.class)
@ActiveProfiles("test")
@DisplayName("ProductController Integration Tests")
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProductService productService;

    @MockitoBean
    private IdempotencyService idempotencyService;

    @MockitoBean
    private RateLimitInterceptor rateLimitInterceptor;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product(1L, "Vinyl Record", "A classic vinyl", 19.99, "http://img.url", "Music", 10);
    }

    @Nested
    @DisplayName("GET /api/v1/products")
    class GetAllProducts {

        @Test
        @DisplayName("returns 200 with paginated product list")
        void shouldReturn200WithPagedProducts() throws Exception {
            Page<Product> page = new PageImpl<>(List.of(sampleProduct));
            when(productService.getProducts(isNull(), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/v1/products"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].name").value("Vinyl Record"))
                    .andExpect(jsonPath("$.content[0].price").value(19.99));
        }

        @Test
        @DisplayName("passes query param to service when provided")
        void shouldPassQueryToService() throws Exception {
            Page<Product> page = new PageImpl<>(List.of(sampleProduct));
            when(productService.getProducts(eq("vinyl"), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/v1/products").param("query", "vinyl"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].name").value("Vinyl Record"));

            verify(productService).getProducts(eq("vinyl"), any(Pageable.class));
        }

        @Test
        @DisplayName("returns empty page when no products match")
        void shouldReturnEmptyPage() throws Exception {
            Page<Product> emptyPage = new PageImpl<>(List.of());
            when(productService.getProducts(eq("xyz"), any(Pageable.class))).thenReturn(emptyPage);

            mockMvc.perform(get("/api/v1/products").param("query", "xyz"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content").isEmpty());
        }
    }

    @Nested
    @DisplayName("GET /api/v1/products/{id}")
    class GetProductById {

        @Test
        @DisplayName("returns 200 with product when found")
        void shouldReturn200WhenProductFound() throws Exception {
            when(productService.getProductById(1L)).thenReturn(sampleProduct);

            mockMvc.perform(get("/api/v1/products/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.name").value("Vinyl Record"))
                    .andExpect(jsonPath("$.stock").value(10));
        }

        @Test
        @DisplayName("returns 404 when product not found")
        void shouldReturn404WhenNotFound() throws Exception {
            when(productService.getProductById(99L))
                    .thenThrow(new ResourceNotFoundException("Product with ID 99 not found"));

            mockMvc.perform(get("/api/v1/products/99"))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("POST /api/v1/products/purchase")
    class Purchase {

        private List<PurchaseItem> buildItems(Long id, int qty) {
            PurchaseItem item = new PurchaseItem();
            item.setProductId(id);
            item.setQuantity(qty);
            return List.of(item);
        }

        @Test
        @DisplayName("returns 200 with success message on valid purchase")
        void shouldReturn200OnSuccess() throws Exception {
            doNothing().when(productService).purchaseProducts(anyList());
            when(idempotencyService.checkKey(any())).thenReturn(null);

            mockMvc.perform(post("/api/v1/products/purchase")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(buildItems(1L, 2))))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Purchase successful! Thank you for your order."));
        }

        @Test
        @DisplayName("returns 400 when stock is insufficient")
        void shouldReturn400WhenStockInsufficient() throws Exception {
            doThrow(new RuntimeException("Vinyl Record does not have enough stock (100 requested)!"))
                    .when(productService).purchaseProducts(anyList());

            mockMvc.perform(post("/api/v1/products/purchase")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(buildItems(1L, 100))))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(org.hamcrest.Matchers.containsString("enough stock")));
        }

        @Test
        @DisplayName("returns cached response for duplicate idempotency key")
        void shouldReturnCachedResponseForDuplicateKey() throws Exception {
            when(idempotencyService.checkKey("key-123"))
                    .thenReturn(ResponseEntity.ok("Purchase successful! Thank you for your order."));

            mockMvc.perform(post("/api/v1/products/purchase")
                    .header("Idempotency-Key", "key-123")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(buildItems(1L, 1))))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Purchase successful! Thank you for your order."));

            verify(productService, never()).purchaseProducts(anyList());
        }
    }
}
