package com.erp.modern_erp.service;

import com.erp.modern_erp.dto.request.LecturerUpdateRequest;
import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.LectureMaterial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface LecturerService {
    List<Course> dashboardCourses(Long lecturerId);
    LectureMaterial uploadMaterial(Long courseId, String title, MultipartFile file) throws IOException;
    int emailEnrolledStudents(Long courseId, String subject, String body);

    LecturerResponse getById(Long id);

    Page<LecturerResponse> getAll(Pageable pageable, String searchText) ;

    LecturerResponse getByLecturerId(Long id);

    LecturerResponse updateLecturer(Long id, LecturerUpdateRequest request);

}