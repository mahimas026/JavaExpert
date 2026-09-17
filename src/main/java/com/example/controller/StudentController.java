package com.example.javaExpert.controller;

import com.example.javaExpert.entity.Studententity;
import com.example.javaExpert.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    // GET all students
    @GetMapping
    public List<Studententity> getAllStudents() {
        return studentRepository.findAll();
    }

    // GET student by ID
    @GetMapping("/{id}")
    public Studententity getStudentById(@PathVariable int id) {
        return studentRepository.findById(id).orElse(null);
    }

    // POST - add student
    @PostMapping
    public Studententity addStudent(@RequestBody Studententity student) {
        return studentRepository.save(student);
    }

    // PUT - update student
    @PutMapping("/{id}")
    public Studententity updateStudent(
            @PathVariable int id,
            @RequestBody Studententity student) {

        student.setId(id);
        return studentRepository.save(student);
    }

    // DELETE student
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable int id) {
        studentRepository.deleteById(id);
        return "Student deleted successfully";
    }
}