package com.example.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SearchRequest {
    private String query;
    private PriceRange price;
    private Double rating;
    private String sort; // e.g., "price_asc", "newest"
    private int page = 1;
    private int pageSize = 10;

    @Data
    public static class PriceRange {
        private BigDecimal min;
        private BigDecimal max;
    }
}
