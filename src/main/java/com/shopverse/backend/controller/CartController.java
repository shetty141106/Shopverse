package com.shopverse.backend.controller;

import com.shopverse.backend.dto.CartRequest;
import com.shopverse.backend.dto.CartResponse;
import com.shopverse.backend.model.CartItem;
import com.shopverse.backend.model.Product;
import com.shopverse.backend.model.User;
import com.shopverse.backend.repository.CartRepository;
import com.shopverse.backend.repository.ProductRepository;
import com.shopverse.backend.repository.UserRepository;
import com.shopverse.backend.service.CartService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
public class CartController {

    private final CartService service;
    private final CartRepository cartRepository;

    public CartController(CartService service, CartRepository cartRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.service = service;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @PutMapping("/update/{id}")
    public CartItem updateQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body,
            Authentication auth) {

        String username = auth.getName();

        CartItem item = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        System.out.println("AUTH USER: " + auth.getName());
        System.out.println("ITEM USER: " + item.getUser().getEmail());

        // 🔒 Ensure item belongs to logged-in user
        if (!item.getUser().getEmail().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        int quantity = body.get("quantity");

        if (quantity <= 0) {
            cartRepository.delete(item);
            return item;
        }

        item.setQuantity(quantity);

        return cartRepository.save(item);
    }
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // ADD TO CART
    @PostMapping("/add")
    public CartItem addToCart(@RequestBody CartRequest req) {

        System.out.println("USER ID: " + req.getUserId());
        System.out.println("PRODUCT ID: " + req.getProductId());

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = new CartItem();
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(req.getQuantity());

        return service.addToCart(item);
    }

    // GET USER CART
    @GetMapping("/user/{userId}")
    public List<CartResponse> getCart(@PathVariable Long userId) {
        return service.getUserCart(userId);
    }

    // REMOVE ITEM
    @DeleteMapping("/{id}")
    public Map<String, String> removeItem(@PathVariable Long id, Authentication auth) {

        CartItem item = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getUser().getEmail().equals(auth.getName())) {
            throw new RuntimeException("Unauthorized");
        }

        cartRepository.delete(item);

        return Map.of("message", "Item removed successfully");
    }
    }
