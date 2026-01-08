// ==============================
// Utility: show alert (replace later with toast/snackbar)
// ==============================
function showMessage(message) {
    alert(message);
}

// ==============================
// Faculty Login
// ==============================
const facultyForm = document.getElementById("facultyLoginForm");

if (facultyForm) {
    facultyForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("facultyEmail").value;
        const password = document.getElementById("facultyPassword").value;

        // TODO: Validate with backend later
        if (email && password) {
            // Optional: store role
            localStorage.setItem("userRole", "faculty");
            localStorage.setItem("isLoggedIn", "true");

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            showMessage("Please enter valid credentials");
        }
    });
}

// ==============================
// Student Login
// ==============================
const studentForm = document.getElementById("studentLoginForm");

if (studentForm) {
    studentForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("studentEmail").value;
        const password = document.getElementById("studentPassword").value;

        // TODO: Validate with backend later
        if (email && password) {
            // Optional: store role
            localStorage.setItem("userRole", "student");
            localStorage.setItem("isLoggedIn", "true");

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            showMessage("Please enter valid credentials");
        }
    });
}

// ==============================
// Signup
// ==============================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Account creation logic later
        localStorage.setItem("isLoggedIn", "true");

        // Redirect to dashboard
        window.location.href = "dashboard.html";
    });
}
