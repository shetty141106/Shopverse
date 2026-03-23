package com.shopverse.backend.dto;

import com.shopverse.backend.model.OrderStatus;

public class UpdateStatusRequest {

    private OrderStatus status;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}