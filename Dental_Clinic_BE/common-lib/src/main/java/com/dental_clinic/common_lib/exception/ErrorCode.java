package com.dental_clinic.common_lib.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    INVALID_MESSAGE_KEY(400, "Lỗi khóa key"),
    FAIL_FORMAT_DATA(400, "Định dạng dữ liệu sai"),
    EXISTED_DATA(400, "Dữ liệu tồn tại trùng lặp"),
    DATA_OFF(400, "Dữ liệu không còn hoạt động"),
    INVALID_CREDENTIALS(401, "Thông tin đăng nhập không hợp lệ"),
    INVALID_REQUEST(400,  "Yêu cầu không hợp lệ"),
    NOT_FOUND(404, "Không tìm thấy dữ liệu tương ứng"),
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định"),
    INTERNAL_SERVER_ERROR(500, "Server lỗi"),
    FILE_ERROR(400, "Lỗi xử lý file");


    private final int code;
    private final String message;
}
