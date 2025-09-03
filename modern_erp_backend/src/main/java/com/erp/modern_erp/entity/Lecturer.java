package com.erp.modern_erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lecturers")

public class Lecturer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String staffNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    @Column(nullable = false, unique = true)
    private String nic;

    private String addressLine1;
    private String addressLine2;
    private String addressLine3;

}