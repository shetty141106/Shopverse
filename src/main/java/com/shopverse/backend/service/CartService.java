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

    private final ProductRepository productRepository;

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    public CartItem addToCart(CartItem item) {

        Long userId = item.getUser().getId();
        Long productId = item.getProduct().getId();

        // 🔥 check if already exists
        CartItem existing = cartRepository.findByUserIdAndProductId(userId, productId);

        if (existing != null) {
            // ✅ update quantity
            existing.setQuantity(existing.getQuantity() + item.getQuantity());
            return cartRepository.save(existing);
        }

        // ✅ new item
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        item.setProduct(product);
        return cartRepository.save(item);
    }
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

    public void removeItem(Long id) {
        cartRepository.deleteById(id);
    }

}