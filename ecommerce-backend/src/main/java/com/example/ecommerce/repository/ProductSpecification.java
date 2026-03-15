package com.example.ecommerce.repository;

import com.example.ecommerce.model.Product;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

public class ProductSpecification {
    public static Specification<Product> filter(String query, BigDecimal minPrice, BigDecimal maxPrice, Double rating) {
        return (root, queryInfo, criteriaBuilder) -> {
            Specification<Product> spec = Specification.where((Specification<Product>) null);

            if (StringUtils.hasText(query)) {
                String likeQuery = "%" + query.toLowerCase() + "%";
                spec = spec.and((r, q, cb) -> cb.or(
                        cb.like(cb.lower(r.get("name")), likeQuery),
                        cb.like(cb.lower(r.get("description")), likeQuery)));
            }

            if (minPrice != null) {
                spec = spec.and((r, q, cb) -> cb.greaterThanOrEqualTo(r.get("price"), minPrice));
            }
            if (maxPrice != null) {
                spec = spec.and((r, q, cb) -> cb.lessThanOrEqualTo(r.get("price"), maxPrice));
            }
            if (rating != null) {
                spec = spec.and((r, q, cb) -> cb.greaterThanOrEqualTo(r.get("rating"), rating));
            }

            return spec.toPredicate(root, queryInfo, criteriaBuilder);
        };
    }
}
