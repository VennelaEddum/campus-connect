// ==============================
// CampusConnect Login Script
// ==============================

// Utility alert
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

        const email = document.getElementById("facultyEmail").value.trim();
        const password = document.getElementById("facultyPassword").value.trim();

        if (!email || !password) {
            showMessage("Please fill in all fields");
            return;
        }

        if (!email.endsWith("@facultysvecw.edu.in")) {
            showMessage("Please use your faculty email ID");
            return;
        }

        // ✅ Navigate to dashboard folder
        window.location.href = "dashboard.html";
    });
}

// ==============================
// Student Login
// ==============================
const studentForm = document.getElementById("studentLoginForm");

if (studentForm) {
    studentForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("studentEmail").value.trim();
        const password = document.getElementById("studentPassword").value.trim();

        if (!email || !password) {
            showMessage("Please fill in all fields");
            return;
        }

        if (!email.endsWith("@svecw.edu.in")) {
            showMessage("Please use your student email ID");
            return;
        }

        // ✅ Navigate to dashboard folder
        window.location.href = "dashboard.html";
    });
}
