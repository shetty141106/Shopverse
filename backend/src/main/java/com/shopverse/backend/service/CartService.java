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
    private final CartRepository repo;
    private final CartRepository cartRepository;

    public CartService(CartRepository repo, ProductRepository productRepository, CartRepository cartRepository) {
        this.repo = repo;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
    }
    public CartItem addToCart(CartItem item) {

        Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        item.setProduct(product);

        return cartRepository.save(item);
    }
    public List<CartResponse> getUserCart(Long userId) {

        List<CartItem> items = repo.findByUserId(userId);

        List<CartResponse> response = new ArrayList<>();

        for (CartItem item : items) {

            Product product = productRepository
                    .findById(item.getProduct().getId())
                    .orElse(null);

            if (product != null) {

                CartResponse cr = new CartResponse();
                cr.setId(item.getId());
                cr.setName(product.getName());
                cr.setImage(product.getImage());
                cr.setPrice(product.getPrice());
                cr.setQuantity(item.getQuantity());

                response.add(cr);
            }
        }

        return response;
    }

    public void removeItem(Long id) {
        repo.deleteById(id);
    }

}