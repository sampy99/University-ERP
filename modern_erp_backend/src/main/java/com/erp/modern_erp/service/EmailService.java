package com.erp.modern_erp.service;

import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.Registration;
import com.erp.modern_erp.entity.Student;
import com.erp.modern_erp.repository.CourseRepository;
import com.erp.modern_erp.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    private final CourseRepository courseRepository;
    private final RegistrationRepository registrationRepository;

    public EmailService(CourseRepository courseRepository, RegistrationRepository registrationRepository) {
        this.courseRepository = courseRepository;
        this.registrationRepository = registrationRepository;
    }

    public void sendSimpleEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("sampath.chathurangarcg@gmail.com"); // must match spring.mail.username
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }



    public void sendSimpleEmailRelatedToModules(Long courseId, String subject, String body) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        List<Registration> registrations = registrationRepository.findByCourseId(courseId);

        for (Registration reg : registrations) {
            Student student = reg.getStudent();

            if (student.getEmail() != null && !student.getEmail().isEmpty()) {
                String emailBody = """
            Dear %s %s,

            %s

            ----------------------------
            Course: %s
            ----------------------------

            Best regards,
            Course Management System
            """.formatted(
                        student.getFirstName(),
                        student.getLastName(),
                        body,
                        course.getTitle()
                );

                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("sampath.chathurangarcg@gmail.com"); // must match spring.mail.username
                message.setTo(student.getEmail());
                message.setSubject(subject);
                message.setText(emailBody);

                mailSender.send(message);
            }

        }
    }
}
