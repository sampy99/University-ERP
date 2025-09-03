package com.erp.modern_erp.service.impl;

import com.erp.modern_erp.dto.request.LecturerUpdateRequest;
import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.entity.*;
import com.erp.modern_erp.repository.*;
import com.erp.modern_erp.service.LecturerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LecturerServiceImpl implements LecturerService {
    private final CourseRepository courseRepository;
    private final RegistrationRepository registrationRepository;
    private final LectureMaterialRepository materialRepository;
    private final JavaMailSender mailSender;
    private final LecturerRepository lecturerRepository;

    private final Path uploadDir = Path.of("uploads/materials");

    @Override
    public List<Course> dashboardCourses(Long lecturerId) {

        Lecturer lecturer = lecturerRepository.findById(lecturerId)
                .orElseThrow(() -> new IllegalArgumentException("Lecturer not found"));

        return courseRepository.findByLecturer(lecturer);
    }

    @Override
    public LectureMaterial uploadMaterial(Long courseId, String title, MultipartFile file) throws IOException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        Files.createDirectories(uploadDir);
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path dest = uploadDir.resolve(filename);
        file.transferTo(dest.toFile());
        LectureMaterial mat = LectureMaterial.builder()
                .course(course).title(title).filePath("/files/" + filename).build();
        return materialRepository.save(mat);
    }

    @Override
    public int emailEnrolledStudents(Long courseId, String subject, String body) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        List<Registration> regs = registrationRepository.findByCourse(course);
        int count = 0;
        for (Registration r : regs) {
            String email = r.getStudent().getEmail();
            if (email == null || email.isBlank()) continue;
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            count++;
        }
        return count;
    }

    @Override
    public LecturerResponse getById(Long id){
        Lecturer lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));
        return convert(lecturer);
    }

    private LecturerResponse convert(Lecturer lecturer) {
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
        return lecturerRepository.searchLecturers(searchText, pageable)
                .map(this::convert);
    }



    @Override
    public LecturerResponse getByLecturerId(Long id) {
        return lecturerRepository.findById(id)
                .map(this::convert)
                .orElse(null);
    }

    public LecturerResponse updateLecturer(Long id, LecturerUpdateRequest request) {
        Lecturer admin = lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));

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

        Lecturer savedAdmin = lecturerRepository.save(admin); // save changes
        return convert(savedAdmin);
    }

}