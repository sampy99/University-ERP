package com.erp.modern_erp.repository;

import com.erp.modern_erp.entity.Assignment;
import com.erp.modern_erp.entity.AssignmentMaterial;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.LectureMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentMaterialRepository extends JpaRepository<AssignmentMaterial, Long> {

    List<AssignmentMaterial> findByAssignment(Assignment assignment);
    Optional<AssignmentMaterial> findByFileId(String fileId);
    List<AssignmentMaterial> findByAssignmentId(Long assignmentId);

    Optional<AssignmentMaterial> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);

}
