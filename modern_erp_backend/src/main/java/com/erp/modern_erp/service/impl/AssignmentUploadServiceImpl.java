//package com.erp.modern_erp.service.impl;
//
//import com.erp.modern_erp.dto.request.AssignmentRequest;
//import com.erp.modern_erp.dto.request.AssignmentUpdateRequest;
//import com.erp.modern_erp.dto.request.AssignmentUploadRequest;
//import com.erp.modern_erp.dto.response.AssignmentResponse;
//import com.erp.modern_erp.dto.response.AssignmentUploadResponse;
//import com.erp.modern_erp.dto.response.CourseResponse;
//import com.erp.modern_erp.dto.response.StudentResponse;
//import com.erp.modern_erp.entity.AssignmentMaterial;
//import com.erp.modern_erp.entity.Course;
//import com.erp.modern_erp.entity.Student;
//import com.erp.modern_erp.repository.AssignmentMaterialRepository;
//import com.erp.modern_erp.repository.AssignmentRepository;
//import com.erp.modern_erp.repository.CourseRepository;
//import com.erp.modern_erp.repository.StudentRepository;
//import com.erp.modern_erp.service.AssignmentService;
//import com.erp.modern_erp.service.AssignmentUploadService;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@Transactional
//@RequiredArgsConstructor
//public class AssignmentUploadServiceImpl implements AssignmentUploadService {
//
//    private final AssignmentMaterialRepository assignmentUploadRepository;
//    private final CourseRepository courseRepository;
//    private final StudentRepository studentRepository;
//
//    @Override
//    public AssignmentUploadResponse uploadAssignment(AssignmentUploadRequest request) {
//
//
//        Student student = studentRepository.findById(request.getStudent())
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//
//        AssignmentMaterial assignment = new AssignmentMaterial();
//        assignment.setDescription(request.getDescription());
//        assignment.setFileName(request.getFileName());
//        assignment.setFilePath(request.getFilePath());
//        assignment.setCourse(course);
//        assignment.setStudent(student);
//
//        AssignmentMaterial savedAssignment = assignmentUploadRepository.save(assignment);
//        return convertToResponse(savedAssignment);
//    }
//
//    @Override
//    @Transactional
//    public List<AssignmentUploadResponse> getAllAssignments() {
//        List<AssignmentMaterial> assignments = assignmentUploadRepository.findAll();
//        return assignments.stream()
//                .map(this::convertToResponse)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public AssignmentUploadResponse getAssignmentById(Long id) {
//        AssignmentMaterial assignment = assignmentUploadRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Assignment not found"));
//        return convertToResponse(assignment);
//    }
//
//    @Override
//    public AssignmentUploadResponse updateAssignment(Long id, AssignmentUpdateRequest request) {
//        AssignmentMaterial existingAssignment = assignmentUploadRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Assignment not found"));
//
//        if (request.getDescription() != null) existingAssignment.setDescription(request.getDescription());
//        if (request.getFileName() != null) existingAssignment.setFileName(request.getFileName());
//        if (request.getFilePath() != null) existingAssignment.setFilePath(request.getFilePath());
//
//        if (request.getCourse().getId() != null) {
//            Course course = courseRepository.findById(request.getCourse().getId())
//                    .orElseThrow(() -> new RuntimeException("Course not found"));
//            existingAssignment.setCourse(course);
//        }
//
//        if (request.getStudent() != null) {
//            Student student = studentRepository.findById(request.getStudent().getId())
//                    .orElseThrow(() -> new RuntimeException("Student not found"));
//            existingAssignment.setStudent(student);
//        }
//
//        AssignmentMaterial updatedAssignment = assignmentUploadRepository.save(existingAssignment);
//        return convertToResponse(updatedAssignment);
//    }
//
//    @Override
//    public void deleteAssignment(Long id) {
//        if (!assignmentRepository.existsById(id)) {
//            throw new RuntimeException("Assignment not found");
//        }
//        assignmentRepository.deleteById(id);
//    }
//
//    @Override
//    @Transactional
//    public List<AssignmentUploadResponse> getAssignmentsByCourse(Long courseId) {
//        List<AssignmentMaterial> assignments = assignmentUploadRepository.findByCourseId(courseId);
//        return assignments.stream()
//                .map(this::convertToResponse)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public List<AssignmentUploadResponse> getAssignmentsByStudent(Long studentId) {
//        List<AssignmentMaterial> assignments = assignmentUploadRepository.findByStudentId(studentId);
//        return assignments.stream()
//                .map(this::convertToResponse)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public List<AssignmentResponse> getAssignmentsByCourseAndStudent(Long courseId, Long studentId) {
//        List<AssignmentMaterial> assignments = assignmentUploadRepository.findByCourseIdAndStudentId(courseId, studentId);
//        return assignments.stream()
//                .map(this::convertToResponse)
//                .collect(Collectors.toList());
//    }
//
//    private AssignmentUploadResponse convertToResponse(AssignmentMaterial assignment) {
//        AssignmentUploadResponse response = new AssignmentUploadResponse();
//        response.setId(assignment.getId());
//
//        response.setDescription(assignment.getDescription());
//        response.setFileName(assignment.getFileName());
//        response.setUploadedDate(assignment.getUploadDate());
//        response.setFilePath(assignment.getFilePath());
//        response.setCourse(convertCourseToResponse(assignment.getCourse()));
//        response.setStudent(convertStudentToResponse(assignment.getStudent()));
//        return response;
//    }
//
//
//    private CourseResponse convertCourseToResponse(Course course) {
//        CourseResponse response = new CourseResponse();
//        response.setId(course.getId());
//        response.setCode(course.getCode());
//        response.setTitle(course.getTitle());
//        response.setDescription(course.getDescription());
//        response.setCredits(course.getCredits());
//        response.setSemester(course.getSemester());
//        //response.setLecturer(course.getLecturer().getId());
//        return response;
//    }
//    private StudentResponse convertStudentToResponse(Student student) {
//        // Implement similar to StudentService conversion
//        return null;
//    }
//}