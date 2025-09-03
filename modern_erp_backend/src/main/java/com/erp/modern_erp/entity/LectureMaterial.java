package com.erp.modern_erp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LectureMaterial {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String fileName;

    private String filePath; // where the file is stored
    private String fileId; // where the file is stored


    @ManyToOne(optional = false)
    private Course course;

    private LocalDateTime uploadedDate;
}