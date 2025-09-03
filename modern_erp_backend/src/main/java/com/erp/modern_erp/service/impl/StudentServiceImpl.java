package com.erp.modern_erp.service.impl;

import com.erp.modern_erp.dto.request.LecturerUpdateRequest;
import com.erp.modern_erp.dto.request.StudentUpdateRequest;
import com.erp.modern_erp.dto.response.*;
import com.erp.modern_erp.entity.*;
import com.erp.modern_erp.repository.*;
import com.erp.modern_erp.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final CourseRepository courseRepository;
    private final RegistrationRepository registrationRepository;
    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;

    @Override
    public List<CourseResponse> dashboardCourses(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        return registrationRepository.findByStudent(student)
                .stream()
                .map(reg -> convert(reg.getCourse()))  // get course from registration
                .toList();
    }

    private CourseResponse convert(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setCode(course.getCode());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setCredits(course.getCredits());
        response.setSemester(course.getSemester());
        response.setLecturer(convertLecturer(course.getLecturer()));
        return response;
    }
    @Transactional
    @Override
    public void enroll(Long student, Long courseId) {

        Student student1 = studentRepository.findById(student)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        if (registrationRepository.existsByStudentAndCourse(student1, course)) return;
        Registration reg = Registration.builder().student(student1).course(course).build();
        registrationRepository.save(reg);
    }

    @Override
    public List<Result> results(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        return resultRepository.findByStudent(student);
    }

    @Override
    public StudentResponse getById(Long id){
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("student not found with id: " + id));
        return convert(student);
    }

    private LecturerResponse convertLecturer(Lecturer lec) {
        if (lec == null) return null;

        LecturerResponse response = new LecturerResponse();
        response.setId(lec.getId());
        response.setFirstName(lec.getFirstName());
        response.setLastName(lec.getLastName());
        response.setNic(lec.getNic());
        response.setEmail(lec.getEmail());
        response.setPhone(lec.getPhone());
        response.setStaffNumber(lec.getStaffNumber());
        response.setAddressLine1(lec.getAddressLine1());
        response.setAddressLine2(lec.getAddressLine2());
        response.setAddressLine3(lec.getAddressLine3());
        return response;
    }

    private StudentResponse convert(Student student) {
        if (student == null) return null;

        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setFirstName(student.getFirstName());
        response.setLastName(student.getLastName());
        response.setNic(student.getNic());
        response.setEmail(student.getEmail());
        response.setPhone(student.getPhone());
        response.setStudentNumber(student.getStudentNumber());
        response.setAddressLine1(student.getAddressLine1());
        response.setAddressLine2(student.getAddressLine2());
        response.setAddressLine3(student.getAddressLine3());
        return response;
    }

    public Page<StudentResponse> getAll(Pageable pageable, String searchText) {
        return studentRepository.searchStudents(searchText, pageable)
                .map(this::convert);
    }

    public Page<StudentResultResponse> getEnrolledStudents(Pageable pageable, Long courseId) {
        Page<Registration> registrations = registrationRepository.findByCourseId(courseId, pageable);

        return registrations.map(reg -> {
            Student student = reg.getStudent();
            StudentResultResponse studentResponse = convertStudentResults(student);

            // Fetch result for this student + course
            resultRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                    .ifPresent(result -> {
                        ResultResponse resultResponse = new ResultResponse();
                        resultResponse.setId(result.getId());
                        resultResponse.setGrade(result.getGrade());
                        resultResponse.setMarks(result.getMarks());
                        studentResponse.setResult(resultResponse);
                    });

            return studentResponse;
        });
    }

    private StudentResultResponse convertStudentResults(Student student) {
        if (student == null) return null;

        StudentResultResponse response = new StudentResultResponse();
        response.setId(student.getId());
        response.setFirstName(student.getFirstName());
        response.setLastName(student.getLastName());
        response.setNic(student.getNic());
        response.setEmail(student.getEmail());
        response.setPhone(student.getPhone());
        response.setStudentNumber(student.getStudentNumber());
        response.setAddressLine1(student.getAddressLine1());
        response.setAddressLine2(student.getAddressLine2());
        response.setAddressLine3(student.getAddressLine3());
        return response;
    }


    @Override
    public StudentResponse getByStudentId(Long id) {
        return studentRepository.findById(id)
                .map(this::convert)
                .orElse(null);
    }

    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
        Student admin = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

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

        if (request.getStudentNumber() != null && !request.getStudentNumber().equals(admin.getStudentNumber())) {
            admin.setStudentNumber(request.getStudentNumber());
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

        Student savedAdmin = studentRepository.save(admin); // save changes
        return convert(savedAdmin);
    }

}