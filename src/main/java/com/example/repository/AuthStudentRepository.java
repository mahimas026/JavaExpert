package com.example.javaExpert.repository;

import com.example.javaExpert.entity.AuthStudent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthStudentRepository extends JpaRepository<AuthStudent, Long> {

    boolean existsByUsername(String username);

    Optional<AuthStudent> findByUsername(String username);
}