package com.erp.modern_erp.service.impl;

import com.erp.modern_erp.dto.request.AssignmentRequest;
import com.erp.modern_erp.dto.request.AssignmentUpdateRequest;
import com.erp.modern_erp.dto.response.AssignmentResponse;
import com.erp.modern_erp.dto.response.CourseResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.entity.Assignment;
import com.erp.modern_erp.entity.AssignmentMaterial;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.Student;
import com.erp.modern_erp.repository.AssignmentRepository;
import com.erp.modern_erp.repository.CourseRepository;
import com.erp.modern_erp.repository.StudentRepository;
import com.erp.modern_erp.service.AssignmentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    @Override
    public AssignmentResponse createAssignment(AssignmentRequest request) {

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Assignment assignment = new Assignment();
        assignment.setDescription(request.getDescription());
        assignment.setTitle(request.getTitle());
        assignment.setDueDate(LocalDateTime.parse(request.getDueDate()));
        assignment.setCourse(course);;

        Assignment savedAssignment = assignmentRepository.save(assignment);
        return convertToResponse(savedAssignment);
    }

    @Override
    @Transactional
    public List<AssignmentResponse> getAllAssignments() {
        List<Assignment> assignments = assignmentRepository.findAll();
        return assignments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AssignmentResponse getAssignmentById(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        return convertToResponse(assignment);
    }

    @Override
    public AssignmentResponse updateAssignment(Long id, AssignmentUpdateRequest request) {
        Assignment existingAssignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (request.getDescription() != null) existingAssignment.setDescription(request.getDescription());
        if (request.getTitle() != null) existingAssignment.setTitle(request.getTitle());
        if (request.getDueDate() != null) existingAssignment.setDueDate(request.getDueDate());


        Assignment updatedAssignment = assignmentRepository.save(existingAssignment);
        return convertToResponse(updatedAssignment);
    }

    @Override
    public void deleteAssignment(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new RuntimeException("Assignment not found");
        }
        assignmentRepository.deleteById(id);
    }

    @Override
    @Transactional
    public List<AssignmentResponse> getAssignmentsByCourse(Long courseId) {
        List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
        return assignments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }



    private AssignmentResponse convertToResponse(Assignment assignment) {
        AssignmentResponse response = new AssignmentResponse();
        response.setId(assignment.getId());

        response.setDescription(assignment.getDescription());
        response.setTitle(assignment.getTitle());
        response.setDueDate(assignment.getDueDate());

        response.setCourse(convertCourseToResponse(assignment.getCourse()));

        return response;
    }


    private CourseResponse convertCourseToResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setCode(course.getCode());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setCredits(course.getCredits());
        response.setSemester(course.getSemester());
        //response.setLecturer(course.getLecturer().getId());
        return response;
    }

}