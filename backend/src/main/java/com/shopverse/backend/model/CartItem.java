package com.shopverse.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_item") // optional but good
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")     // 🔥 FIX
    private Long userId;

    @Column(name = "product_id")  // 🔥 FIX
    private Long productId;

    private int quantity;

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

}