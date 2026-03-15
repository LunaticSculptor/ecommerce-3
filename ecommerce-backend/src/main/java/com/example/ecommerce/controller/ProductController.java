package com.example.ecommerce.controller;

import com.example.ecommerce.dto.SearchRequest;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        if (Boolean.TRUE.equals(featured)) {
            return ResponseEntity.ok(productRepository.findByFeaturedTrue(pageable));
        } else if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(productRepository.findByCategorySlug(category, pageable));
        }
        return ResponseEntity.ok(productRepository.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Cacheable(value = "products", key = "#id")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(@RequestBody SearchRequest request) {
        Sort sort = Sort.unsorted();
        if ("price_asc".equals(request.getSort())) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equals(request.getSort())) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        } else if ("rating".equals(request.getSort())) {
            sort = Sort.by(Sort.Direction.DESC, "rating");
        } else if ("newest".equals(request.getSort())) {
            sort = Sort.by(Sort.Direction.DESC, "id");
        }

        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getPageSize(), sort);

        Page<Product> results = productRepository.findAll(
                ProductSpecification.filter(
                        request.getQuery(),
                        request.getPrice() != null ? request.getPrice().getMin() : null,
                        request.getPrice() != null ? request.getPrice().getMax() : null,
                        request.getRating()),
                pageable);

        return ResponseEntity.ok(results);
    }
}
