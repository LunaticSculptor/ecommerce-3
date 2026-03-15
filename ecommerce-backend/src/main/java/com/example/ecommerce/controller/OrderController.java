package com.example.ecommerce.controller;

import com.example.ecommerce.dto.OrderRequest;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        Order order = new Order();
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerName(request.getCustomerName());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setSubtotal(request.getSubtotal());
        order.setDiscount(request.getDiscount());
        order.setDeliveryCharges(request.getDeliveryCharges());
        order.setTotalAmount(request.getTotalAmount());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus("COMPLETED"); // Mock instantaneous completion

        order.setItems(request.getItems().stream().map(itemDto -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Basic stock deduction
            if (product.getStockQuantity() != null && product.getStockQuantity() >= itemDto.getQuantity()) {
                product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            }

            item.setProduct(product);
            item.setQuantity(itemDto.getQuantity());
            item.setSelectedColor(itemDto.getSelectedColor());
            item.setPriceAtPurchase(itemDto.getPrice());
            return item;
        }).collect(Collectors.toList()));

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }
}
