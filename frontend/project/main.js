import './style.css';
import { getLoggedInUser, setLoggedInUser, logout } from './services.js';
import {
  renderLogin, renderRegister, showAlert, clearAlert, setButtonLoading,
  escapeHtml, renderLoading, renderError, renderEmptyState,
  confirmDialog, createModal, closeModal,
} from './components.js';
import {
  getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent,
  getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse,
  getAllEnrollments, createEnrollment, updateEnrollment, deleteEnrollment,
  getAllMarks, createMark, updateMark, deleteMark,
} from './services.js';

const app = document.querySelector('#app');

function route() {
  const hash = window.location.hash.replace('#', '') || '/';
  const user = getLoggedInUser();

  if (!user && (hash === '/' || hash === '/dashboard' || hash.startsWith('/students') || hash.startsWith('/courses') || hash.startsWith('/enrollments') || hash.startsWith('/marks'))) {
    window.location.hash = '#/login';
    return;
  }

  if (user && (hash === '/' || hash === '/login' || hash === '/register')) {
    window.location.hash = '#/dashboard';
    return;
  }

  if (hash === '/login') {
    renderLogin(app, (studentName) => {
      setLoggedInUser(studentName);
      window.location.hash = '#/dashboard';
    });
  } else if (hash === '/register') {
    renderRegister(app, () => {
      window.location.hash = '#/login';
    });
  } else if (hash === '/dashboard') {
    renderDashboard();
  } else if (hash === '/students') {
    renderStudentsPage();
  } else if (hash === '/courses') {
    renderCoursesPage();
  } else if (hash === '/enrollments') {
    renderEnrollmentsPage();
  } else if (hash === '/marks') {
    renderMarksPage();
  } else {
    if (user) {
      window.location.hash = '#/dashboard';
    } else {
      window.location.hash = '#/login';
    }
  }
}

function renderAppShell(pageTitle, renderPageContent) {
  const user = getLoggedInUser();
  const initials = user ? user.studentName.substring(0, 2).toUpperCase() : '';

  app.innerHTML = `
    <div class="app-layout">
      <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <div class="logo-badge">CS</div>
            <div class="logo-text">CollegeMS<span>Student Management</span></div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section">Menu</div>
          <a class="nav-item" data-route="dashboard"><span class="nav-icon">&#9632;</span> Dashboard</a>
          <a class="nav-item" data-route="students"><span class="nav-icon">&#9635;</span> Students</a>
          <a class="nav-item" data-route="courses"><span class="nav-icon">&#9635;</span> Courses</a>
          <a class="nav-item" data-route="enrollments"><span class="nav-icon">&#9635;</span> Enrollments</a>
          <a class="nav-item" data-route="marks"><span class="nav-icon">&#9635;</span> Marks</a>
        </nav>
        <div class="sidebar-footer">
          <a class="nav-item logout-item" id="logout-btn"><span class="nav-icon">&#8634;</span> Logout</a>
        </div>
      </aside>
      <div class="main-content">
        <header class="topbar">
          <div class="topbar-left">
            <button class="menu-toggle" id="menu-toggle">&#9776;</button>
            <h2>${escapeHtml(pageTitle)}</h2>
          </div>
          <div class="topbar-right">
            <div class="user-badge">
              <div class="user-avatar">${initials}</div>
              <span>${escapeHtml(user ? user.studentName : '')}</span>
            </div>
          </div>
        </header>
        <main class="page-content" id="page-content"></main>
      </div>
    </div>
  `;

  const currentRoute = window.location.hash.replace('#/', '').split('/')[0];
  app.querySelectorAll('.nav-item[data-route]').forEach((el) => {
    if (el.dataset.route === currentRoute) el.classList.add('active');
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = `#/${el.dataset.route}`;
      closeSidebar();
    });
  });

  app.querySelector('#logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
    window.location.hash = '#/login';
  });

  const menuToggle = app.querySelector('#menu-toggle');
  const sidebar = app.querySelector('#sidebar');
  const backdrop = app.querySelector('#sidebar-backdrop');
  menuToggle.addEventListener('click', () => {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
  });
  backdrop.addEventListener('click', closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  }

  const pageContent = app.querySelector('#page-content');
  renderPageContent(pageContent);
}

// ===== Dashboard =====
async function renderDashboard() {
  renderAppShell('Dashboard', async (content) => {
    const user = getLoggedInUser();
    content.innerHTML = `
      <div class="welcome-banner">
        <h1>Welcome, ${escapeHtml(user ? user.studentName : 'Student')}</h1>
        <p>Here's an overview of your college management system.</p>
      </div>
      <div class="stats-grid" id="stats-grid">
        <div class="loading-state"><div class="spinner spinner-lg"></div><p>Loading statistics...</p></div>
      </div>
    `;

    const statsGrid = content.querySelector('#stats-grid');
    try {
      const [studentsRes, coursesRes, enrollmentsRes, marksRes] = await Promise.all([
        getAllStudents(),
        getAllCourses(),
        getAllEnrollments(),
        getAllMarks(),
      ]);
      const sCount = Array.isArray(studentsRes.data) ? studentsRes.data.length : 0;
      const cCount = Array.isArray(coursesRes.data) ? coursesRes.data.length : 0;
      const eCount = Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data.length : 0;
      const mCount = Array.isArray(marksRes.data) ? marksRes.data.length : 0;

      statsGrid.innerHTML = `
        <div class="stat-card">
          <div class="stat-icon blue">&#9635;</div>
          <div><div class="stat-value">${sCount}</div><div class="stat-label">Total Students</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon teal">&#9635;</div>
          <div><div class="stat-value">${cCount}</div><div class="stat-label">Total Courses</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">&#9635;</div>
          <div><div class="stat-value">${eCount}</div><div class="stat-label">Total Enrollments</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon rose">&#9635;</div>
          <div><div class="stat-value">${mCount}</div><div class="stat-label">Total Marks Records</div></div>
        </div>
      `;
    } catch (error) {
      statsGrid.innerHTML = `<div class="error-state"><div class="error-icon">&#9888;</div><p>${escapeHtml(error.message)}</p><button class="btn btn-primary" onclick="window.location.reload()">Try Again</button></div>`;
    }
  });
}

// ===== Students Page =====
async function renderStudentsPage() {
  renderAppShell('Students', async (content) => {
    content.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Students</h1>
          <div class="page-subtitle">Manage all student records</div>
        </div>
        <button class="btn btn-primary" id="add-student-btn">+ Add Student</button>
      </div>
      <div id="students-table-area"></div>
    `;

    const tableArea = content.querySelector('#students-table-area');
    content.querySelector('#add-student-btn').addEventListener('click', () => openStudentModal(content, null, loadStudents));

    async function loadStudents() {
      renderLoading(tableArea, "Loading students...");
      try {
        const res = await getAllStudents();
        const students = Array.isArray(res.data) ? res.data : [];
        if (students.length === 0) {
          renderEmptyState(tableArea, "No students found. Add your first student!", "Add Student", () => openStudentModal(content, null, loadStudents));
          return;
        }
        tableArea.innerHTML = `
          <div class="table-card">
            <div class="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Age</th><th>Actions</th></tr></thead>
                <tbody>
                  ${students.map(s => `
                    <tr>
                      <td>${escapeHtml(String(s.id))}</td>
                      <td>${escapeHtml(s.name)}</td>
                      <td>${escapeHtml(s.department)}</td>
                      <td>${escapeHtml(String(s.age))}</td>
                      <td><div class="table-actions">
                        <button class="btn-icon edit" data-edit-id="${s.id}" title="Edit">&#9998;</button>
                        <button class="btn-icon danger" data-delete-id="${s.id}" data-delete-name="${escapeHtml(s.name)}" title="Delete">&#128465;</button>
                      </div></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        tableArea.querySelectorAll('[data-edit-id]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const id = btn.dataset.editId;
            try {
              const res = await getStudentById(id);
              openStudentModal(content, res.data, loadStudents);
            } catch (error) {
              alert(error.message);
            }
          });
        });
        tableArea.querySelectorAll('[data-delete-id]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.deleteId;
            const name = btn.dataset.deleteName;
            confirmDialog("Delete Student", `Are you sure you want to delete "${name}"? This action cannot be undone.`, async () => {
              try {
                await deleteStudent(id);
                loadStudents();
              } catch (error) {
                alert(error.message);
              }
            });
          });
        });
      } catch (error) {
        renderError(tableArea, error.message, loadStudents);
      }
    }

    loadStudents();
  });
}

function openStudentModal(content, student, onDone) {
  const isEdit = !!student;
  const bodyHtml = `
    <form id="student-form" novalidate>
      ${isEdit ? '' : `
        <div class="form-group">
          <label for="student-id">ID</label>
          <input type="number" id="student-id" min="1" placeholder="Enter student ID" required />
        </div>
      `}
      <div class="form-group">
        <label for="student-name">Name</label>
        <input type="text" id="student-name" placeholder="Enter full name" required />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="student-department">Department</label>
          <input type="text" id="student-department" placeholder="e.g. CSE" required />
        </div>
        <div class="form-group">
          <label for="student-age">Age</label>
          <input type="number" id="student-age" min="1" max="120" placeholder="Age" required />
        </div>
      </div>
      <div class="alert-area" id="student-modal-alert"></div>
    </form>
  `;
  const footerHtml = `
    <button class="btn btn-secondary" id="student-cancel">Cancel</button>
    <button class="btn btn-primary" id="student-save">
      <span class="btn-text">${isEdit ? 'Update' : 'Create'}</span>
      <span class="btn-spinner hidden"><span class="spinner"></span></span>
    </button>
  `;
  const { overlay, close } = createModal(isEdit ? 'Edit Student' : 'Add Student', bodyHtml, footerHtml);

  if (isEdit) {
    overlay.querySelector('#student-name').value = student.name || '';
    overlay.querySelector('#student-department').value = student.department || '';
    overlay.querySelector('#student-age').value = student.age || '';
  }

  const alertArea = overlay.querySelector('#student-modal-alert');
  const saveBtn = overlay.querySelector('#student-save');
  const cancelBtn = overlay.querySelector('#student-cancel');
  cancelBtn.addEventListener('click', close);
  saveBtn.addEventListener('click', async () => {
    const name = overlay.querySelector('#student-name').value.trim();
    const department = overlay.querySelector('#student-department').value.trim();
    const age = parseInt(overlay.querySelector('#student-age').value, 10);

    if (!name || !department || !age) {
      showAlert(alertArea, "Please fill in all fields.", "error");
      return;
    }

    setButtonLoading(saveBtn, true);
    clearAlert(alertArea);
    try {
      if (isEdit) {
        await updateStudent(student.id, { name, department, age });
      } else {
        const id = parseInt(overlay.querySelector('#student-id').value, 10);
        if (!id) { showAlert(alertArea, "Please enter a valid ID.", "error"); setButtonLoading(saveBtn, false); return; }
        await createStudent({ id, name, department, age });
      }
      close();
      onDone();
    } catch (error) {
      showAlert(alertArea, error.message, "error");
    } finally {
      setButtonLoading(saveBtn, false);
    }
  });
}

// ===== Courses Page =====
async function renderCoursesPage() {
  renderAppShell('Courses', async (content) => {
    content.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Courses</h1>
          <div class="page-subtitle">Manage all course offerings</div>
        </div>
        <button class="btn btn-primary" id="add-course-btn">+ Add Course</button>
      </div>
      <div id="courses-table-area"></div>
    `;

    const tableArea = content.querySelector('#courses-table-area');
    content.querySelector('#add-course-btn').addEventListener('click', () => openCourseModal(content, null, loadCourses));

    async function loadCourses() {
      renderLoading(tableArea, "Loading courses...");
      try {
        const res = await getAllCourses();
        const courses = Array.isArray(res.data) ? res.data : [];
        if (courses.length === 0) {
          renderEmptyState(tableArea, "No courses found. Add your first course!", "Add Course", () => openCourseModal(content, null, loadCourses));
          return;
        }
        tableArea.innerHTML = `
          <div class="table-card">
            <div class="table-wrapper">
              <table>
                <thead><tr><th>Course ID</th><th>Course Name</th><th>Department</th><th>Duration (months)</th><th>Fees</th><th>Actions</th></tr></thead>
                <tbody>
                  ${courses.map(c => `
                    <tr>
                      <td>${escapeHtml(String(c.courseId))}</td>
                      <td>${escapeHtml(c.courseName)}</td>
                      <td>${escapeHtml(c.department)}</td>
                      <td>${escapeHtml(String(c.duration))}</td>
                      <td>₹${escapeHtml(String(c.fees))}</td>
                      <td><div class="table-actions">
                        <button class="btn-icon edit" data-edit-id="${c.courseId}" title="Edit">&#9998;</button>
                        <button class="btn-icon danger" data-delete-id="${c.courseId}" data-delete-name="${escapeHtml(c.courseName)}" title="Delete">&#128465;</button>
                      </div></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        tableArea.querySelectorAll('[data-edit-id]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            try {
              const res = await getCourseById(btn.dataset.editId);
              openCourseModal(content, res.data, loadCourses);
            } catch (error) { alert(error.message); }
          });
        });
        tableArea.querySelectorAll('[data-delete-id]').forEach((btn) => {
          btn.addEventListener('click', () => {
            confirmDialog("Delete Course", `Are you sure you want to delete "${btn.dataset.deleteName}"?`, async () => {
              try { await deleteCourse(btn.dataset.deleteId); loadCourses(); }
              catch (error) { alert(error.message); }
            });
          });
        });
      } catch (error) {
        renderError(tableArea, error.message, loadCourses);
      }
    }

    loadCourses();
  });
}

function openCourseModal(content, course, onDone) {
  const isEdit = !!course;
  const bodyHtml = `
    <form id="course-form" novalidate>
      ${isEdit ? '' : `
        <div class="form-group">
          <label for="course-id">Course ID</label>
          <input type="number" id="course-id" min="1" placeholder="Enter course ID" required />
        </div>
      `}
      <div class="form-group">
        <label for="course-name">Course Name</label>
        <input type="text" id="course-name" placeholder="Enter course name" required />
      </div>
      <div class="form-group">
        <label for="course-department">Department</label>
        <input type="text" id="course-department" placeholder="e.g. CSE" required />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="course-duration">Duration (months)</label>
          <input type="number" id="course-duration" min="1" placeholder="e.g. 6" required />
        </div>
        <div class="form-group">
          <label for="course-fees">Fees</label>
          <input type="number" id="course-fees" min="0" placeholder="e.g. 15000" required />
        </div>
      </div>
      <div class="alert-area" id="course-modal-alert"></div>
    </form>
  `;
  const footerHtml = `
    <button class="btn btn-secondary" id="course-cancel">Cancel</button>
    <button class="btn btn-primary" id="course-save">
      <span class="btn-text">${isEdit ? 'Update' : 'Create'}</span>
      <span class="btn-spinner hidden"><span class="spinner"></span></span>
    </button>
  `;
  const { overlay, close } = createModal(isEdit ? 'Edit Course' : 'Add Course', bodyHtml, footerHtml);

  if (isEdit) {
    overlay.querySelector('#course-name').value = course.courseName || '';
    overlay.querySelector('#course-department').value = course.department || '';
    overlay.querySelector('#course-duration').value = course.duration || '';
    overlay.querySelector('#course-fees').value = course.fees || '';
  }

  const alertArea = overlay.querySelector('#course-modal-alert');
  const saveBtn = overlay.querySelector('#course-save');
  overlay.querySelector('#course-cancel').addEventListener('click', close);
  saveBtn.addEventListener('click', async () => {
    const courseName = overlay.querySelector('#course-name').value.trim();
    const department = overlay.querySelector('#course-department').value.trim();
    const duration = parseInt(overlay.querySelector('#course-duration').value, 10);
    const fees = parseInt(overlay.querySelector('#course-fees').value, 10);

    if (!courseName || !department || !duration || isNaN(fees)) {
      showAlert(alertArea, "Please fill in all fields.", "error");
      return;
    }

    setButtonLoading(saveBtn, true);
    clearAlert(alertArea);
    try {
      if (isEdit) {
        await updateCourse(course.courseId, { courseName, department, duration, fees });
      } else {
        const courseId = parseInt(overlay.querySelector('#course-id').value, 10);
        if (!courseId) { showAlert(alertArea, "Please enter a valid Course ID.", "error"); setButtonLoading(saveBtn, false); return; }
        await createCourse({ courseId, courseName, department, duration, fees });
      }
      close();
      onDone();
    } catch (error) {
      showAlert(alertArea, error.message, "error");
    } finally {
      setButtonLoading(saveBtn, false);
    }
  });
}

// ===== Enrollments Page =====
async function renderEnrollmentsPage() {
  renderAppShell('Enrollments', async (content) => {
    content.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Enrollments</h1>
          <div class="page-subtitle">Manage student course enrollments</div>
        </div>
        <button class="btn btn-primary" id="add-enrollment-btn">+ Add Enrollment</button>
      </div>
      <div id="enrollments-table-area"></div>
    `;

    const tableArea = content.querySelector('#enrollments-table-area');
    let cachedStudents = [];
    let cachedCourses = [];

    async function loadDropdownData() {
      const [sRes, cRes] = await Promise.all([getAllStudents(), getAllCourses()]);
      cachedStudents = Array.isArray(sRes.data) ? sRes.data : [];
      cachedCourses = Array.isArray(cRes.data) ? cRes.data : [];
    }

    content.querySelector('#add-enrollment-btn').addEventListener('click', async () => {
      try {
        await loadDropdownData();
        openEnrollmentModal(content, null, loadEnrollments, cachedStudents, cachedCourses);
      } catch (error) {
        alert(error.message);
      }
    });

    async function loadEnrollments() {
      renderLoading(tableArea, "Loading enrollments...");
      try {
        const res = await getAllEnrollments();
        const enrollments = Array.isArray(res.data) ? res.data : [];
        if (enrollments.length === 0) {
          renderEmptyState(tableArea, "No enrollments found. Add your first enrollment!", "Add Enrollment", () => {
            loadDropdownData().then(() => openEnrollmentModal(content, null, loadEnrollments, cachedStudents, cachedCourses)).catch(e => alert(e.message));
          });
          return;
        }
        tableArea.innerHTML = `
          <div class="table-card">
            <div class="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Student ID</th><th>Course ID</th><th>Enrollment Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  ${enrollments.map(e => `
                    <tr>
                      <td>${escapeHtml(String(e.enrollmentId))}</td>
                      <td>${escapeHtml(String(e.studentId))}</td>
                      <td>${escapeHtml(String(e.courseId))}</td>
                      <td>${escapeHtml(e.enrollmentDate || '')}</td>
                      <td><span class="badge ${statusClass(e.status)}">${escapeHtml(e.status || '')}</span></td>
                      <td><div class="table-actions">
                        <button class="btn-icon edit" data-edit-id="${e.enrollmentId}" title="Edit">&#9998;</button>
                        <button class="btn-icon danger" data-delete-id="${e.enrollmentId}" title="Delete">&#128465;</button>
                      </div></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        tableArea.querySelectorAll('[data-edit-id]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const id = btn.dataset.editId;
            const enrollment = enrollments.find(e => String(e.enrollmentId) === id);
            if (enrollment) {
              try {
                await loadDropdownData();
                openEnrollmentModal(content, enrollment, loadEnrollments, cachedStudents, cachedCourses);
              } catch (error) { alert(error.message); }
            }
          });
        });
        tableArea.querySelectorAll('[data-delete-id]').forEach((btn) => {
          btn.addEventListener('click', () => {
            confirmDialog("Delete Enrollment", "Are you sure you want to delete this enrollment?", async () => {
              try { await deleteEnrollment(btn.dataset.deleteId); loadEnrollments(); }
              catch (error) { alert(error.message); }
            });
          });
        });
      } catch (error) {
        renderError(tableArea, error.message, loadEnrollments);
      }
    }

    loadEnrollments();
  });
}

function statusClass(status) {
  const s = (status || '').toUpperCase();
  if (s === 'ACTIVE') return 'badge-active';
  if (s === 'COMPLETED') return 'badge-completed';
  if (s === 'DROPPED') return 'badge-dropped';
  if (s === 'PENDING') return 'badge-pending';
  return 'badge-pending';
}

function openEnrollmentModal(content, enrollment, onDone, students, courses) {
  const isEdit = !!enrollment;
  const studentOptions = students.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (ID: ${s.id})</option>`).join('');
  const courseOptions = courses.map(c => `<option value="${c.courseId}">${escapeHtml(c.courseName)} (ID: ${c.courseId})</option>`).join('');
  const today = new Date().toISOString().split('T')[0];

  const bodyHtml = `
    <form id="enrollment-form" novalidate>
      <div class="form-group">
        <label for="enr-student">Student</label>
        <select id="enr-student" required>
          <option value="">-- Select Student --</option>
          ${studentOptions}
        </select>
      </div>
      <div class="form-group">
        <label for="enr-course">Course</label>
        <select id="enr-course" required>
          <option value="">-- Select Course --</option>
          ${courseOptions}
        </select>
      </div>
      <div class="form-group">
        <label for="enr-date">Enrollment Date</label>
        <input type="date" id="enr-date" value="${today}" required />
      </div>
      <div class="form-group">
        <label for="enr-status">Status</label>
        <select id="enr-status" required>
          <option value="ACTIVE">ACTIVE</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="DROPPED">DROPPED</option>
          <option value="PENDING">PENDING</option>
        </select>
      </div>
      <div class="alert-area" id="enr-modal-alert"></div>
    </form>
  `;
  const footerHtml = `
    <button class="btn btn-secondary" id="enr-cancel">Cancel</button>
    <button class="btn btn-primary" id="enr-save">
      <span class="btn-text">${isEdit ? 'Update' : 'Create'}</span>
      <span class="btn-spinner hidden"><span class="spinner"></span></span>
    </button>
  `;
  const { overlay, close } = createModal(isEdit ? 'Edit Enrollment' : 'Add Enrollment', bodyHtml, footerHtml);

  if (isEdit) {
    overlay.querySelector('#enr-student').value = enrollment.studentId;
    overlay.querySelector('#enr-course').value = enrollment.courseId;
    overlay.querySelector('#enr-date').value = enrollment.enrollmentDate || today;
    overlay.querySelector('#enr-status').value = enrollment.status || 'ACTIVE';
  }

  const alertArea = overlay.querySelector('#enr-modal-alert');
  const saveBtn = overlay.querySelector('#enr-save');
  overlay.querySelector('#enr-cancel').addEventListener('click', close);
  saveBtn.addEventListener('click', async () => {
    const studentId = parseInt(overlay.querySelector('#enr-student').value, 10);
    const courseId = parseInt(overlay.querySelector('#enr-course').value, 10);
    const enrollmentDate = overlay.querySelector('#enr-date').value;
    const status = overlay.querySelector('#enr-status').value;

    if (!studentId || !courseId || !enrollmentDate) {
      showAlert(alertArea, "Please fill in all fields.", "error");
      return;
    }

    setButtonLoading(saveBtn, true);
    clearAlert(alertArea);
    try {
      const payload = { studentId, courseId, enrollmentDate, status };
      if (isEdit) {
        await updateEnrollment(enrollment.enrollmentId, payload);
      } else {
        await createEnrollment(payload);
      }
      close();
      onDone();
    } catch (error) {
      showAlert(alertArea, error.message, "error");
    } finally {
      setButtonLoading(saveBtn, false);
    }
  });
}

// ===== Marks Page =====
async function renderMarksPage() {
  renderAppShell('Marks', async (content) => {
    content.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Marks</h1>
          <div class="page-subtitle">Manage student exam marks</div>
        </div>
        <button class="btn btn-primary" id="add-mark-btn">+ Add Marks</button>
      </div>
      <div id="marks-table-area"></div>
    `;

    const tableArea = content.querySelector('#marks-table-area');
    let cachedStudents = [];
    let cachedCourses = [];

    async function loadDropdownData() {
      const [sRes, cRes] = await Promise.all([getAllStudents(), getAllCourses()]);
      cachedStudents = Array.isArray(sRes.data) ? sRes.data : [];
      cachedCourses = Array.isArray(cRes.data) ? cRes.data : [];
    }

    content.querySelector('#add-mark-btn').addEventListener('click', async () => {
      try {
        await loadDropdownData();
        openMarkModal(content, null, loadMarks, cachedStudents, cachedCourses);
      } catch (error) { alert(error.message); }
    });

    async function loadMarks() {
      renderLoading(tableArea, "Loading marks...");
      try {
        const res = await getAllMarks();
        const marks = Array.isArray(res.data) ? res.data : [];
        if (marks.length === 0) {
          renderEmptyState(tableArea, "No marks records found. Add your first marks entry!", "Add Marks", () => {
            loadDropdownData().then(() => openMarkModal(content, null, loadMarks, cachedStudents, cachedCourses)).catch(e => alert(e.message));
          });
          return;
        }
        tableArea.innerHTML = `
          <div class="table-card">
            <div class="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Student ID</th><th>Course ID</th><th>Exam Name</th><th>Marks</th><th>Total Marks</th><th>Percentage</th><th>Actions</th></tr></thead>
                <tbody>
                  ${marks.map(m => {
                    const pct = m.totalMarks > 0 ? ((m.marks / m.totalMarks) * 100).toFixed(1) : '0';
                    return `
                    <tr>
                      <td>${escapeHtml(String(m.markId))}</td>
                      <td>${escapeHtml(String(m.studentId))}</td>
                      <td>${escapeHtml(String(m.courseId))}</td>
                      <td>${escapeHtml(m.examName || '')}</td>
                      <td>${escapeHtml(String(m.marks))}</td>
                      <td>${escapeHtml(String(m.totalMarks))}</td>
                      <td>${pct}%</td>
                      <td><div class="table-actions">
                        <button class="btn-icon edit" data-edit-id="${m.markId}" title="Edit">&#9998;</button>
                        <button class="btn-icon danger" data-delete-id="${m.markId}" title="Delete">&#128465;</button>
                      </div></td>
                    </tr>
                  `}).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        tableArea.querySelectorAll('[data-edit-id]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.editId;
            const mark = marks.find(m => String(m.markId) === id);
            if (mark) {
              loadDropdownData().then(() => openMarkModal(content, mark, loadMarks, cachedStudents, cachedCourses)).catch(e => alert(e.message));
            }
          });
        });
        tableArea.querySelectorAll('[data-delete-id]').forEach((btn) => {
          btn.addEventListener('click', () => {
            confirmDialog("Delete Marks", "Are you sure you want to delete this marks record?", async () => {
              try { await deleteMark(btn.dataset.deleteId); loadMarks(); }
              catch (error) { alert(error.message); }
            });
          });
        });
      } catch (error) {
        renderError(tableArea, error.message, loadMarks);
      }
    }

    loadMarks();
  });
}

function openMarkModal(content, mark, onDone, students, courses) {
  const isEdit = !!mark;
  const studentOptions = students.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (ID: ${s.id})</option>`).join('');
  const courseOptions = courses.map(c => `<option value="${c.courseId}">${escapeHtml(c.courseName)} (ID: ${c.courseId})</option>`).join('');

  const bodyHtml = `
    <form id="mark-form" novalidate>
      <div class="form-group">
        <label for="mark-student">Student</label>
        <select id="mark-student" required>
          <option value="">-- Select Student --</option>
          ${studentOptions}
        </select>
      </div>
      <div class="form-group">
        <label for="mark-course">Course</label>
        <select id="mark-course" required>
          <option value="">-- Select Course --</option>
          ${courseOptions}
        </select>
      </div>
      <div class="form-group">
        <label for="mark-exam">Exam Name</label>
        <input type="text" id="mark-exam" placeholder="e.g. Internal 1, Final" required />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="mark-marks">Marks Obtained</label>
          <input type="number" id="mark-marks" min="0" placeholder="e.g. 78" required />
        </div>
        <div class="form-group">
          <label for="mark-total">Total Marks</label>
          <input type="number" id="mark-total" min="1" placeholder="e.g. 100" required />
        </div>
      </div>
      <div class="alert-area" id="mark-modal-alert"></div>
    </form>
  `;
  const footerHtml = `
    <button class="btn btn-secondary" id="mark-cancel">Cancel</button>
    <button class="btn btn-primary" id="mark-save">
      <span class="btn-text">${isEdit ? 'Update' : 'Create'}</span>
      <span class="btn-spinner hidden"><span class="spinner"></span></span>
    </button>
  `;
  const { overlay, close } = createModal(isEdit ? 'Edit Marks' : 'Add Marks', bodyHtml, footerHtml);

  if (isEdit) {
    overlay.querySelector('#mark-student').value = mark.studentId;
    overlay.querySelector('#mark-course').value = mark.courseId;
    overlay.querySelector('#mark-exam').value = mark.examName || '';
    overlay.querySelector('#mark-marks').value = mark.marks;
    overlay.querySelector('#mark-total').value = mark.totalMarks;
  }

  const alertArea = overlay.querySelector('#mark-modal-alert');
  const saveBtn = overlay.querySelector('#mark-save');
  overlay.querySelector('#mark-cancel').addEventListener('click', close);
  saveBtn.addEventListener('click', async () => {
    const studentId = parseInt(overlay.querySelector('#mark-student').value, 10);
    const courseId = parseInt(overlay.querySelector('#mark-course').value, 10);
    const examName = overlay.querySelector('#mark-exam').value.trim();
    const marksObtained = parseInt(overlay.querySelector('#mark-marks').value, 10);
    const totalMarks = parseInt(overlay.querySelector('#mark-total').value, 10);

    if (!studentId || !courseId || !examName || isNaN(marksObtained) || isNaN(totalMarks)) {
      showAlert(alertArea, "Please fill in all fields.", "error");
      return;
    }
    if (marksObtained < 0) {
      showAlert(alertArea, "Marks cannot be negative.", "error");
      return;
    }
    if (marksObtained > totalMarks) {
      showAlert(alertArea, "Marks cannot be greater than total marks.", "error");
      return;
    }

    setButtonLoading(saveBtn, true);
    clearAlert(alertArea);
    try {
      const payload = { studentId, courseId, examName, marks: marksObtained, totalMarks };
      if (isEdit) {
        await updateMark(mark.markId, payload);
      } else {
        await createMark(payload);
      }
      close();
      onDone();
    } catch (error) {
      showAlert(alertArea, error.message, "error");
    } finally {
      setButtonLoading(saveBtn, false);
    }
  });
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
