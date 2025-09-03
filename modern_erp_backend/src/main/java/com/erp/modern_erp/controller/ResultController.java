package com.erp.modern_erp.controller;

import com.erp.modern_erp.dto.request.ResultRequest;
import com.erp.modern_erp.dto.request.ResultUpdateRequest;
import com.erp.modern_erp.dto.response.ResultResponse;
import com.erp.modern_erp.service.ResultService;
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
@RequestMapping("/api/results")
@Validated
@Tag(name = "Result Management", description = "APIs for managing student results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @Operation(summary = "Create a new result", description = "Creates a new result record for a student in a course")
    @PostMapping
    public ResponseEntity<ResultResponse> createResult(@Valid @RequestBody ResultRequest request) {
        ResultResponse createdResult = resultService.createResult(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdResult);
    }

    @Operation(summary = "Get all results", description = "Retrieves a list of all results")
    @GetMapping
    public ResponseEntity<List<ResultResponse>> getAllResults() {
        List<ResultResponse> results = resultService.getAllResults();
        return ResponseEntity.ok(results);
    }

    @Operation(summary = "Get result by ID", description = "Retrieves a specific result by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResultResponse> getResultById(@PathVariable Long id) {
        ResultResponse result = resultService.getResultById(id);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Update result", description = "Updates an existing result record")
    @PutMapping("/{id}")
    public ResponseEntity<ResultResponse> updateResult(
            @PathVariable Long id,
            @Valid @RequestBody ResultUpdateRequest request) {
        ResultResponse updatedResult = resultService.updateResult(id, request);
        return ResponseEntity.ok(updatedResult);
    }

    @Operation(summary = "Delete result", description = "Deletes a result record by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get results by student", description = "Retrieves all results for a specific student")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved student results")
    @ApiResponse(responseCode = "404", description = "Student not found")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ResultResponse>> getResultsByStudent(@PathVariable Long studentId) {
        List<ResultResponse> results = resultService.getResultsByStudent(studentId);
        return ResponseEntity.ok(results);
    }

    @Operation(summary = "Get results by course", description = "Retrieves all results for a specific course")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved course results")
    @ApiResponse(responseCode = "404", description = "Course not found")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ResultResponse>> getResultsByCourse(@PathVariable Long courseId) {
        List<ResultResponse> results = resultService.getResultsByCourse(courseId);
        return ResponseEntity.ok(results);
    }

    @Operation(summary = "Get result by student and course", description = "Retrieves a specific result for a student in a course")
    @ApiResponse(responseCode = "200", description = "Result found")
    @ApiResponse(responseCode = "404", description = "Result not found")
    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<ResultResponse> getResultByStudentAndCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        ResultResponse result = resultService.getResultByStudentAndCourse(studentId, courseId);
        return ResponseEntity.ok(result);
    }
}