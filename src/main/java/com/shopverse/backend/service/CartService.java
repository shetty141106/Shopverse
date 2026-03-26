package com.shopverse.backend.service;

import com.shopverse.backend.dto.CartResponse;
import com.shopverse.backend.model.CartItem;
import com.shopverse.backend.model.Product;
import com.shopverse.backend.repository.CartRepository;
import com.shopverse.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    // 🔥 ADD TO CART (FINAL FIX)
    public CartItem addToCart(CartItem item) {

        Long userId = item.getUser().getId();
        Long productId = item.getProduct().getId();

        CartItem existing = cartRepository
                .findByUserIdAndProductId(userId, productId)
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + item.getQuantity());
            return cartRepository.save(existing);
        }

        return cartRepository.save(item);
    }
    // 🔥 GET USER CART
    public List<CartResponse> getUserCart(Long userId) {

        List<CartItem> items = cartRepository.findByUserId(userId);
        List<CartResponse> response = new ArrayList<>();

        for (CartItem item : items) {

            Product product = productRepository
                    .findById(item.getProduct().getId())
                    .orElse(null);

            if (product != null) {

                CartResponse cr = new CartResponse();
                cr.setId(item.getId());
                cr.setName(product.getName());
                cr.setImage(product.getImageUrl());
                cr.setPrice(product.getPrice());
                cr.setQuantity(item.getQuantity());

                response.add(cr);
            }
        }

        return response;
    }

    // 🔥 REMOVE ITEM
    public void removeItem(Long id) {
        cartRepository.deleteById(id);
    }
}