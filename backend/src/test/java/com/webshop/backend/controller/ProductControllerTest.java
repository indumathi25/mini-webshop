package com.webshop.backend.controller;

import tools.jackson.databind.ObjectMapper;
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
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
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

    private Product guitarProduct;

    @BeforeEach
    void setUp() {
        guitarProduct = new Product();
        guitarProduct.setId(1L);
        guitarProduct.setName("Vinyl Record");
        guitarProduct.setPrice(19.99);
        guitarProduct.setStock(10);
    }

    @Nested
    @DisplayName("GET /api/v1/products")
    class GetAllProducts {
        @Test
        @DisplayName("should return 200 and paged products")
        void shouldReturn200WithPagedProducts() throws Exception {
            Page<Product> page = new PageImpl<>(List.of(guitarProduct));
            when(productService.getProducts(any(), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/v1/products"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].name").value("Vinyl Record"))
                    .andExpect(jsonPath("$.content[0].price").value(19.99));
        }

        @Test
        @DisplayName("should pass query parameter to service")
        void shouldPassQueryToService() throws Exception {
            Page<Product> page = new PageImpl<>(List.of(guitarProduct));
            when(productService.getProducts(eq("vinyl"), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/v1/products").param("query", "vinyl"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].name").value("Vinyl Record"));
        }

        @Test
        @DisplayName("should return empty page when no results found")
        void shouldReturnEmptyPage() throws Exception {
            Page<Product> page = Page.empty();
            when(productService.getProducts(eq("xyz"), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/v1/products").param("query", "xyz"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content").isEmpty());
        }
    }

    @Nested
    @DisplayName("GET /api/v1/products/{id}")
    class GetProductById {
        @Test
        @DisplayName("should return 200 when product exists")
        void shouldReturn200WhenProductFound() throws Exception {
            when(productService.getProductById(1L)).thenReturn(guitarProduct);

            mockMvc.perform(get("/api/v1/products/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.name").value("Vinyl Record"));
        }

        @Test
        @DisplayName("should return 404 when product is not found")
        void shouldReturn404WhenNotFound() throws Exception {
            when(productService.getProductById(99L)).thenThrow(new ResourceNotFoundException("Not found"));
            mockMvc.perform(get("/api/v1/products/99"))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("POST /api/v1/products/purchase")
    class Purchase {
        @Test
        @DisplayName("should return 200 on successful purchase")
        void shouldReturn200OnSuccess() throws Exception {
            PurchaseItem item = new PurchaseItem(1L, 3);
            List<PurchaseItem> items = List.of(item);
            String idempotencyKey = "unique-key-123";

            when(idempotencyService.checkKey(idempotencyKey)).thenReturn(null);

            mockMvc.perform(post("/api/v1/products/purchase")
                    .header("Idempotency-Key", idempotencyKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(items)))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Purchase successful! Thank you for your order."));

            verify(productService).purchaseProducts(items);
            verify(idempotencyService).markCompleted(eq(idempotencyKey), anyString());
        }

        @Test
        @DisplayName("should return 400 when stock is insufficient")
        void shouldReturn400WhenStockInsufficient() throws Exception {
            PurchaseItem item = new PurchaseItem(1L, 100);
            List<PurchaseItem> items = List.of(item);
            
            doThrow(new IllegalArgumentException("Insufficient stock"))
                .when(productService).purchaseProducts(anyList());

            mockMvc.perform(post("/api/v1/products/purchase")
                    .header("Idempotency-Key", "key-456")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(items)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string("Insufficient stock"));
        }

        @Test
        @DisplayName("should return cached response for duplicate idempotency key")
        void shouldReturnCachedResponseForDuplicateKey() throws Exception {
            String idempotencyKey = "duplicate-key";
            String cachedResponse = "Purchase successful! Thank you for your order.";
            ResponseEntity<String> cachedEntity = ResponseEntity.ok(cachedResponse);
            
            when(idempotencyService.checkKey(idempotencyKey)).thenReturn(cachedEntity);

            mockMvc.perform(post("/api/v1/products/purchase")
                    .header("Idempotency-Key", idempotencyKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("[]"))
                    .andExpect(status().isOk())
                    .andExpect(content().string(cachedResponse));

            verify(productService, never()).purchaseProducts(anyList());
        }
    }
}
