
package com.shopverse.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import com.fasterxml.jackson.annotation.JsonIgnore;



@Entity
public class OrderItem {
    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore   // 🔥 VERY IMPORTANT
    private Order order;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    private String productName;
    private double price;
    private int quantity;


    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setPrice(double price) {
        this.price=price;
    }

    public void setQuantity(int quantity) {
        this.quantity=quantity;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Order getOrder() {
        return order;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    // getters & setters
}