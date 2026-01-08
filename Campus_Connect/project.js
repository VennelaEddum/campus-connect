const role = localStorage.getItem("role"); // faculty | student

const addProjectBtn = document.getElementById("addProjectBtn");
const projectForm = document.getElementById("projectForm");
const projectsList = document.getElementById("projectsList");

// Show upload button only for faculty
if (role === "faculty") {
    addProjectBtn.style.display = "block";

    addProjectBtn.onclick = () => {
        projectForm.style.display =
            projectForm.style.display === "none" ? "block" : "none";
    };
}

// Load projects
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let savedProjects = JSON.parse(localStorage.getItem("savedProjects")) || [];

function renderProjects() {
    projectsList.innerHTML = "";

    if (projects.length === 0) {
        projectsList.innerHTML = "<p>No projects posted yet.</p>";
        return;
    }

    projects.forEach((project, index) => {
        const card = document.createElement("div");
        card.className = "item-card";

        card.innerHTML = `
            <div class="item-header">
                <div class="item-title">${project.title}</div>
                <div class="item-meta">By Faculty</div>
            </div>

            <p>${project.desc}</p>

            <a href="${project.link}" target="_blank" class="btn btn-sm btn-outline-primary">
                🔗 GitHub Repository
            </a>

            <div class="item-actions mt-3">
                <button class="action-btn" onclick="upvoteProject(${index})">
                    👍 ${project.upvotes}
                </button>

                <button class="action-btn" onclick="saveProject(${index})">
                    🔖 Save
                </button>
            </div>
        `;

        projectsList.appendChild(card);
    });
}

function addProject() {
    const title = document.getElementById("projectTitle").value.trim();
    const desc = document.getElementById("projectDesc").value.trim();
    const link = document.getElementById("projectLink").value.trim();

    if (!title || !desc || !link) {
        alert("All fields are required");
        return;
    }

    projects.unshift({
        title,
        desc,
        link,
        upvotes: 0
    });

    localStorage.setItem("projects", JSON.stringify(projects));

    document.getElementById("projectTitle").value = "";
    document.getElementById("projectDesc").value = "";
    document.getElementById("projectLink").value = "";

    renderProjects();
}

function upvoteProject(index) {
    projects[index].upvotes++;
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
}

function saveProject(index) {
    const project = projects[index];

    if (!savedProjects.find(p => p.title === project.title)) {
        savedProjects.push(project);
        localStorage.setItem("savedProjects", JSON.stringify(savedProjects));
        alert("Project saved!");
    } else {
        alert("Already saved");
    }
}

// Initial load
renderProjects();
