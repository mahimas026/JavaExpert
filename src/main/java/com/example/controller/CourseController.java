package com.example.javaExpert.controller;

import com.example.javaExpert.entity.Course;
import com.example.javaExpert.repository.CourseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;


    // =========================
    // GET ALL COURSES
    // =========================
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {

        List<Course> courses = courseRepository.findAll();

        return ResponseEntity.ok(courses);
    }


    // =========================
    // GET COURSE BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Integer id) {

        Optional<Course> course = courseRepository.findById(id);

        if (course.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Course not found");
        }

        return ResponseEntity.ok(course.get());
    }


    // =========================
    // CREATE COURSE
    // =========================
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {

        Course savedCourse = courseRepository.save(course);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCourse);
    }


    // =========================
    // UPDATE COURSE
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Integer id,
            @RequestBody Course courseDetails) {

        Optional<Course> existingCourse =
                courseRepository.findById(id);

        if (existingCourse.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Course not found");
        }

        Course course = existingCourse.get();

        course.setCourseName(courseDetails.getCourseName());
        course.setDepartment(courseDetails.getDepartment());
        course.setDuration(courseDetails.getDuration());
        course.setFees(courseDetails.getFees());

        Course updatedCourse = courseRepository.save(course);

        return ResponseEntity.ok(updatedCourse);
    }


    // =========================
    // DELETE COURSE
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Integer id) {

        if (!courseRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Course not found");
        }

        courseRepository.deleteById(id);

        return ResponseEntity.ok("Course deleted successfully");
    }
}