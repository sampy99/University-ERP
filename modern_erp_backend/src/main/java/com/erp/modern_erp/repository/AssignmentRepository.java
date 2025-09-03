package com.erp.modern_erp.repository;

import com.erp.modern_erp.entity.Assignment;
import com.erp.modern_erp.entity.AssignmentMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseId(Long courseId);


}