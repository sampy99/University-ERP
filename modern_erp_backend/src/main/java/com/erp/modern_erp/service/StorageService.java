package com.erp.modern_erp.service;

import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.LectureMaterial;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;


public interface StorageService {

    /** Store a file for a course */
     LectureMaterial store(MultipartFile file, String title, Course course);
    /** Store multiple files */
     List<LectureMaterial> storeAll(List<MultipartFile> files, Course course) ;

    /** Load file by its fileId */
     Resource loadAsResource(String fileId) ;
    /** Get metadata by fileId */
     LectureMaterial getMeta(String fileId) ;

     List<LectureMaterial> getByCourse(Long courseId) ;

    }
