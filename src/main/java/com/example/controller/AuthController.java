package com.example.javaExpert.controller;

import com.example.javaExpert.entity.AuthStudent;
import com.example.javaExpert.repository.AuthStudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthStudentRepository authStudentRepository;


    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthStudent student) {

        // Check if username already exists
        if (authStudentRepository.existsByUsername(student.getUsername())) {

            Map<String, String> response = new HashMap<>();

            response.put("message", "Username already exists");

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }

        // Save student
        authStudentRepository.save(student);

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Registration Successful");
        response.put("studentName", student.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthStudent student) {

        // Find username
        Optional<AuthStudent> existingStudent =
                authStudentRepository.findByUsername(student.getUsername());

        // Username does not exist
        if (existingStudent.isEmpty()) {

            Map<String, String> response = new HashMap<>();

            response.put("message", "Username not found");

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(response);
        }

        AuthStudent savedStudent = existingStudent.get();

        // Check password
        if (!savedStudent.getPassword().equals(student.getPassword())) {

            Map<String, String> response = new HashMap<>();

            response.put("message", "Invalid Password");

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        // Login successful
        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login Successful");
        response.put("studentName", savedStudent.getName());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }
}