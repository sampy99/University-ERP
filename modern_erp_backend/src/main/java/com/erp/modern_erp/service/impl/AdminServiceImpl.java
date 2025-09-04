package com.erp.modern_erp.service.impl;

import com.erp.modern_erp.dto.request.LecturerUpdateRequest;
import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.entity.Admin;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.Lecturer;
import com.erp.modern_erp.entity.User;
import com.erp.modern_erp.repository.AdminRepository;
import com.erp.modern_erp.repository.CourseRepository;
import com.erp.modern_erp.repository.LecturerRepository;
import com.erp.modern_erp.repository.UserRepository;
import com.erp.modern_erp.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LecturerRepository lecturerRepository;
    private final AdminRepository adminRepository;

    @Override
    public Course createCourse(String code,String semester, String title, Long lecturerId) {
        if (courseRepository.existsByCode(code)) {
            throw new IllegalArgumentException("Course code already exists");
        }
        Course course = Course.builder().code(code).title(title).semester(Semester.valueOf(semester)).build();
        if (lecturerId != null) {
            Lecturer lec = lecturerRepository.findById(lecturerId).orElseThrow();
            course.setLecturer(lec);
        }
        return courseRepository.save(course);
    }

    @Transactional
    @Override
    public Course assignLecturer(Long courseId, Long lecturerId) {
        Course course = courseRepository.findById(courseId).orElseThrow();
        Lecturer lecturer = lecturerRepository.findById(lecturerId).orElseThrow();
        course.setLecturer(lecturer);
        return course;
    }

    @Override
    public User updateUser(Long userId, String fullName, String email, String username) {
        User u = userRepository.findById(userId).orElseThrow();
        if (fullName != null) u.setFullName(fullName);
        if (email != null) u.setEmail(email);
        if (username != null) u.setUsername(username);
        return userRepository.save(u);
    }

    @Override
    public LecturerResponse getById(Long id){
        Admin lecturer = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        return convert(lecturer);
    }

    private LecturerResponse convert(Admin lecturer) {
        if (lecturer == null) return null;

        LecturerResponse response = new LecturerResponse();
        response.setId(lecturer.getId());
        response.setFirstName(lecturer.getFirstName());
        response.setLastName(lecturer.getLastName());
        response.setNic(lecturer.getNic());
        response.setEmail(lecturer.getEmail());
        response.setPhone(lecturer.getPhone());
        response.setStaffNumber(lecturer.getStaffNumber());
        response.setAddressLine1(lecturer.getAddressLine1());
        response.setAddressLine2(lecturer.getAddressLine2());
        response.setAddressLine3(lecturer.getAddressLine3());
        return response;
    }

    public Page<LecturerResponse> getAll(Pageable pageable, String searchText) {
        return adminRepository.searchAdmins(searchText, pageable)
                .map(this::convert);
    }

    @Override
    public LecturerResponse getByAdminId(Long id) {
        return adminRepository.findById(id)
                .map(this::convert)
                .orElse(null);
    }

    public LecturerResponse updateAdmin(Long id, LecturerUpdateRequest request) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));

        if (request.getFirstName() != null && !request.getFirstName().equals(admin.getFirstName())) {
            admin.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null && !request.getLastName().equals(admin.getLastName())) {
            admin.setLastName(request.getLastName());
        }

        if (request.getNic() != null && !request.getNic().equals(admin.getNic())) {
            admin.setNic(request.getNic());
        }

        if (request.getEmail() != null && !request.getEmail().equals(admin.getEmail())) {
            admin.setEmail(request.getEmail());
        }

        if (request.getPhone() != null && !request.getPhone().equals(admin.getPhone())) {
            admin.setPhone(request.getPhone());
        }

        if (request.getStaffNumber() != null && !request.getStaffNumber().equals(admin.getStaffNumber())) {
            admin.setStaffNumber(request.getStaffNumber());
        }

        if (request.getAddressLine1() != null && !request.getAddressLine1().equals(admin.getAddressLine1())) {
            admin.setAddressLine1(request.getAddressLine1());
        }

        if (request.getAddressLine2() != null && !request.getAddressLine2().equals(admin.getAddressLine2())) {
            admin.setAddressLine2(request.getAddressLine2());
        }

        if (request.getAddressLine3() != null && !request.getAddressLine3().equals(admin.getAddressLine3())) {
            admin.setAddressLine3(request.getAddressLine3());
        }

        Admin savedAdmin = adminRepository.save(admin); // save changes
        return convert(savedAdmin);
    }


}
