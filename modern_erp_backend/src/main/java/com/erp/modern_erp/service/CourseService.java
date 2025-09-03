package com.erp.modern_erp.service;

import com.erp.modern_erp.dto.request.CourseRequest;
import com.erp.modern_erp.dto.request.CourseUpdateRequest;
import com.erp.modern_erp.dto.response.CourseResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.enums.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CourseService {

    CourseResponse createCourse(CourseRequest request);
    List<CourseResponse> getAllCourses();
    CourseResponse getCourseById(Long id);
    CourseResponse getCourseByCode(String code);
    CourseResponse updateCourse(CourseUpdateRequest request);
    void deleteCourse(Long id);
    List<CourseResponse> getCoursesByLecturer(Long lecturerId);
    List<CourseResponse> getCoursesBySemester(Semester semester);

    Page<CourseResponse> getUnassignedCourses(Pageable pageable, String searchText);

}
