package com.erp.modern_erp.service;

import com.erp.modern_erp.dto.request.LecturerUpdateRequest;
import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    Course createCourse(String code,String semester, String title, Long lecturerId);
    Course assignLecturer(Long courseId, Long lecturerId);
    User updateUser(Long userId, String fullName, String email, String username);
    LecturerResponse getById(Long id);

     Page<LecturerResponse> getAll(Pageable pageable, String searchText) ;

    LecturerResponse getByAdminId(Long id);

    LecturerResponse updateAdmin(Long id, LecturerUpdateRequest request);

}
