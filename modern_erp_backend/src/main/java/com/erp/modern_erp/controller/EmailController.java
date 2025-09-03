package com.erp.modern_erp.controller;


import com.erp.modern_erp.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestParam String to,
                            @RequestParam String subject,
                            @RequestParam String body) {
        emailService.sendSimpleEmail(to, subject, body);
        return "Email sent successfully!";
    }

    @PostMapping("/course/send")
    public String sendEmail(@RequestParam Long courseId,
                            @RequestParam String subject,
                            @RequestParam String body) {
        emailService.sendSimpleEmailRelatedToModules(courseId, subject, body);
        return "Email sent successfully!";
    }
}
