package com.example.javaExpert.repository;

import com.example.javaExpert.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarksRepository extends JpaRepository<Marks, Integer> {
}