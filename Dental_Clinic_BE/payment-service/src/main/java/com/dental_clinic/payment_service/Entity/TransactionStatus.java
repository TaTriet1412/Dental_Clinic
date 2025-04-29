package com.dental_clinic.payment_service.Entity;

public enum TransactionStatus {
    PENDING("pending"),
    SUCCESS("success"),
    FAIL("fail");

    private final String status;

    TransactionStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}