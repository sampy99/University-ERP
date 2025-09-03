package com.erp.modern_erp.service.impl;


import com.erp.modern_erp.config.StorageProperties;
import com.erp.modern_erp.dto.response.AssignmentResponse;
import com.erp.modern_erp.dto.response.AssignmentUploadResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.entity.*;
import com.erp.modern_erp.repository.AssignmentMaterialRepository;
import com.erp.modern_erp.repository.StudentRepository;
import com.erp.modern_erp.service.AssignmentStorageService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AssignmentStorageServiceImpl implements AssignmentStorageService {

    private final Path root;
    private final AssignmentMaterialRepository  repo;
    private final StudentRepository studentRepository;

    public AssignmentStorageServiceImpl(StorageProperties props, AssignmentMaterialRepository repo, StudentRepository studentRepository) throws IOException {
        this.root = Paths.get(props.getBaseDir()).toAbsolutePath().normalize();
        this.repo = repo;
        this.studentRepository = studentRepository;
        Files.createDirectories(root);
    }

    /** Store a file for a course */
    public AssignmentMaterial store(MultipartFile file, String description, Assignment assignment, Long studentId ) {
        try {

            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found: "));

            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileId = UUID.randomUUID().toString();

            // Organize into subfolder by date
            Path dateDir = root.resolve(LocalDate.now().toString());
            Files.createDirectories(dateDir);

            Path target = dateDir.resolve(originalName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            AssignmentMaterial material = AssignmentMaterial.builder()
                    .description(description != null ? description : originalName) // comes from frontend
                    .fileName(originalName)                      // always original name
                    .fileId(fileId)                              // UUID
                    .filePath(root.relativize(target).toString())// relative storage path
                    .assignment(assignment)
                    .uploadedDate(LocalDateTime.now())
                    .student(student)
                    .build();


            return repo.save(material);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }

    /** Store multiple files */
    public List<AssignmentMaterial> storeAll(List<MultipartFile> files, Assignment assignment, Long studentId ) {
        return files.stream()
                .map(file -> store(file, file.getOriginalFilename(), assignment, studentId))
                .toList();
    }

    /** Load file by its fileId */
    public Resource loadAsResource(String fileId) {
        AssignmentMaterial material = repo.findByFileId(fileId)
                .orElseThrow(() -> new RuntimeException("File not found: " + fileId));

        Path path = root.resolve(material.getFilePath());
        return new FileSystemResource(path);
    }

    /** Get metadata by fileId */
    public AssignmentMaterial getMeta(String fileId) {
        return repo.findByFileId(fileId)
                .orElseThrow(() -> new RuntimeException("File not found: " + fileId));
    }

    public List<AssignmentMaterial> getByAssignment(Long assignmentId) {
        return repo.findByAssignmentId(assignmentId);
    }

    public AssignmentUploadResponse assignmentSubmissionDetails(Long assignmentId, Long studentId) {
        return repo
                .findByAssignmentIdAndStudentId(assignmentId, studentId)
                .map(this::convert)
                .orElse(null);  // return null if not found
    }


    private AssignmentUploadResponse convert(AssignmentMaterial material) {
        if (material == null) return null;

        AssignmentUploadResponse response = new AssignmentUploadResponse();
        response.setId(material.getId());
        response.setFileId(material.getFileId());
        response.setFileName(material.getFileName());
        response.setDescription(material.getDescription());
        response.setUploadedDate(material.getUploadedDate());
        response.setFilePath(material.getFilePath());

        response.setStudent(convertStudentToResponse(material.getStudent()));
        response.setAssignment(convertToResponse(material.getAssignment()));

        return response;
    }

    private AssignmentResponse convertToResponse(Assignment assignment) {
        AssignmentResponse response = new AssignmentResponse();
        response.setId(assignment.getId());

        response.setDescription(assignment.getDescription());
        response.setTitle(assignment.getTitle());
        response.setDueDate(assignment.getDueDate());

        return response;
    }

    private StudentResponse convertStudentToResponse(Student student) {
        if (student == null) return null;

        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setFirstName(student.getFirstName());
        response.setLastName(student.getLastName());
        response.setNic(student.getNic());
        response.setEmail(student.getEmail());
        response.setStudentNumber(student.getStudentNumber());
        return response;
    }
}
