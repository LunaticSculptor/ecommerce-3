package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "orders") // "order" is a reserved keyword in SQL
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerEmail;
    private String customerName;
    private String deliveryAddress;

    // Summary
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal deliveryCharges;
    private BigDecimal totalAmount;

    private String paymentMethod; // e.g., "CASH_ON_DELIVERY"
    private String status; // e.g., "COMPLETED"

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    private List<OrderItem> items;
}
