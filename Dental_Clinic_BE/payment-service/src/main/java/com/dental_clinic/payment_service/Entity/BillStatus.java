package com.dental_clinic.payment_service.Entity;

public enum BillStatus {
    PAID("paid"),
    CONFIRMED("confirmed"),
    CANCELLED("cancelled");

    private final String status;

    BillStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}