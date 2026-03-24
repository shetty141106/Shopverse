package com.shopverse.backend.service;

import com.shopverse.backend.model.*;
import com.shopverse.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    public OrderService(CartRepository cartRepository,
                        OrderRepository orderRepository,
                        ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // ✅ PLACE ORDER
    public Order placeOrder(Long userId) {

        List<CartItem> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        order.setUserEmail(user.getEmail());   // ✅ ONLY THIS
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PLACED);

        List<OrderItem> orderItems = new ArrayList<>();

        double total = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        order.setTotal(total);

        for (CartItem cart : cartItems) {

            if (cart.getProduct().getId() == null || cart.getQuantity() <= 0) {
                continue; // skip invalid data
            }

            Product product = productRepository.findById(cart.getProduct().getId())
                    .orElse(null);

            if (product == null) {
                continue; // skip if product not found
            }

            OrderItem item = new OrderItem();
            item.setProductName(product.getName());
            item.setPrice(product.getPrice());
            item.setQuantity(cart.getQuantity());
            item.setOrder(order);

            total += product.getPrice() * cart.getQuantity();
            orderItems.add(item);
        }
        if (orderItems.isEmpty()) {
            throw new RuntimeException("No valid items in cart");
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        // ✅ CLEAR CART
        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public List<Order> getUserOrders(String email) {
        return orderRepository.findByUserEmail(email);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateStatus(Long orderId, OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);

        return orderRepository.save(order);
    }
}