package com.dental_clinic.dental_service.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDentalServiceDTO {
    @NotBlank(message = "Category ID không được để trống")
    private String categoryId;

    @NotBlank(message = "Tên dịch vụ không được để trống")
    @Size(min = 1, max = 100, message = "Tên dịch vụ phải từ 1-100 ký tự")
    private String name;

    @NotNull(message = "Chi phí không được để trống")
    @Min(value = 0, message = "Chi phí phải lớn hơn hoặc bằng 0")
    private Integer cost;

    @NotNull(message = "Doanh thu không được để trống")
    @Min(value = 0, message = "Doanh thu phải lớn hơn hoặc bằng 0")
    private Integer revenue;

    @NotBlank(message = "Người phụ trách không được để trống")
    private String cared_actor;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotBlank(message = "Đơn vị tính không được để trống")
    private String unit;
}
