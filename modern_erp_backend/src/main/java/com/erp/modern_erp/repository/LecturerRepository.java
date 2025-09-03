package com.erp.modern_erp.repository;

import com.erp.modern_erp.entity.Admin;
import com.erp.modern_erp.entity.Lecturer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LecturerRepository extends JpaRepository<Lecturer, Long> {
    Optional<Lecturer> findByStaffNumber(String staffNumber);
    Optional<Lecturer> findByNic(String nic);
    Optional<Lecturer> findByEmail(String email);
    boolean existsByStaffNumber(String staffNumber);
    boolean existsByNic(String nic);
    boolean existsByEmail(String email);
    List<Lecturer> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName, String lastName, String email);

    @Query(
            value = """
          SELECT * FROM lecturers l
          WHERE (:searchText IS NULL OR
                 l.staff_number LIKE %:searchText% OR
                 l.first_name LIKE %:searchText% OR
                 l.last_name LIKE %:searchText% OR
                 l.email LIKE %:searchText% OR
                 l.phone LIKE %:searchText% OR
                 l.nic LIKE %:searchText%)
          """,
            countQuery = """
          SELECT COUNT(*) FROM lecturers l
          WHERE (:searchText IS NULL OR
                 l.staff_number LIKE %:searchText% OR
                 l.first_name LIKE %:searchText% OR
                 l.last_name LIKE %:searchText% OR
                 l.email LIKE %:searchText% OR
                 l.phone LIKE %:searchText% OR
                 l.nic LIKE %:searchText%)
          """,
            nativeQuery = true
    )
    Page<Lecturer> searchLecturers(@Param("searchText") String searchText, Pageable pageable);

}
