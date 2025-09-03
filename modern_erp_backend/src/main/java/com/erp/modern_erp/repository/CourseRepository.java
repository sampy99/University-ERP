package com.erp.modern_erp.repository;

import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.Lecturer;
import com.erp.modern_erp.entity.User;
import com.erp.modern_erp.enums.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByLecturer(Lecturer lecturer);
    Optional<Course> findByCode(String code);
    boolean existsByCode(String code);
    List<Course> findByLecturerId(Long lecturerId);

    List<Course> findBySemester(Semester semester);

    @Query(value = "SELECT * FROM course c WHERE c.lecturer_id IS NULL",
            countQuery = "SELECT count(*) FROM course c WHERE c.lecturer_id IS NULL",
            nativeQuery = true)
    Page<Course> findCoursesWithoutLecturer(Pageable pageable);


        @Query(value = """
        SELECT *
        FROM course c
        WHERE c.lecturer_id IS NULL
          AND (
                :searchText IS NULL
                OR LOWER(c.title) LIKE LOWER(CONCAT('%', :searchText, '%'))
                OR LOWER(c.code) LIKE LOWER(CONCAT('%', :searchText, '%'))
                OR LOWER(c.semester) LIKE LOWER(CONCAT('%', :searchText, '%'))
              )
        """,
                countQuery = """
        SELECT COUNT(*)
        FROM course c
        WHERE c.lecturer_id IS NULL
          AND (
                :searchText IS NULL
                OR LOWER(c.title) LIKE LOWER(CONCAT('%', :searchText, '%'))
                OR LOWER(c.code) LIKE LOWER(CONCAT('%', :searchText, '%'))
                OR LOWER(c.semester) LIKE LOWER(CONCAT('%', :searchText, '%'))
              )
        """,
                nativeQuery = true)
        Page<Course> findCoursesWithoutLecturerAndSearch(Pageable pageable, @Param("searchText") String searchText);



}