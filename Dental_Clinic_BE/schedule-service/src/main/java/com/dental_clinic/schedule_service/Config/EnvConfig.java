package com.dental_clinic.schedule_service.Config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {
    private static final Dotenv dotenv = Dotenv.configure().load();

    public static String getMongoUsername() {
        return dotenv.get("MONGO_USERNAME");
    }

    public static String getMongoPassword() {
        return dotenv.get("MONGO_PASSWORD");
    }
}