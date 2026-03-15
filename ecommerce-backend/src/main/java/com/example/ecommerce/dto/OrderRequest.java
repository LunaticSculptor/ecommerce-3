package com.example.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    private String customerEmail;
    private String customerName;
    private String deliveryAddress;

    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal deliveryCharges;
    private BigDecimal totalAmount;

    private String paymentMethod;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private String selectedColor;
        private BigDecimal price;
    }
}
