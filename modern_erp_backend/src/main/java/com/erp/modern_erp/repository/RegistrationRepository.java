package com.erp.modern_erp.repository;

import com.erp.modern_erp.entity.Registration;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.Student;
import com.erp.modern_erp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudent(Student student);
    List<Registration> findByCourse(Course course);
    boolean existsByStudentAndCourse(Student student, Course course);
    Optional<Registration> findByStudentAndCourse(User student, Course course);

    List<Registration> findByCourseId(Long courseId);

    @Query("SELECT r FROM Registration r JOIN FETCH r.student WHERE r.course.id = :courseId")
    Page<Registration> findByCourseId(@Param("courseId") Long courseId, Pageable pageable);

}