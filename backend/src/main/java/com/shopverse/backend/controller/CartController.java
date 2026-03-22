package com.shopverse.backend.controller;

import com.shopverse.backend.dto.CartResponse;
import com.shopverse.backend.model.CartItem;
import com.shopverse.backend.repository.CartRepository;
import com.shopverse.backend.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
public class CartController {

    private final CartService service;
    private final CartRepository cartRepository;

    public CartController(CartService service, CartRepository cartRepository) {
        this.service = service;
        this.cartRepository = cartRepository;
    }

    @PutMapping("/update/{id}")
    public CartItem updateQuantity(@PathVariable Long id, @RequestBody Map<String, Integer> body){

        int change = body.get("change");



        com.shopverse.backend.model.CartItem item = cartRepository.findById(id).orElseThrow();

        int newQty = item.getQuantity() + change;

        if(newQty <= 0){
            cartRepository.delete(item);
            return null;
        }

        item.setQuantity(newQty);

        return cartRepository.save(item);
    }

    // ADD TO CART
    @PostMapping("/add")
    public CartItem addToCart(@RequestBody CartItem item) {
        return service.addToCart(item);
    }

    // GET USER CART
    @GetMapping("/user/{userId}")
    public List<CartResponse> getCart(@PathVariable Long userId) {
        return service.getUserCart(userId);
    }

    // REMOVE ITEM
    @DeleteMapping("/{id}")
    public void removeItem(@PathVariable Long id) {
        service.removeItem(id);
    }
}