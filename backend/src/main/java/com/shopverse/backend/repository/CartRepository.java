package com.shopverse.backend.repository;

import com.shopverse.backend.model.CartItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    @Query(value = "SELECT * FROM cart_item WHERE user_id = :userId", nativeQuery = true)
    List<CartItem> findCartByUserId(@Param("userId") Long userId);
}