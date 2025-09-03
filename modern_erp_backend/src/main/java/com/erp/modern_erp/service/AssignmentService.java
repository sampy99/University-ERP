package com.erp.modern_erp.service;

import com.erp.modern_erp.dto.request.AssignmentRequest;
import com.erp.modern_erp.dto.request.AssignmentUpdateRequest;
import com.erp.modern_erp.dto.response.AssignmentResponse;

import java.util.List;

public interface AssignmentService {

    AssignmentResponse createAssignment(AssignmentRequest request);
    List<AssignmentResponse> getAllAssignments();
    AssignmentResponse getAssignmentById(Long id);
    AssignmentResponse updateAssignment(Long id, AssignmentUpdateRequest request);
    void deleteAssignment(Long id);
    List<AssignmentResponse> getAssignmentsByCourse(Long courseId);

}
