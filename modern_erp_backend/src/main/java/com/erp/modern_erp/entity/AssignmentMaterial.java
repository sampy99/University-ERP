package com.erp.modern_erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_material")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileId;
    private String description;
    private String fileName;
    private LocalDateTime uploadedDate;
    private String filePath;

    @ManyToOne(optional = false)
    private Student student;

    @ManyToOne
    private Assignment assignment;
}