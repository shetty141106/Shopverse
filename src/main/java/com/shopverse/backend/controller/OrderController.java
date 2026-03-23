package com.shopverse.backend.controller;

import com.shopverse.backend.dto.UpdateStatusRequest;
import com.shopverse.backend.model.Order;

import com.shopverse.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ PLACE ORDER
    @PostMapping("/orders/place")
    public Order placeOrder(@RequestParam Long userId) {
        return orderService.placeOrder(userId);
    }

    // ✅ USER ORDERS
    @GetMapping("/orders/{email}")
    public List<Order> getOrders(@PathVariable String email) {
        return orderService.getUserOrders(email);
    }

    // ✅ ADMIN - GET ALL ORDERS
    @GetMapping("/admin/orders")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // ✅ ADMIN - UPDATE STATUS (ONLY ONE API)
    @PutMapping("/admin/orders/{id}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {

        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
    }
}