package com.erp.modern_erp.controller;

import com.erp.modern_erp.dto.request.AssignmentRequest;
import com.erp.modern_erp.dto.request.AssignmentUpdateRequest;
import com.erp.modern_erp.dto.response.AssignmentResponse;
import com.erp.modern_erp.service.AssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@Validated
@Tag(name = "Assignment Management", description = "APIs for managing student assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }


    @PostMapping
    public ResponseEntity<AssignmentResponse> createAssignment(@Valid @RequestBody AssignmentRequest request) {
        AssignmentResponse createdAssignment = assignmentService.createAssignment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAssignment);
    }


    @GetMapping
    public ResponseEntity<List<AssignmentResponse>> getAllAssignments() {
        List<AssignmentResponse> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(assignments);
    }


    @GetMapping("/{id}")
    public ResponseEntity<AssignmentResponse> getAssignmentById(@PathVariable Long id) {
        AssignmentResponse assignment = assignmentService.getAssignmentById(id);
        return ResponseEntity.ok(assignment);
    }


    @PutMapping("/{id}")
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentUpdateRequest request) {
        AssignmentResponse updatedAssignment = assignmentService.updateAssignment(id, request);
        return ResponseEntity.ok(updatedAssignment);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByCourse(@PathVariable Long courseId) {
        List<AssignmentResponse> assignments = assignmentService.getAssignmentsByCourse(courseId);
        return ResponseEntity.ok(assignments);
    }



}