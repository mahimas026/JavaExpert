package com.example.javaExpert.repository;

import com.example.javaExpert.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {

    boolean existsByStudentIdAndCourseId(Integer studentId, Integer courseId);
}