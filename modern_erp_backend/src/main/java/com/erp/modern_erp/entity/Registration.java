package com.erp.modern_erp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder

@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"student_id","course_id"}), name = "registration")
public class Registration {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Course course;

    private Double grade;

    private String status;
}