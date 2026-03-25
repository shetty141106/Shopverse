package com.shopverse.backend.repository;

import com.shopverse.backend.model.CartItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);
    CartItem findByUserIdAndProductId(Long userId, Long productId);
}