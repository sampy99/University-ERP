package com.erp.modern_erp.repository;

import com.erp.modern_erp.dto.request.StudentRequest;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.entity.Lecturer;
import com.erp.modern_erp.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByNic(String nic);
    Optional<Student> findByStudentNumber(String studentId);
    boolean existsByNic(String nic);
    boolean existsByStudentNumber(String studentId);
    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName, String lastName, String email);

    @Query(
            value = """
          SELECT * FROM students l
          WHERE (:searchText IS NULL OR
                 l.student_number LIKE %:searchText% OR
                 l.first_name LIKE %:searchText% OR
                 l.last_name LIKE %:searchText% OR
                 l.email LIKE %:searchText% OR
                 l.phone LIKE %:searchText% OR
                 l.nic LIKE %:searchText%)
          """,
            countQuery = """
          SELECT COUNT(*) FROM students l
          WHERE (:searchText IS NULL OR
                 l.student_number LIKE %:searchText% OR
                 l.first_name LIKE %:searchText% OR
                 l.last_name LIKE %:searchText% OR
                 l.email LIKE %:searchText% OR
                 l.phone LIKE %:searchText% OR
                 l.nic LIKE %:searchText%)
          """,
            nativeQuery = true
    )
    Page<Student> searchStudents(@Param("searchText") String searchText, Pageable pageable);

}