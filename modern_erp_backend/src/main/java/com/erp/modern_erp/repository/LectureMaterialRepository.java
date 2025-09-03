package com.erp.modern_erp.repository;

import com.erp.modern_erp.entity.LectureMaterial;
import com.erp.modern_erp.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LectureMaterialRepository extends JpaRepository<LectureMaterial, Long> {
    List<LectureMaterial> findByCourse(Course course);
    Optional<LectureMaterial> findByFileId(String fileId);
    List<LectureMaterial> findByCourseId(Long courseId);
}