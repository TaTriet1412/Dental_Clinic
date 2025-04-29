package com.dental_clinic.schedule_service.DTO.Response;

import lombok.Data;

import java.util.List;

@Data
public class PageResponse<T> {
    private List<T> items;
    private long totalItems;
    private int totalPages;
    private int currentPage;

    public PageResponse(List<T> items, long totalItems, int totalPages, int currentPage) {
        this.items = items;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }
}
