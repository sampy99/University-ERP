package com.erp.modern_erp.repository;

import com.erp.modern_erp.entity.Admin;
import com.erp.modern_erp.entity.Lecturer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

public interface AdminRepository extends JpaRepository<Admin, Long> {


        @Query(
                value = """
          SELECT * FROM admins l
          WHERE (:searchText IS NULL OR
                 l.staff_number LIKE %:searchText% OR
                 l.first_name LIKE %:searchText% OR
                 l.last_name LIKE %:searchText% OR
                 l.email LIKE %:searchText% OR
                 l.phone LIKE %:searchText% OR
                 l.nic LIKE %:searchText%)
          """,
                countQuery = """
          SELECT COUNT(*) FROM admins l
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
        Page<Admin> searchAdmins(@Param("searchText") String searchText, Pageable pageable);
}
