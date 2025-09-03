package com.erp.modern_erp.service.impl;


import com.erp.modern_erp.config.StorageProperties;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.LectureMaterial;
import com.erp.modern_erp.repository.LectureMaterialRepository;
import com.erp.modern_erp.service.StorageService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class StorageServiceImpl implements StorageService {

    private final Path root;
    private final LectureMaterialRepository repo;

    public StorageServiceImpl(StorageProperties props, LectureMaterialRepository repo) throws IOException {
        this.root = Paths.get(props.getBaseDir()).toAbsolutePath().normalize();
        this.repo = repo;
        Files.createDirectories(root);
    }

    /** Store a file for a course */
    public LectureMaterial store(MultipartFile file, String title, Course course) {
        try {
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileId = UUID.randomUUID().toString();

            // Organize into subfolder by date
            Path dateDir = root.resolve(LocalDate.now().toString());
            Files.createDirectories(dateDir);

            Path target = dateDir.resolve(originalName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            LectureMaterial material = LectureMaterial.builder()
                    .title(title != null ? title : originalName) // comes from frontend
                    .fileName(originalName)                      // always original name
                    .fileId(fileId)                              // UUID
                    .filePath(root.relativize(target).toString())// relative storage path
                    .course(course)
                    .uploadedDate(LocalDateTime.now())
                    .build();


            return repo.save(material);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }

    /** Store multiple files */
    public List<LectureMaterial> storeAll(List<MultipartFile> files, Course course) {
        return files.stream()
                .map(file -> store(file, file.getOriginalFilename(), course))
                .toList();
    }

    /** Load file by its fileId */
    public Resource loadAsResource(String fileId) {
        LectureMaterial material = repo.findByFileId(fileId)
                .orElseThrow(() -> new RuntimeException("File not found: " + fileId));

        Path path = root.resolve(material.getFilePath());
        return new FileSystemResource(path);
    }

    /** Get metadata by fileId */
    public LectureMaterial getMeta(String fileId) {
        return repo.findByFileId(fileId)
                .orElseThrow(() -> new RuntimeException("File not found: " + fileId));
    }

    public List<LectureMaterial> getByCourse(Long courseId) {
        return repo.findByCourseId(courseId);
    }

}
