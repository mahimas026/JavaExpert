import { apiRequest, ENDPOINTS } from './api.js';

const STORAGE_KEY = "sms_current_user";

export function getLoggedInUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setLoggedInUser(studentName) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ studentName }));
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function register(payload) {
  return apiRequest(ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  return apiRequest(ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAllStudents() {
  return apiRequest(ENDPOINTS.STUDENTS.ALL);
}

export async function getStudentById(id) {
  return apiRequest(ENDPOINTS.STUDENTS.BY_ID(id));
}

export async function createStudent(payload) {
  return apiRequest(ENDPOINTS.STUDENTS.ALL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateStudent(id, payload) {
  return apiRequest(ENDPOINTS.STUDENTS.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteStudent(id) {
  return apiRequest(ENDPOINTS.STUDENTS.BY_ID(id), { method: "DELETE" });
}

export async function getAllCourses() {
  return apiRequest(ENDPOINTS.COURSES.ALL);
}

export async function getCourseById(id) {
  return apiRequest(ENDPOINTS.COURSES.BY_ID(id));
}

export async function createCourse(payload) {
  return apiRequest(ENDPOINTS.COURSES.ALL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCourse(id, payload) {
  return apiRequest(ENDPOINTS.COURSES.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCourse(id) {
  return apiRequest(ENDPOINTS.COURSES.BY_ID(id), { method: "DELETE" });
}

export async function getAllEnrollments() {
  return apiRequest(ENDPOINTS.ENROLLMENTS.ALL);
}

export async function createEnrollment(payload) {
  return apiRequest(ENDPOINTS.ENROLLMENTS.ALL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateEnrollment(id, payload) {
  return apiRequest(ENDPOINTS.ENROLLMENTS.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEnrollment(id) {
  return apiRequest(ENDPOINTS.ENROLLMENTS.BY_ID(id), { method: "DELETE" });
}

export async function getAllMarks() {
  return apiRequest(ENDPOINTS.MARKS.ALL);
}

export async function createMark(payload) {
  return apiRequest(ENDPOINTS.MARKS.ALL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMark(id, payload) {
  return apiRequest(ENDPOINTS.MARKS.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteMark(id) {
  return apiRequest(ENDPOINTS.MARKS.BY_ID(id), { method: "DELETE" });
}
