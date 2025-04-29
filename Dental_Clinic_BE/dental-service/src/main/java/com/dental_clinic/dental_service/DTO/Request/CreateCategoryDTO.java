package com.dental_clinic.dental_service.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCategoryDTO {
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(min = 1, max = 100, message = "Tên danh mục phải từ 1-100 ký tự")
    private String name;

    @Size(max = 500, message = "Ghi chú không được vượt quá 500 ký tự")
    private String note;
}
