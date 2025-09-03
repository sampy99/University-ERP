package com.erp.modern_erp.service;

import com.erp.modern_erp.dto.request.ResultRequest;
import com.erp.modern_erp.dto.request.ResultUpdateRequest;
import com.erp.modern_erp.dto.response.ResultResponse;

import java.util.List;

public interface ResultService {
    ResultResponse createResult(ResultRequest request);
    List<ResultResponse> getAllResults();
    ResultResponse getResultById(Long id);
    ResultResponse updateResult(Long id, ResultUpdateRequest request);
    void deleteResult(Long id);
    List<ResultResponse> getResultsByStudent(Long studentId);
    List<ResultResponse> getResultsByCourse(Long courseId);
    ResultResponse getResultByStudentAndCourse(Long studentId, Long courseId);
}
