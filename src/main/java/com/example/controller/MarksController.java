package com.example.javaExpert.controller;

import com.example.javaExpert.entity.Marks;
import com.example.javaExpert.repository.MarksRepository;
import com.example.javaExpert.repository.StudentRepository;
import com.example.javaExpert.repository.CourseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/marks")
public class MarksController {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    // GET /marks
    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {

        List<Marks> marks = marksRepository.findAll();

        return ResponseEntity.ok(marks);
    }

    // GET /marks/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getMarksById(@PathVariable Integer id) {

        Optional<Marks> marks = marksRepository.findById(id);

        if (marks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Marks not found");
        }

        return ResponseEntity.ok(marks.get());
    }

    // POST /marks
    @PostMapping
    public ResponseEntity<?> createMarks(@RequestBody Marks marks) {

        // Check student exists
        if (!studentRepository.existsById(marks.getStudentId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Student not found");
        }

        // Check course exists
        if (!courseRepository.existsById(marks.getCourseId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Course not found");
        }

        // Marks cannot be negative
        if (marks.getMarks() < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Marks cannot be negative");
        }

        // Marks cannot be greater than total marks
        if (marks.getMarks() > marks.getTotalMarks()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Marks cannot be greater than total marks");
        }

        Marks savedMarks = marksRepository.save(marks);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedMarks);
    }

    // PUT /marks/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMarks(
            @PathVariable Integer id,
            @RequestBody Marks marksDetails) {

        Optional<Marks> existingMarks =
                marksRepository.findById(id);

        if (existingMarks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Marks not found");
        }

        // Check student exists
        if (!studentRepository.existsById(marksDetails.getStudentId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Student not found");
        }

        // Check course exists
        if (!courseRepository.existsById(marksDetails.getCourseId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Course not found");
        }

        // Marks cannot be negative
        if (marksDetails.getMarks() < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Marks cannot be negative");
        }

        // Marks cannot be greater than total marks
        if (marksDetails.getMarks() > marksDetails.getTotalMarks()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Marks cannot be greater than total marks");
        }

        Marks marks = existingMarks.get();

        marks.setStudentId(marksDetails.getStudentId());
        marks.setCourseId(marksDetails.getCourseId());
        marks.setExamName(marksDetails.getExamName());
        marks.setMarks(marksDetails.getMarks());
        marks.setTotalMarks(marksDetails.getTotalMarks());

        Marks updatedMarks = marksRepository.save(marks);

        return ResponseEntity.ok(updatedMarks);
    }

    // DELETE /marks/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMarks(@PathVariable Integer id) {

        if (!marksRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Marks not found");
        }

        marksRepository.deleteById(id);

        return ResponseEntity.ok("Marks deleted successfully");
    }
}