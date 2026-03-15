package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice; // For discount display

    private Double rating;
    private Integer reviewCount;

    private String brand;
    private Boolean inStock;
    private Integer stockQuantity;
    private Boolean featured;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ElementCollection
    private List<String> imageUrls; // First one is main image, rest are thumbnails

    @ElementCollection
    private List<String> availableColors; // e.g., Black, Blue, White
}
