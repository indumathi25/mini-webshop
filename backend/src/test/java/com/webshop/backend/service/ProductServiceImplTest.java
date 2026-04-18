package com.webshop.backend.service;

import com.webshop.backend.dto.PurchaseItem;
import com.webshop.backend.exception.ResourceNotFoundException;
import com.webshop.backend.model.Product;
import com.webshop.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductServiceImpl Unit Tests")
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product(1L, "Vinyl Record", "A classic vinyl", 19.99, "http://img.url", "Music", 10);
    }

    @Nested
    @DisplayName("getProducts()")
    class GetProducts {

        @Test
        @DisplayName("fetches all products when query is null")
        void shouldFetchAllProductsWhenQueryIsNull() {
            Pageable pageable = PageRequest.of(0, 12);
            Page<Product> page = new PageImpl<>(List.of(sampleProduct));
            when(productRepository.findAll(pageable)).thenReturn(page);

            Page<Product> result = productService.getProducts(null, pageable);

            assertThat(result.getContent()).hasSize(1);
            verify(productRepository).findAll(pageable);
            verify(productRepository, never())
                    .findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(any(), any(), any());
        }

        @Test
        @DisplayName("fetches all products when query is blank")
        void shouldFetchAllProductsWhenQueryIsBlank() {
            Pageable pageable = PageRequest.of(0, 12);
            Page<Product> page = new PageImpl<>(List.of(sampleProduct));
            when(productRepository.findAll(pageable)).thenReturn(page);

            Page<Product> result = productService.getProducts("   ", pageable);

            assertThat(result.getContent()).hasSize(1);
            verify(productRepository).findAll(pageable);
        }

        @Test
        @DisplayName("delegates to search query when query is provided")
        void shouldSearchProductsWhenQueryIsProvided() {
            Pageable pageable = PageRequest.of(0, 12);
            Page<Product> page = new PageImpl<>(List.of(sampleProduct));
            when(productRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                    "vinyl", "vinyl", pageable)).thenReturn(page);

            Page<Product> result = productService.getProducts("vinyl", pageable);

            assertThat(result.getContent()).hasSize(1);
            verify(productRepository)
                    .findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase("vinyl", "vinyl", pageable);
            verify(productRepository, never()).findAll(pageable);
        }
    }

    @Nested
    @DisplayName("getProductById()")
    class GetProductById {

        @Test
        @DisplayName("returns product when found")
        void shouldReturnProductWhenFound() {
            when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));

            Product result = productService.getProductById(1L);

            assertThat(result).isEqualTo(sampleProduct);
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when product not found")
        void shouldThrowWhenProductNotFound() {
            when(productRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> productService.getProductById(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }

    @Nested
    @DisplayName("purchaseProducts()")
    class PurchaseProducts {

        @Test
        @DisplayName("decrements stock successfully for each item")
        void shouldDecrementStockSuccessfully() {
            PurchaseItem item = new PurchaseItem();
            item.setProductId(1L);
            item.setQuantity(3);

            when(productRepository.decrementStock(1L, 3)).thenReturn(1);

            productService.purchaseProducts(List.of(item));

            verify(productRepository).decrementStock(1L, 3);
        }

        @Test
        @DisplayName("throws RuntimeException when stock is insufficient")
        void shouldThrowWhenStockInsufficient() {
            PurchaseItem item = new PurchaseItem();
            item.setProductId(1L);
            item.setQuantity(100);

            when(productRepository.decrementStock(1L, 100)).thenReturn(0);
            when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));

            assertThatThrownBy(() -> productService.purchaseProducts(List.of(item)))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Vinyl Record")
                    .hasMessageContaining("100");
        }

        @Test
        @DisplayName("processes multiple items atomically")
        void shouldProcessMultipleItems() {
            PurchaseItem item1 = new PurchaseItem();
            item1.setProductId(1L);
            item1.setQuantity(2);

            PurchaseItem item2 = new PurchaseItem();
            item2.setProductId(2L);
            item2.setQuantity(1);

            when(productRepository.decrementStock(1L, 2)).thenReturn(1);
            when(productRepository.decrementStock(2L, 1)).thenReturn(1);

            productService.purchaseProducts(List.of(item1, item2));

            verify(productRepository).decrementStock(1L, 2);
            verify(productRepository).decrementStock(2L, 1);
        }
    }
}
