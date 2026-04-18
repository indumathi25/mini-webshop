package com.webshop.backend.repository;

import com.webshop.backend.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("ProductRepository Slice Tests")
class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TestEntityManager entityManager;

    private Product vinylProduct;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        vinylProduct = productRepository
                .save(new Product(null, "Vintage Vinyl", "Great record", 19.99, "http://img1.url", "Music", 10));
        productRepository
                .save(new Product(null, "Acoustic Guitar", "Handcrafted", 299.99, "http://img2.url", "Instruments", 5));
    }

    @Nested
    @DisplayName("decrementStock()")
    class DecrementStock {

        @Test
        @DisplayName("returns 1 and reduces stock when sufficient stock available")
        void shouldDecrementStockSuccessfully() {
            int rowsUpdated = productRepository.decrementStock(vinylProduct.getId(), 3);

            assertThat(rowsUpdated).isEqualTo(1);
            
            entityManager.flush();
            entityManager.clear();

            Product updated = productRepository.findById(vinylProduct.getId()).orElseThrow();
            assertThat(updated.getStock()).isEqualTo(7); // 10 - 3
        }

        @Test
        @DisplayName("returns 0 and leaves stock unchanged when insufficient stock")
        void shouldNotDecrementWhenStockInsufficient() {
            int rowsUpdated = productRepository.decrementStock(vinylProduct.getId(), 50);

            assertThat(rowsUpdated).isEqualTo(0);
            
            entityManager.flush();
            entityManager.clear();

            Product unchanged = productRepository.findById(vinylProduct.getId()).orElseThrow();
            assertThat(unchanged.getStock()).isEqualTo(10); // unchanged
        }

        @Test
        @DisplayName("returns 0 when product ID does not exist")
        void shouldReturnZeroForUnknownProductId() {
            int rowsUpdated = productRepository.decrementStock(9999L, 1);

            assertThat(rowsUpdated).isEqualTo(0);
        }

        @Test
        @DisplayName("allows decrement that reduces stock to exactly 0")
        void shouldAllowDecrementToZero() {
            int rowsUpdated = productRepository.decrementStock(vinylProduct.getId(), 10);

            assertThat(rowsUpdated).isEqualTo(1);
            
            entityManager.flush();
            entityManager.clear();

            Product updated = productRepository.findById(vinylProduct.getId()).orElseThrow();
            assertThat(updated.getStock()).isEqualTo(0);
        }
    }

    @Nested
    @DisplayName("findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase()")
    class Search {

        @Test
        @DisplayName("returns product matching name substring (case-insensitive)")
        void shouldFindByName() {
            Page<Product> result = productRepository
                    .findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                            "vinyl", "vinyl", PageRequest.of(0, 10));

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getName()).isEqualTo("Vintage Vinyl");
        }

        @Test
        @DisplayName("returns product matching category substring (case-insensitive)")
        void shouldFindByCategory() {
            Page<Product> result = productRepository
                    .findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                            "instruments", "instruments", PageRequest.of(0, 10));

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getName()).isEqualTo("Acoustic Guitar");
        }

        @Test
        @DisplayName("returns all products when query matches multiple")
        void shouldReturnMultipleWhenQueryMatchesBoth() {
            Page<Product> result = productRepository
                    .findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                            "a", "a", PageRequest.of(0, 10));

            assertThat(result.getContent()).hasSizeGreaterThanOrEqualTo(1);
        }

        @Test
        @DisplayName("returns empty page when no products match")
        void shouldReturnEmptyWhenNoMatch() {
            Page<Product> result = productRepository
                    .findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                            "xyznotfound", "xyznotfound", PageRequest.of(0, 10));

            assertThat(result.getContent()).isEmpty();
        }
    }
}
