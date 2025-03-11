package com.dental_clinic.auth_service.Utils;


import java.util.regex.Pattern;

public class VariableUtils {
    public static final String DEFAULT_AVATAR = "template/blank_avatar.webp";

    public static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
    public static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);
}
