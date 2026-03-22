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
    public CartService(CartRepository repo, ProductRepository productRepository) {
        this.repo = repo;
        this.productRepository = productRepository;
    }
    public CartItem addToCart(CartItem item) {

        List<CartItem> existingItems = repo.findCartByUserId(item.getUserId());

        for (CartItem ci : existingItems) {
            if (ci.getProductId().equals(item.getProductId())) {
                ci.setQuantity(ci.getQuantity() + item.getQuantity());
                return repo.save(ci);
            }
        }

        return repo.save(item);
    }
    public List<CartResponse> getUserCart(Long userId) {

        List<CartItem> items = repo.findCartByUserId(userId);

        List<CartResponse> response = new ArrayList<>();

        for (CartItem item : items) {

            Product product = productRepository
                    .findById(item.getProductId())
                    .orElse(null);

            if (product != null) {

                CartResponse cr = new CartResponse();
                cr.setId(item.getId());
                cr.setProductId(product.getId());
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