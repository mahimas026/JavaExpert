import { login, register } from './services.js';

export function renderLogin(container, onLoginSuccess) {
  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">CS</div>
          <h1>Student Management</h1>
          <p>Welcome back. Please sign in to continue.</p>
        </div>
        <form id="login-form" class="auth-form" novalidate>
          <div class="form-group">
            <label for="login-username">Username</label>
            <input type="text" id="login-username" name="username" placeholder="Enter your username" required autocomplete="username" />
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" name="password" placeholder="Enter your password" required autocomplete="current-password" />
          </div>
          <div class="alert-area" id="login-alert"></div>
          <button type="submit" class="btn btn-primary btn-block" id="login-btn">
            <span class="btn-text">Sign In</span>
            <span class="btn-spinner hidden"><span class="spinner"></span></span>
          </button>
        </form>
        <p class="auth-switch">Don't have an account? <a href="#/register" data-link="register">Create one</a></p>
      </div>
    </div>
  `;

  const form = container.querySelector("#login-form");
  const alertArea = container.querySelector("#login-alert");
  const btn = container.querySelector("#login-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = container.querySelector("#login-username").value.trim();
    const password = container.querySelector("#login-password").value.trim();

    if (!username || !password) {
      showAlert(alertArea, "Please fill in all fields.", "error");
      return;
    }

    setButtonLoading(btn, true);
    clearAlert(alertArea);

    try {
      const result = await login({ username, password });
      onLoginSuccess(result.data.studentName);
    } catch (error) {
      showAlert(alertArea, error.message || "Login failed.", "error");
    } finally {
      setButtonLoading(btn, false);
    }
  });
}

export function renderRegister(container, onRegisterSuccess) {
  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">CS</div>
          <h1>Create Account</h1>
          <p>Register as a new student to get started.</p>
        </div>
        <form id="register-form" class="auth-form" novalidate>
          <div class="form-group">
            <label for="reg-name">Full Name</label>
            <input type="text" id="reg-name" name="name" placeholder="Enter your full name" required />
          </div>
          <div class="form-group">
            <label for="reg-department">Department</label>
            <input type="text" id="reg-department" name="department" placeholder="e.g. CSE, ECE, MECH" required />
          </div>
          <div class="form-group">
            <label for="reg-age">Age</label>
            <input type="number" id="reg-age" name="age" placeholder="Enter your age" min="1" max="120" required />
          </div>
          <div class="form-group">
            <label for="reg-username">Username</label>
            <input type="text" id="reg-username" name="username" placeholder="Choose a username" required autocomplete="username" />
          </div>
          <div class="form-group">
            <label for="reg-password">Password</label>
            <input type="password" id="reg-password" name="password" placeholder="Choose a password" required autocomplete="new-password" />
          </div>
          <div class="alert-area" id="register-alert"></div>
          <button type="submit" class="btn btn-primary btn-block" id="register-btn">
            <span class="btn-text">Create Account</span>
            <span class="btn-spinner hidden"><span class="spinner"></span></span>
          </button>
        </form>
        <p class="auth-switch">Already have an account? <a href="#/login" data-link="login">Sign in</a></p>
      </div>
    </div>
  `;

  const form = container.querySelector("#register-form");
  const alertArea = container.querySelector("#register-alert");
  const btn = container.querySelector("#register-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      name: container.querySelector("#reg-name").value.trim(),
      department: container.querySelector("#reg-department").value.trim(),
      age: parseInt(container.querySelector("#reg-age").value, 10),
      username: container.querySelector("#reg-username").value.trim(),
      password: container.querySelector("#reg-password").value.trim(),
    };

    if (!payload.name || !payload.department || !payload.age || !payload.username || !payload.password) {
      showAlert(alertArea, "Please fill in all fields.", "error");
      return;
    }

    setButtonLoading(btn, true);
    clearAlert(alertArea);

    try {
      const result = await register(payload);
      showAlert(alertArea, `Registration successful! Welcome, ${result.data.studentName}. You can now log in.`, "success");
      form.reset();
      setTimeout(() => onRegisterSuccess(), 2000);
    } catch (error) {
      showAlert(alertArea, error.message || "Registration failed.", "error");
    } finally {
      setButtonLoading(btn, false);
    }
  });
}

export function showAlert(area, message, type = "info") {
  if (!area) return;
  const icon = type === "success" ? "&#10003;" : type === "error" ? "&#9888;" : "&#8505;";
  area.innerHTML = `<div class="alert alert-${type}"><span class="alert-icon">${icon}</span><span>${escapeHtml(message)}</span></div>`;
  if (type === "success") {
    setTimeout(() => { if (area) area.innerHTML = ""; }, 4000);
  }
}

export function clearAlert(area) {
  if (area) area.innerHTML = "";
}

export function setButtonLoading(btn, loading) {
  if (!btn) return;
  const text = btn.querySelector(".btn-text");
  const spinner = btn.querySelector(".btn-spinner");
  if (loading) {
    btn.disabled = true;
    if (text) text.classList.add("hidden");
    if (spinner) spinner.classList.remove("hidden");
  } else {
    btn.disabled = false;
    if (text) text.classList.remove("hidden");
    if (spinner) spinner.classList.add("hidden");
  }
}

export function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderLoading(container, message = "Loading...") {
  container.innerHTML = `<div class="loading-state"><div class="spinner spinner-lg"></div><p>${escapeHtml(message)}</p></div>`;
}

export function renderError(container, message, onRetry) {
  container.innerHTML = `
    <div class="error-state">
      <div class="error-icon">&#9888;</div>
      <p>${escapeHtml(message)}</p>
      ${onRetry ? '<button class="btn btn-primary" id="retry-btn">Try Again</button>' : ""}
    </div>
  `;
  if (onRetry) {
    const retryBtn = container.querySelector("#retry-btn");
    if (retryBtn) retryBtn.addEventListener("click", onRetry);
  }
}

export function renderEmptyState(container, message, actionLabel, onAction) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">&#128193;</div>
      <p>${escapeHtml(message)}</p>
      ${actionLabel ? `<button class="btn btn-primary" id="empty-action-btn">${escapeHtml(actionLabel)}</button>` : ""}
    </div>
  `;
  if (actionLabel && onAction) {
    const btn = container.querySelector("#empty-action-btn");
    if (btn) btn.addEventListener("click", onAction);
  }
}

export function confirmDialog(title, message, onConfirm, confirmLabel = "Delete") {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-dialog confirm-dialog">
      <div class="modal-header">
        <h3>${escapeHtml(title)}</h3>
      </div>
      <div class="modal-body">
        <p>${escapeHtml(message)}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="confirm-cancel">Cancel</button>
        <button class="btn btn-danger" id="confirm-ok">${escapeHtml(confirmLabel)}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));

  const close = () => {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 200);
  };

  overlay.querySelector("#confirm-cancel").addEventListener("click", close);
  overlay.querySelector("#confirm-ok").addEventListener("click", () => { close(); onConfirm(); });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
}

export function closeModal(overlay) {
  if (!overlay) return;
  overlay.classList.remove("show");
  setTimeout(() => overlay.remove(), 200);
}

export function createModal(title, bodyHtml, footerHtml = "") {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h3>${escapeHtml(title)}</h3>
        <button class="modal-close" id="modal-close-x">&times;</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ""}
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));

  const close = () => closeModal(overlay);
  overlay.querySelector("#modal-close-x").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

  return { overlay, close };
}
