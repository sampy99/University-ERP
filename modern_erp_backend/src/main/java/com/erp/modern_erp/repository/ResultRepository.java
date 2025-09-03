package com.erp.modern_erp.repository;

import com.erp.modern_erp.entity.Result;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.Student;
import com.erp.modern_erp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudent(Student student);
    Optional<Result> findByStudentAndCourse(Student student, Course course);

    boolean existsByStudentIdAndCourseId(Long student, Long course);

    Optional<Result> findByStudentIdAndCourseId(Long student, Long course);

    List<Result> findByStudentId(Long student);


    List<Result> findByCourseId(Long course);


}