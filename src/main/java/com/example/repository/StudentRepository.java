package com.example.javaExpert.repository;

import com.example.javaExpert.entity.Studententity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Studententity, Integer> {
}