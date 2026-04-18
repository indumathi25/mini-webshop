package com.webshop.backend.config;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;
import com.webshop.backend.model.Product;
import com.webshop.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import java.util.List;
import org.springframework.context.annotation.Profile;

@Component
@Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ResourceLoader resourceLoader;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            log.info("Database is empty. Loading products from products.json...");
            Resource resource = resourceLoader.getResource("classpath:products.json");
            ObjectMapper objectMapper = JsonMapper.builder()
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                .build();

            try {
                List<Product> products = objectMapper.readValue(
                        resource.getInputStream(),
                        new TypeReference<List<Product>>() {
                        });

                products.forEach(p -> p.setId(null));

                productRepository.saveAll(products);
                log.info("Successfully loaded {} products into the database.", products.size());
            } catch (Exception e) {
                log.error("Failed to load products: {}", e.getMessage());
            }
        } else {
            log.info("Database already contains data. Skipping initialization.");
        }
    }
}
