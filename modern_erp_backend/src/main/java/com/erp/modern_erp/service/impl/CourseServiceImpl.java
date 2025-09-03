package com.erp.modern_erp.service.impl;

import com.erp.modern_erp.dto.request.CourseRequest;
import com.erp.modern_erp.dto.request.CourseUpdateRequest;
import com.erp.modern_erp.dto.response.CourseResponse;
import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.Lecturer;
import com.erp.modern_erp.enums.Semester;
import com.erp.modern_erp.repository.CourseRepository;
import com.erp.modern_erp.repository.LecturerRepository;
import com.erp.modern_erp.repository.StudentRepository;
import com.erp.modern_erp.service.CourseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final LecturerRepository lecturerRepository;
    private final StudentRepository studentRepository;

    @Override
    public CourseResponse createCourse(CourseRequest request) {
        if (courseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Course with code " + request.getCode() + " already exists");
        }

        Lecturer lecturer = lecturerRepository.findById(request.getLecturer())
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + request.getLecturer()));

        Course course = new Course();
        course.setCode(request.getCode());
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());
        course.setSemester(Semester.valueOf(request.getSemester()));
        course.setLecturer(lecturer);

        Course savedCourse = courseRepository.save(course);
        return convertToResponse(savedCourse);
    }

    @Override
    @Transactional
    public List<CourseResponse> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        return convertToResponse(course);
    }

    @Override
    @Transactional
    public CourseResponse getCourseByCode(String code) {
        Course course = courseRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Course not found with code: " + code));
        return convertToResponse(course);
    }

    @Override
    public CourseResponse updateCourse(CourseUpdateRequest request) {
        Course existingCourse = courseRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + request.getId()));

        if (request.getTitle() != null) existingCourse.setTitle(request.getTitle());
        if (request.getDescription() != null) existingCourse.setDescription(request.getDescription());
        existingCourse.setCredits(request.getCredits());
        if (request.getSemester() != null) existingCourse.setSemester(request.getSemester());

        if (request.getLecturer() != null) {
            Lecturer lecturer = lecturerRepository.findById(request.getLecturer().getId())
                    .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + request.getLecturer().getId()));
            existingCourse.setLecturer(lecturer);
        }

        Course updatedCourse = courseRepository.save(existingCourse);
        return convertToResponse(updatedCourse);
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    @Override
    @Transactional
    public List<CourseResponse> getCoursesByLecturer(Long lecturerId) {
        List<Course> courses = courseRepository.findByLecturerId(lecturerId);
        return courses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<CourseResponse> getCoursesBySemester(Semester semester) {
        List<Course> courses = courseRepository.findBySemester(semester);
        return courses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private CourseResponse convertToResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setCode(course.getCode());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setCredits(course.getCredits());
        response.setSemester(course.getSemester());
        response.setLecturer(convertLecturerToResponse(course.getLecturer()));
        return response;
    }

    private LecturerResponse convertLecturerToResponse(Lecturer lecturer) {
        if (lecturer == null) return null;

        LecturerResponse response = new LecturerResponse();
        response.setId(lecturer.getId());
        response.setStaffNumber(lecturer.getStaffNumber());
        response.setFirstName(lecturer.getFirstName());
        response.setLastName(lecturer.getLastName());
        response.setEmail(lecturer.getEmail());
        return response;
    }

    public Page<CourseResponse> getUnassignedCourses(Pageable pageable, String searchText) {
        return courseRepository.findCoursesWithoutLecturerAndSearch(pageable, searchText)
                .map(this::convertToResponse);
    }


}