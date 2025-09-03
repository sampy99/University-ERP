package com.erp.modern_erp.entity;

import com.erp.modern_erp.enums.Semester;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String title;

    @ManyToOne
    private Lecturer lecturer; // the assigned lecturer

    @Column(nullable = true)
    private String description;

    @Column(nullable = true)
    private Integer credits;

    @Column(nullable = false)
    private Semester semester;
}