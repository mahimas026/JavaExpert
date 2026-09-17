package com.example.javaExpert.repository;

import com.example.javaExpert.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Integer> {
}