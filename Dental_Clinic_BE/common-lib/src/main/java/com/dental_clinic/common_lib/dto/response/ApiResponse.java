package com.dental_clinic.common_lib.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL) // Dùng để bỏ qua các trường null khi trả về response
public class ApiResponse<T> {
    int apiCode = 200;
    String message;
    @Setter
    T result;
}
