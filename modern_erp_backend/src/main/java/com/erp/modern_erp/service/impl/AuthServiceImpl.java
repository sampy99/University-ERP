package com.erp.modern_erp.service.impl;

import com.erp.modern_erp.dto.request.SignupRequest;
import com.erp.modern_erp.dto.response.SignupResponse;
import com.erp.modern_erp.entity.*;
import com.erp.modern_erp.enums.Role;
import com.erp.modern_erp.repository.*;
import com.erp.modern_erp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final LecturerRepository lecturerRepository;
    private final AdminRepository adminRepository;



    @Override
    public SignupResponse signup(SignupRequest req) {
        Role role = req.getRole() == null ? Role.STUDENT : Role.valueOf(req.getRole().toString());
        User user = new User();


        if (role.equals(Role.LECTURER)) {
            Lecturer admin = new Lecturer();
            admin.setStaffNumber(req.getStaffNumber());
            admin.setFirstName(req.getFirstName());
            admin.setLastName(req.getLastName());
            admin.setPhone(req.getPhone());
            admin.setEmail(req.getEmail());
            admin.setNic(req.getNic());
            admin.setAddressLine1(req.getAddressLine1());
            admin.setAddressLine2(req.getAddressLine2());
            admin.setAddressLine3(req.getAddressLine3());
            lecturerRepository.save(admin);
            user.setRoleDesignationId(admin.getId());
            user.setUsername(req.getUsername());
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            user.setEmail(req.getEmail());
            user.setFullName(req.getFirstName() + req.getLastName());
            user.setRole(Role.LECTURER);


        } else if (role.equals(Role.ADMIN)) {
            Admin admin = new Admin();
            admin.setStaffNumber(req.getStaffNumber());
            admin.setFirstName(req.getFirstName());
            admin.setLastName(req.getLastName());
            admin.setPhone(req.getPhone());
            admin.setEmail(req.getEmail());
            admin.setNic(req.getNic());
            admin.setAddressLine1(req.getAddressLine1());
            admin.setAddressLine2(req.getAddressLine2());
            admin.setAddressLine3(req.getAddressLine3());
            adminRepository.save(admin);
            user.setRoleDesignationId(admin.getId());
            user.setUsername(req.getUsername());
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            user.setEmail(req.getEmail());
            user.setFullName(req.getFirstName() + req.getLastName());
            user.setRole(Role.ADMIN);

        } else if (role.equals(Role.STUDENT)) {
            Student admin = new Student();

            admin.setStudentNumber(req.getStudentNumber());
            admin.setFirstName(req.getFirstName());
            admin.setLastName(req.getLastName());
            admin.setPhone(req.getPhone());
            admin.setEmail(req.getEmail());
            admin.setNic(req.getNic());
            admin.setAddressLine1(req.getAddressLine1());
            admin.setAddressLine2(req.getAddressLine2());
            admin.setAddressLine3(req.getAddressLine3());
            studentRepository.save(admin);
            user.setRoleDesignationId(admin.getId());
            user.setUsername(req.getUsername());
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            user.setEmail(req.getEmail());
            user.setFullName(req.getFirstName() + req.getLastName());
            user.setRole(Role.STUDENT);


        }

userRepository.save(user);

        SignupResponse response = new SignupResponse();
        return response;
    }






}