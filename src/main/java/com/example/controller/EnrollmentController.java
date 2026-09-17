package com.example.javaExpert.controller;

import com.example.javaExpert.entity.Enrollment;
import com.example.javaExpert.repository.EnrollmentRepository;
import com.example.javaExpert.repository.StudentRepository;
import com.example.javaExpert.repository.CourseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;


    // =========================
    // CREATE ENROLLMENT
    // =========================
    @PostMapping
    public ResponseEntity<?> createEnrollment(
            @RequestBody Enrollment enrollment) {

        // Check student exists
        if (!studentRepository.existsById(enrollment.getStudentId())) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Student not found");
        }

        // Check course exists
        if (!courseRepository.existsById(enrollment.getCourseId())) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Course not found");
        }

        // Check duplicate enrollment
        if (enrollmentRepository.existsByStudentIdAndCourseId(
                enrollment.getStudentId(),
                enrollment.getCourseId())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Student already enrolled");
        }

        // Save enrollment
        Enrollment savedEnrollment =
                enrollmentRepository.save(enrollment);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedEnrollment);
    }


    // =========================
    // GET ALL ENROLLMENTS
    // =========================
    @GetMapping
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {

        List<Enrollment> enrollments =
                enrollmentRepository.findAll();

        return ResponseEntity.ok(enrollments);
    }


    // =========================
    // GET ENROLLMENT BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getEnrollmentById(
            @PathVariable Integer id) {

        Optional<Enrollment> enrollment =
                enrollmentRepository.findById(id);

        if (enrollment.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Enrollment not found");
        }

        return ResponseEntity.ok(enrollment.get());
    }


    // =========================
    // UPDATE ENROLLMENT
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnrollment(
            @PathVariable Integer id,
            @RequestBody Enrollment enrollmentDetails) {

        Optional<Enrollment> existingEnrollment =
                enrollmentRepository.findById(id);

        if (existingEnrollment.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Enrollment not found");
        }

        Enrollment enrollment = existingEnrollment.get();

        enrollment.setStudentId(enrollmentDetails.getStudentId());
        enrollment.setCourseId(enrollmentDetails.getCourseId());
        enrollment.setEnrollmentDate(
                enrollmentDetails.getEnrollmentDate());
        enrollment.setStatus(enrollmentDetails.getStatus());

        Enrollment updatedEnrollment =
                enrollmentRepository.save(enrollment);

        return ResponseEntity.ok(updatedEnrollment);
    }


    // =========================
    // DELETE ENROLLMENT
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnrollment(
            @PathVariable Integer id) {

        if (!enrollmentRepository.existsById(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Enrollment not found");
        }

        enrollmentRepository.deleteById(id);

        return ResponseEntity.ok(
                "Enrollment deleted successfully");
    }
}
