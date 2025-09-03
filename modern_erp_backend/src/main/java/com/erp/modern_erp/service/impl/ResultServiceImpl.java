package com.erp.modern_erp.service.impl;

import com.erp.modern_erp.dto.request.ResultRequest;
import com.erp.modern_erp.dto.request.ResultUpdateRequest;
import com.erp.modern_erp.dto.response.CourseResponse;
import com.erp.modern_erp.dto.response.ResultResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.Result;
import com.erp.modern_erp.entity.Student;
import com.erp.modern_erp.repository.CourseRepository;
import com.erp.modern_erp.repository.ResultRepository;
import com.erp.modern_erp.repository.StudentRepository;
import com.erp.modern_erp.service.ResultService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Override
    public ResultResponse createResult(ResultRequest request) {
        // Check if result already exists for this student and course
        if (resultRepository.existsByStudentIdAndCourseId(request.getStudent(), request.getCourse())) {
            throw new RuntimeException("Result already exists for student ID " + request.getStudent() +
                    " and course ID " + request.getCourse());
        }

        // Validate marks range
        if (request.getMarks() < 0 || request.getMarks() > 100) {
            throw new RuntimeException("Marks must be between 0 and 100");
        }

        Student student = studentRepository.findById(request.getStudent())
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + request.getStudent()));

        Course course = courseRepository.findById(request.getCourse())
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + request.getCourse()));

        Result result = new Result();
        result.setMarks(request.getMarks());
        result.setGrade(request.getGrade());
        result.setStudent(student);
        result.setCourse(course);

        Result savedResult = resultRepository.save(result);
        return convertToResponse(savedResult);
    }

    @Override
    @Transactional
    public List<ResultResponse> getAllResults() {
        List<Result> results = resultRepository.findAll();
        return results.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ResultResponse getResultById(Long id) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found with ID: " + id));
        return convertToResponse(result);
    }

    @Override
    public ResultResponse updateResult(Long id, ResultUpdateRequest request) {
        Result existingResult = resultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found with ID: " + id));

        // Validate marks if provided
        if (request.getMarks() != null && (request.getMarks() < 0 || request.getMarks() > 100)) {
            throw new RuntimeException("Marks must be between 0 and 100");
        }

        // Update fields if provided
        if (request.getMarks() != null) {
            existingResult.setMarks(request.getMarks());
        }
        if (request.getGrade() != null) {
            existingResult.setGrade(request.getGrade());
        }


        Result updatedResult = resultRepository.save(existingResult);
        return convertToResponse(updatedResult);
    }

    @Override
    public void deleteResult(Long id) {
        if (!resultRepository.existsById(id)) {
            throw new RuntimeException("Result not found with ID: " + id);
        }
        resultRepository.deleteById(id);
    }

    @Override
    @Transactional
    public List<ResultResponse> getResultsByStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }

        List<Result> results = resultRepository.findByStudentId(studentId);
        return results.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ResultResponse> getResultsByCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found with ID: " + courseId);
        }

        List<Result> results = resultRepository.findByCourseId(courseId);
        return results.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ResultResponse getResultByStudentAndCourse(Long studentId, Long courseId) {
        if (!studentRepository.existsById(studentId)) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found with ID: " + courseId);
        }

        Result result = resultRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Result not found for student ID " + studentId +
                        " and course ID " + courseId));
        return convertToResponse(result);
    }

    private ResultResponse convertToResponse(Result result) {
        ResultResponse response = new ResultResponse();
        response.setId(result.getId());
        response.setMarks(result.getMarks());
        response.setGrade(result.getGrade());
        //response.setStudent(convertStudentToResponse(result.getStudent()));
        //response.setCourse(convertCourseToResponse(result.getCourse()));

        return response;
    }

    private StudentResponse convertStudentToResponse(Student student) {
        if (student == null) return null;

        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setFirstName(student.getFirstName());
        response.setLastName(student.getLastName());
        response.setNic(student.getNic());
        response.setEmail(student.getEmail());
        response.setStudentNumber(student.getStudentNumber());
        return response;
    }

    private CourseResponse convertCourseToResponse(Course course) {
        if (course == null) return null;

        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setCode(course.getCode());
        response.setTitle(course.getTitle());
        response.setCredits(course.getCredits());
        response.setSemester(course.getSemester());
        return response;
    }
}