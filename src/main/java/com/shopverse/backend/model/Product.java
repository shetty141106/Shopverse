package com.shopverse.backend.model;

import jakarta.persistence.*;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String category;

    private String name;
    private double price;
    private String imageUrl;

    // ✅ GETTERS

    public Long getId() { return id; }

    public String getCategory() { return category; }

    public String getName() { return name; }

    public double getPrice() { return price; }

    public String getImageUrl() { return imageUrl; }

    // ✅ SETTERS

    public void setId(Long id) { this.id = id; }

    public void setCategory(String category) { this.category = category; }

    public void setName(String name) { this.name = name; }

    public void setPrice(double price) { this.price = price; }

    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}