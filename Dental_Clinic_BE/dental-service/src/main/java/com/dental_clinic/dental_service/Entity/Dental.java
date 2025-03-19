package com.dental_clinic.dental_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection="services")
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dental {
    @Id
    private String id;

    @Field("category_id") // Map với trường 'category_id' trong MongoDB (dạng ObjectId)
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId categoryId; // Đổi từ String sang ObjectId

    private String name;
    private int cost;
    private int revenue;
    private String cared_actor;
    private String description;
    private String unit;
    private String img;
    private LocalDateTime created_at;
    private boolean able;
}
