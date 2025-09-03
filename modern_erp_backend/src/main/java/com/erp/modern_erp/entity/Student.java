package com.erp.modern_erp.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String nic;

    private String email;

    private String phone;

    private String addressLine1;
    private String addressLine2;

    private String addressLine3;

    @Column(nullable = false, unique = true)
    private String studentNumber;


}