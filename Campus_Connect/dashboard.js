/* ======================
   Global Variables
====================== */

// Questions storage
let QUESTIONS = JSON.parse(localStorage.getItem("campusQuestions")) || [
    {
        id: 1,
        title: "How to implement recursion in C++?",
        desc: "I'm struggling to understand the base case in recursive functions...",
        tags: ["C++", "Algorithms"],
        time: "2 hours ago",
        answers: 2,
        votes: 12,
        author: "John Doe",
        authorId: "user1"
    },
    {
        id: 2,
        title: "Best resources for Machine Learning?",
        desc: "Looking for beginner friendly tutorials for Python based ML...",
        tags: ["Python", "ML"],
        time: "5 hours ago",
        answers: 3,
        votes: 34,
        author: "Jane Smith",
        authorId: "user2"
    }
];

// Answers storage - NEW: Store answers for each question
let ANSWERS = JSON.parse(localStorage.getItem("campusAnswers")) || {
    1: [
        {
            id: 1,
            questionId: 1,
            text: "Recursion in C++ works by having a function call itself. The base case is crucial to prevent infinite recursion.",
            author: "Prof. Johnson",
            time: "1 hour ago"
        },
        {
            id: 2,
            questionId: 1,
            text: "Make sure your recursive function has: 1) Base case 2) Recursive case that moves toward base case.",
            author: "Senior Student",
            time: "30 minutes ago"
        }
    ],
    2: [
        {
            id: 1,
            questionId: 2,
            text: "I recommend starting with Andrew Ng's Machine Learning course on Coursera.",
            author: "ML Expert",
            time: "3 hours ago"
        },
        {
            id: 2,
            questionId: 2,
            text: "For Python ML, check out scikit-learn documentation and tutorials.",
            author: "Data Scientist",
            time: "2 hours ago"
        },
        {
            id: 3,
            questionId: 2,
            text: "Kaggle.com has excellent beginner-friendly ML tutorials with datasets.",
            author: "Kaggle Master",
            time: "1 hour ago"
        }
    ]
};

// Projects storage
let PROJECTS = JSON.parse(localStorage.getItem("campusProjects")) || [
    {
        id: 101,
        title: "Smart Attendance System",
        desc: "Automated attendance system using face recognition to mark student presence accurately.",
        difficulty: "Intermediate",
        tech: ["Python", "OpenCV", "AI"],
        reference: "https://github.com/example/smart-attendance",
    },
    {
        id: 102,
        title: "E-Commerce Website",
        desc: "Full-stack e-commerce application with authentication, product management, and payments.",
        difficulty: "Advanced",
        tech: ["React", "Node.js", "MongoDB"],
        reference: "https://github.com/example/ecommerce-app",
    },
    {
        id: 103,
        title: "Campus Connect Web App",
        desc: "A Reddit-like academic collaboration platform for students and faculty.",
        difficulty: "Advanced",
        tech: ["HTML", "CSS", "JavaScript"],
        reference: "https://github.com/example/campus-connect",
        
    },
    {
        id: 104,
        title: "AI Chatbot for College Helpdesk",
        desc: "AI chatbot to answer common student queries related to academics and campus facilities.",
        difficulty: "Intermediate",
        tech: ["Python", "NLP", "Flask"],
        reference: "https://github.com/example/college-chatbot",
       
    }
];

// User profile data
const USER_PROFILE = {
    name: "Keerthi Thalluri",
    branch: "AIML",
    year: "2rd Year",
    regNo: "24B01A42B8",
    rank: "Expert",
    points: 1250,
    questions: 0,
    answers: 0,
    upvotes: 0,
    level: "Beginner"
};

// Vote tracking
let USER_VOTES = JSON.parse(localStorage.getItem("campusUserVotes")) || {};

// Current user - FIXED: Proper default user
let CURRENT_USER = JSON.parse(localStorage.getItem("campusCurrentUser"));
if (!CURRENT_USER) {
    CURRENT_USER = {
        id: "user_" + Date.now(),
        name: "Current User",
        email: "user@campus.com"
    };
    localStorage.setItem("campusCurrentUser", JSON.stringify(CURRENT_USER));
}

/* ======================
   DOM Ready
====================== */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Dashboard initialized");
    
    setupSidebar();
    setupNavigation();
    setupEventListeners();
    loadUserProfile();
    loadQuestions();
    loadProjects();
    loadSavedItems();
    updateQuestionCount();
    updateAuthUI();
});

/* ======================
   Sidebar Functions
====================== */

function setupSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.getElementById("sidebarToggle");

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("expanded");
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 768 && sidebar && 
            !sidebar.contains(e.target) && 
            !e.target.closest('.sidebar-header')) {
            sidebar.classList.remove("expanded");
        }
    });
}

/* ======================
   Navigation Functions
====================== */

function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".view-section");
    const pageTitle = document.getElementById("pageTitle");

    // Function to switch sections
    window.switchSection = (id) => {
        console.log(`Switching to section: ${id}`);
        
        // Update active nav item
        navItems.forEach(n => n.classList.remove("active"));
        sections.forEach(s => s.style.display = "none");

        const activeNav = document.querySelector(`.nav-item[data-target="${id}"]`);
        if (activeNav) {
            activeNav.classList.add("active");
            const navText = activeNav.querySelector(".nav-text")?.textContent || "";
            pageTitle.textContent = navText;
        }

        // Show the selected section
        const section = document.getElementById(id);
        if (section) {
            section.style.display = "block";
            
            // Load section-specific content
            switch(id) {
                case "home":
                    loadQuestions();
                    break;
                case "projects":
                    loadProjects();
                    break;
                case "communities":
                    loadSavedItems();
                    break;
                case "quiz-roadmap":
                    
                case "profile":
                    loadProfile();
                    break;
            }
        }
    };

    // Add click event to nav items
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            switchSection(item.dataset.target);
        });
    });

    // Initialize with home section
    switchSection("home");
}

/* ======================
   Event Listeners
====================== */

function setupEventListeners() {
    // Feedback form
    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", (e) => {
            e.preventDefault();
            submitFeedback();
        });
    }

    // Question search
    const questionSearch = document.getElementById('questionSearch');
    if (questionSearch) {
        questionSearch.addEventListener('input', (e) => {
            filterQuestions(e.target.value);
        });
    }

    // Global search
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            filterGlobal(e.target.value);
        });
    }

    // Chatbot input enter key - FIXED
    const chatbotInput = document.getElementById("chatbotInput");
    if (chatbotInput) {
        chatbotInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }
}

/* ======================
   Questions Functions - FIXED
====================== */

function loadQuestions() {
    const container = document.getElementById("questionsList");
    if (!container) return;

    if (QUESTIONS.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-question-circle"></i>
                <h3>No Questions Yet</h3>
                <p>Be the first to ask a question!</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#askQuestionModal">
                    Ask a Question
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = QUESTIONS.map((q, index) => {
        const voted = USER_VOTES[q.id];
        const isAuthor = q.authorId === CURRENT_USER.id;
        const questionAnswers = ANSWERS[q.id] || [];
        
        return `
            <div class="item-card" data-question-id="${q.id}">
                <div class="item-header">
                    <div class="item-title">#${index + 1} ${q.title}</div>
                    <small class="text-muted">${q.time}</small>
                </div>
                
                <p>${q.desc}</p>
                
                <div class="item-meta">
                    <span><i class="fas fa-user me-1"></i>${q.author}</span>
                    <span><i class="fas fa-comments me-1"></i>${q.answers} answers</span>
                    <span><i class="fas fa-clock me-1"></i>${q.time}</span>
                </div>
                
                <div class="item-meta mb-2">
                    ${q.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
                </div>
                
                <div class="item-actions">
                    <button class="action-btn ${voted ? "active" : ""}" 
                            onclick="toggleVote(${q.id})">
                        <i class="fas fa-arrow-up"></i> ${q.votes}
                    </button>
                    
                    <button class="action-btn" onclick="toggleAnswers(${q.id})">
                        <i class="fas fa-comment"></i> Answer
                    </button>
                    
                    ${isAuthor ? `
                        <button class="action-btn delete-btn" onclick="deleteQuestion(${q.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                    
                    <button class="action-btn" onclick="saveQuestion(${q.id})">
                        <i class="fas fa-bookmark"></i> Save
                    </button>
                </div>
                
                <div class="answers-container" id="answers-${q.id}">
                    <!-- Answers will be loaded when toggled -->
                </div>
            </div>
        `;
    }).join("");
}

function submitQuestion() {
    const titleInput = document.getElementById("questionTitle");
    const descInput = document.getElementById("questionDesc");
    const tagsInput = document.getElementById("questionTags");

    const title = titleInput?.value.trim();
    const desc = descInput?.value.trim();
    const tags = tagsInput?.value.split(",")
        .map(t => t.trim())
        .filter(t => t);

    if (!title || !desc) {
        alert("Please enter both title and description");
        return;
    }

    const newQuestion = {
        id: Date.now(),
        title,
        desc,
        tags,
        votes: 0,
        answers: 0,
        time: "Just now",
        author: CURRENT_USER.name,
        authorId: CURRENT_USER.id
    };

    QUESTIONS.unshift(newQuestion);
    saveQuestions();
    loadQuestions();
    
    // Update user stats
    USER_PROFILE.questions++;
    updateUserStats();
    
    // Clear form
    if (titleInput) titleInput.value = "";
    if (descInput) descInput.value = "";
    if (tagsInput) tagsInput.value = "";

    // Close modal - FIXED: Use vanilla JS instead of bootstrap
    const modalElement = document.getElementById("askQuestionModal");
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        } else {
            // Fallback if modal instance not found
            const bsModal = new bootstrap.Modal(modalElement);
            bsModal.hide();
        }
    }
    
    showNotification("Question posted successfully!", "success");
}

function deleteQuestion(questionId) {
    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
        return;
    }

    const questionIndex = QUESTIONS.findIndex(q => q.id === questionId);
    
    if (questionIndex === -1) {
        alert("Question not found!");
        return;
    }

    // Check if user is the author
    if (QUESTIONS[questionIndex].authorId !== CURRENT_USER.id) {
        alert("You can only delete your own questions!");
        return;
    }

    // Remove question
    QUESTIONS.splice(questionIndex, 1);
    
    // Remove answers for this question
    if (ANSWERS[questionId]) {
        delete ANSWERS[questionId];
        saveAnswers();
    }
    
    saveQuestions();
    loadQuestions();
    
    // Update user stats
    USER_PROFILE.questions = Math.max(0, USER_PROFILE.questions - 1);
    updateUserStats();
    
    showNotification("Question deleted successfully!", "success");
}

function toggleVote(questionId) {
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) return;

    if (USER_VOTES[questionId]) {
        question.votes = Math.max(0, question.votes - 1);
        delete USER_VOTES[questionId];
        USER_PROFILE.upvotes = Math.max(0, USER_PROFILE.upvotes - 1);
    } else {
        question.votes++;
        USER_VOTES[questionId] = true;
        USER_PROFILE.upvotes++;
    }

    saveQuestions();
    saveUserVotes();
    updateUserStats();
    loadQuestions();
}

function filterQuestions(searchTerm) {
    const container = document.getElementById("questionsList");
    if (!container) return;

    if (!searchTerm.trim()) {
        loadQuestions();
        return;
    }

    const filtered = QUESTIONS.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No Results Found</h3>
                <p>No questions match your search criteria.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map((q, index) => {
        const voted = USER_VOTES[q.id];
        const isAuthor = q.authorId === CURRENT_USER.id;
        
        return `
            <div class="item-card" data-question-id="${q.id}">
                <div class="item-header">
                    <div class="item-title">#${index + 1} ${q.title}</div>
                    <small class="text-muted">${q.time}</small>
                </div>
                
                <p>${q.desc}</p>
                
                <div class="item-meta">
                    <span><i class="fas fa-user me-1"></i>${q.author}</span>
                    <span><i class="fas fa-comments me-1"></i>${q.answers} answers</span>
                    <span><i class="fas fa-clock me-1"></i>${q.time}</span>
                </div>
                
                <div class="item-meta mb-2">
                    ${q.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
                </div>
                
                <div class="item-actions">
                    <button class="action-btn ${voted ? "active" : ""}" 
                            onclick="toggleVote(${q.id})">
                        <i class="fas fa-arrow-up"></i> ${q.votes}
                    </button>
                    
                    <button class="action-btn" onclick="toggleAnswers(${q.id})">
                        <i class="fas fa-comment"></i> Answer
                    </button>
                    
                    ${isAuthor ? `
                        <button class="action-btn delete-btn" onclick="deleteQuestion(${q.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                    
                    <button class="action-btn" onclick="saveQuestion(${q.id})">
                        <i class="fas fa-bookmark"></i> Save
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

/* ======================
   Answers Functions - FIXED
====================== */

function toggleAnswers(questionId) {
    const container = document.getElementById(`answers-${questionId}`);
    if (!container) return;
    
    if (container.classList.contains("open")) {
        container.classList.remove("open");
        container.innerHTML = ""; // Clear content when closing
    } else {
        container.classList.add("open");
        loadAnswers(questionId, container);
    }
}

function loadAnswers(questionId, container) {
    const questionAnswers = ANSWERS[questionId] || [];
    const question = QUESTIONS.find(q => q.id === questionId);
    
    if (!question) return;
    
    let answersHTML = '';
    
    if (questionAnswers.length === 0) {
        answersHTML = `
            <div class="answer-item empty-answer">
                <p><i class="fas fa-comment-slash"></i> No answers yet. Be the first to answer!</p>
            </div>
        `;
    } else {
        answersHTML = questionAnswers.map(answer => `
            <div class="answer-item" data-answer-id="${answer.id}">
                <p>${answer.text}</p>
                <div class="answer-meta">
                    <span><i class="fas fa-user"></i> ${answer.author}</span>
                    <span><i class="fas fa-clock"></i> ${answer.time}</span>
                </div>
            </div>
        `).join('');
    }
    
    // Add answer input form
    answersHTML += `
        <div class="mt-3">
            <textarea id="answerInput-${questionId}" class="answer-input" 
                      placeholder="Write your answer here..." rows="3"></textarea>
            <div class="d-flex justify-content-between mt-2">
                <button class="btn btn-primary btn-sm" 
                        onclick="postAnswer(${questionId})">
                    <i class="fas fa-paper-plane me-1"></i> Post Answer
                </button>
                <button class="btn btn-outline-secondary btn-sm" 
                        onclick="toggleAnswers(${questionId})">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = answersHTML;
}

function postAnswer(questionId) {
    const answerInput = document.getElementById(`answerInput-${questionId}`);
    if (!answerInput) return;
    
    const answerText = answerInput.value.trim();
    
    if (!answerText) {
        alert("Please enter an answer");
        return;
    }
    
    // Get question
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) return;
    
    // Initialize answers array if not exists
    if (!ANSWERS[questionId]) {
        ANSWERS[questionId] = [];
    }
    
    // Create new answer
    const newAnswer = {
        id: Date.now(),
        questionId: questionId,
        text: answerText,
        author: CURRENT_USER.name,
        time: "Just now"
    };
    
    // Add answer
    ANSWERS[questionId].push(newAnswer);
    
    // Update question answer count
    question.answers = ANSWERS[questionId].length;
    question.time = "Updated just now";
    
    // Save data
    saveAnswers();
    saveQuestions();
    
    // Reload questions to update answer count
    loadQuestions();
    
    // Reload the answers container
    const container = document.getElementById(`answers-${questionId}`);
    if (container) {
        loadAnswers(questionId, container);
    }
    
    // Update user stats
    USER_PROFILE.answers++;
    updateUserStats();
    
    showNotification("Answer posted successfully!", "success");
}

/* ======================
   Projects Functions
====================== */

// Add these functions to your existing dashboard.js file

/* ============================================
   PROJECT SUBMISSION FUNCTION
   ============================================ */
function submitProject() {
    // Get form values
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const difficulty = document.getElementById('projectDifficulty').value;
    const link = document.getElementById('projectLink').value.trim();
    const technologies = document.getElementById('projectTechnologies').value.split(',')
        .map(t => t.trim())
        .filter(t => t);
    const category = document.getElementById('projectCategory').value;
    const notes = document.getElementById('projectNotes').value.trim();

    // Validation
    if (!title || !description || !difficulty || !link || technologies.length === 0) {
        showNotification('Please fill in all required fields (*)', 'error');
        return;
    }

    // Validate URL
    if (!isValidUrl(link) && !link.startsWith('http')) {
        showNotification('Please enter a valid URL for the project link', 'warning');
        return;
    }

    // Create new project object
    const newProject = {
        id: Date.now(),
        title: title,
        desc: description,
        difficulty: difficulty,
        tech: technologies,
        reference: link.startsWith('http') ? link : `https://${link}`,
        category: category,
        notes: notes,
        author: CURRENT_USER.name,
        authorId: CURRENT_USER.id,
        createdAt: new Date().toISOString(),
        featured: false
    };

    // Add to projects array
    PROJECTS.unshift(newProject);
    saveProjects();
    loadProjects();

    // Update user points
    USER_PROFILE.points += 50; // Points for adding a project
    updateUserStats();

    // Clear form
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectDifficulty').value = '';
    document.getElementById('projectLink').value = '';
    document.getElementById('projectTechnologies').value = '';
    document.getElementById('projectCategory').value = 'Web Development';
    document.getElementById('projectNotes').value = '';

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProjectModal'));
    if (modal) modal.hide();

    // Show success message
    showNotification('Project added successfully! 🎉', 'success');

    // Add activity
    addActivity('project', `Added new project: "${title}"`);
}

/* ============================================
   URL VALIDATION FUNCTION
   ============================================ */
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/* ============================================
   UPDATED LOAD PROJECTS FUNCTION
   ============================================ */
function loadProjects() {
    const container = document.getElementById('projectsList');
    if (!container) return;

    if (PROJECTS.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-projects">
                    <div class="empty-projects-icon">
                        <i class="fas fa-code-branch"></i>
                    </div>
                    <h3>No Projects Yet</h3>
                    <p>Be the first to add a project or browse existing ones!</p>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProjectModal">
                        <i class="fas fa-plus me-2"></i> Add First Project
                    </button>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = PROJECTS.map((project, index) => {
        const isAuthor = project.authorId === CURRENT_USER.id;
        const isSaved = project.saved;
        
        return `
            <div class="col-md-6 col-lg-4">
                <div class="project-card" style="animation-delay: ${index * 0.1}s">
                    ${project.featured ? `
                        <div class="featured-badge">
                            <i class="fas fa-star"></i> Featured
                        </div>
                    ` : ''}
                    
                    <div class="project-card-header">
                        <h3 class="project-card-title">${project.title}</h3>
                        <span class="project-difficulty ${project.difficulty.toLowerCase()}">
                            ${project.difficulty}
                        </span>
                    </div>
                    
                    <p class="project-description">${project.desc}</p>
                    
                    <div class="project-technologies">
                        ${project.tech.slice(0, 4).map(tech => `
                            <span class="tech-tag">${tech}</span>
                        `).join('')}
                        ${project.tech.length > 4 ? `<span class="tech-tag">+${project.tech.length - 4}</span>` : ''}
                    </div>
                    
                    <div class="mb-3">
                        <span class="badge bg-light text-dark">
                            <i class="fas fa-tag me-1"></i> ${project.category}
                        </span>
                    </div>
                    
                    <div class="mb-3">
                        <a href="${project.reference}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i>
                            View Project Reference
                        </a>
                    </div>
                    
                    ${project.author ? `
                        <div class="project-author">
                            <small class="text-muted">
                                <i class="fas fa-user me-1"></i> Added by ${project.author}
                            </small>
                        </div>
                    ` : ''}
                    
                        
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/* ============================================
   DELETE PROJECT FUNCTION
   ============================================ */
function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        return;
    }

    const projectIndex = PROJECTS.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
        showNotification('Project not found!', 'error');
        return;
    }

    // Check if user is the author
    if (PROJECTS[projectIndex].authorId !== CURRENT_USER.id) {
        showNotification('You can only delete your own projects!', 'error');
        return;
    }

    // Remove project
    const deletedProject = PROJECTS.splice(projectIndex, 1)[0];
    
    // Save and update
    saveProjects();
    loadProjects();
    
    // Update user points
    USER_PROFILE.points = Math.max(0, USER_PROFILE.points - 25);
    updateUserStats();
    
    // Show notification
    showNotification('Project deleted successfully!', 'success');
    
    // Add activity
    addActivity('delete', `Deleted project: "${deletedProject.title}"`);
}

/* ============================================
   UPDATED TOGGLE SAVE PROJECT FUNCTION
   ============================================ */
function toggleSaveProject(projectId) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    project.saved = !project.saved;
    saveProjects();
    loadProjects();
    loadSavedItems();
    
    showNotification(
        project.saved ? 'Project saved to your collection!' : 'Project removed from saved', 
        project.saved ? 'success' : 'info'
    );
    
    // Add activity if saved
    if (project.saved) {
        addActivity('save', `Saved project: "${project.title}"`);
    }
}

/* ============================================
   ADD ACTIVITY FUNCTION
   ============================================ */
function addActivity(type, text) {
    const iconMap = {
        'question': 'fa-question-circle',
        'answer': 'fa-comment-alt',
        'upvote': 'fa-arrow-up',
        'save': 'fa-bookmark',
        'delete': 'fa-trash',
        'project': 'fa-code-branch',
        'achievement': 'fa-trophy'
    };
    
    const newActivity = {
        type,
        text,
        time: 'Just now',
        icon: iconMap[type] || 'fa-bell'
    };
    
    // Add to activities array (if you have one)
    if (window.ACTIVITIES) {
        window.ACTIVITIES.unshift(newActivity);
        if (window.ACTIVITIES.length > 5) window.ACTIVITIES.pop();
    }
    
    console.log(`Activity: ${text}`);
}

/* ============================================
   SHOW NOTIFICATION FUNCTION
   ============================================ */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${getNotificationIcon(type)} me-3"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : 
                     type === 'error' ? '#dc3545' : 
                     type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || 'fa-bell';
}

/* ============================================
   UPDATED SAVE PROJECTS FUNCTION
   ============================================ */
function saveProjects() {
    localStorage.setItem('campusProjects', JSON.stringify(PROJECTS));
}

/* ============================================
   INITIALIZE PROJECTS IN DOM READY
   ============================================ */
// In your existing DOMContentLoaded event listener, make sure to load projects:
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    // Load projects
    loadProjects();
    
    // ... rest of your initialization code ...
});

/* ============================================
   ADD THESE FUNCTIONS TO WINDOW OBJECT
   ============================================ */
// Make sure these functions are available globally
window.submitProject = submitProject;
window.deleteProject = deleteProject;
window.toggleSaveProject = toggleSaveProject;
window.upvoteProject = upvoteProject;

function loadProjects() {
    const container = document.getElementById("projectsList");
    if (!container) return;

    container.innerHTML = PROJECTS.map(project => {
        const isSaved = project.saved;
        
        return `
            <div class="col-md-6">
                <div class="item-card h-100">
                    <div class="item-header">
                        <div class="item-title">${project.title}</div>
                        <span class="tag ${project.difficulty.toLowerCase()}">${project.difficulty}</span>
                    </div>
                    
                    <p>${project.desc}</p>
                    
                    <div class="item-meta mb-2">
                        ${project.tech.map(tech => `<span class="tag">${tech}</span>`).join("")}
                    </div>
                    
                    <div class="project-reference-section mb-3">
                        <i class="fas fa-link me-2"></i>
                        <a href="${project.reference}" target="_blank" class="project-link">
                            ${project.reference.replace('https://', '')}
                        </a>
                    </div>
                    
                        
                        <button class="action-btn ${isSaved ? 'active' : ''}" 
                                onclick="toggleSaveProject(${project.id})">
                            <i class="fas ${isSaved ? 'fa-bookmark' : 'fa-bookmark'}"></i> 
                            ${isSaved ? 'Saved' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function upvoteProject(projectId) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    project.votes++;
    saveProjects();
    loadProjects();
}

function toggleSaveProject(projectId) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    project.saved = !project.saved;
    saveProjects();
    loadProjects();
    loadSavedItems();
    
    showNotification(
        project.saved ? "Project saved!" : "Project removed from saved", 
        project.saved ? "success" : "info"
    );
}

/* ======================
   Saved Items Functions
====================== */

function loadSavedItems() {
    const container = document.getElementById("savedList");
    if (!container) return;

    const savedProjects = PROJECTS.filter(p => p.saved);
    
    if (savedProjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bookmark"></i>
                <h3>No Saved Projects</h3>
                <p>Save projects to find them here easily!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = savedProjects.map(project => {
        return `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-title">${project.title}</div>
                    <span class="tag ${project.difficulty.toLowerCase()}">${project.difficulty}</span>
                </div>
                
                <p>${project.desc}</p>
                
                <div class="item-meta mb-2">
                    ${project.tech.map(tech => `<span class="tag">${tech}</span>`).join("")}
                </div>
                
                <div class="project-reference-section mb-3">
                    <i class="fas fa-link me-2"></i>
                    <a href="${project.reference}" target="_blank" class="project-link">
                        ${project.reference.replace('https://', '')}
                    </a>
                </div>
                
                <div class="item-actions">
                    <button class="action-btn" onclick="upvoteProject(${project.id})">
                        <i class="fas fa-arrow-up"></i> ${project.votes}
                    </button>
                    
                    <button class="action-btn delete-btn" onclick="toggleSaveProject(${project.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function saveQuestion(questionId) {
    // Implementation for saving questions
    showNotification("Question saved to your collection!", "success");
}

/* ======================
   Profile Functions
====================== */

function loadUserProfile() {
    // Load user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("campusCurrentUser"));
    if (storedUser) {
        CURRENT_USER = storedUser;
    }
}

function loadProfile() {
    // Update profile information
    document.getElementById("profileName").textContent = USER_PROFILE.name;
    document.getElementById("profileRegNo").textContent = USER_PROFILE.regNo;
    document.getElementById("profileYear").textContent = USER_PROFILE.year;
    document.getElementById("profileBranch").textContent = USER_PROFILE.branch;
    document.getElementById("profileAbout").textContent = USER_PROFILE.about || 
        "Curious learner interested in full-stack development and problem solving. Actively participating in CampusConnect discussions.";
    
    // Update profile initials
    const initials = USER_PROFILE.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById("profileInitials").textContent = initials;
    
    // Update stats
    updateUserStats();
}

function updateUserStats() {
    // Calculate stats from questions
    const userQuestions = QUESTIONS.filter(q => q.authorId === CURRENT_USER.id);
    const totalUpvotes = userQuestions.reduce((sum, q) => sum + q.votes, 0);
    
    // Calculate total answers given by user
    let totalAnswers = 0;
    Object.values(ANSWERS).forEach(answerArray => {
        totalAnswers += answerArray.filter(a => a.author === CURRENT_USER.name).length;
    });
    
    // Update profile stats
    USER_PROFILE.questions = userQuestions.length;
    USER_PROFILE.upvotes = totalUpvotes;
    USER_PROFILE.answers = totalAnswers;
    
    // Determine level based on upvotes
    if (totalUpvotes >= 100) USER_PROFILE.level = "Expert";
    else if (totalUpvotes >= 50) USER_PROFILE.level = "Advanced";
    else if (totalUpvotes >= 20) USER_PROFILE.level = "Intermediate";
    else USER_PROFILE.level = "Beginner";
    
    // Update UI
    document.getElementById("statQuestions").textContent = USER_PROFILE.questions;
    document.getElementById("statUpvotes").textContent = USER_PROFILE.upvotes;
    document.getElementById("statAnswers").textContent = USER_PROFILE.answers;
    document.getElementById("statLevel").textContent = USER_PROFILE.level;
}

function updateQuestionCount() {
    USER_PROFILE.questions = QUESTIONS.filter(q => q.authorId === CURRENT_USER.id).length;
    updateUserStats();
}

/* ======================
   Feedback Functions
====================== */

function submitFeedback() {
    const subject = document.getElementById("fbSubject").value.trim();
    const message = document.getElementById("fbMessage").value.trim();
    
    if (!subject || !message) {
        alert("Please fill in all fields");
        return;
    }
    
    // In a real application, you would send this to a server
    console.log("Feedback submitted:", { subject, message });
    
    // Clear form
    document.getElementById("fbSubject").value = "";
    document.getElementById("fbMessage").value = "";
    
    showNotification("Thank you for your feedback!", "success");
}

/* ======================
   Chatbot Functions
====================== */

function toggleChatbot() {
    const window = document.getElementById("chatbotWindow");
    if (window.style.display === "flex") {
        window.style.display = "none";
    } else {
        window.style.display = "flex";
        // Scroll to bottom
        const messages = document.getElementById("chatbotMessages");
        messages.scrollTop = messages.scrollHeight;
    }
}

function sendMessage() {
    const input = document.getElementById("chatbotInput");
    const messages = document.getElementById("chatbotMessages");

    if (!input || !input.value.trim()) return;

    // Add user message
    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.innerHTML = input.value;
    messages.appendChild(userMsg);

    // Generate bot response
    setTimeout(() => {
        const botMsg = document.createElement("div");
        botMsg.className = "message bot";
        
        const text = input.value.toLowerCase();
        let response = "";
        
        if (text.includes("project")) {
            response = "You can find faculty-curated projects in the Projects section. Click on the folder icon in the sidebar! 📂";
        } else if (text.includes("question") || text.includes("ask")) {
            response = "Click the '+ Ask Question' button to post your doubts. Make sure to add relevant tags! 💡";
        } else if (text.includes("delete") || text.includes("remove")) {
            response = "You can delete your own questions by clicking the delete button (trash icon) on your question cards. 🗑️";
        } else if (text.includes("profile")) {
            response = "Your profile details and stats are available in the Profile section. Click the user icon! 👤";
        } else if (text.includes("save") || text.includes("bookmark")) {
            response = "You can save projects by clicking the bookmark icon on project cards. Find them later in the Saved section! 🔖";
        } else if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
            response = "Hello! I'm CampusConnect AI. How can I assist you today? 😊";
        } else if (text.includes("answer") || text.includes("comment")) {
            response = "To answer a question, click the 'Answer' button below any question and type your response in the text box that appears! 💬";
        } else {
            response = "I can help you with questions about projects, asking questions, deleting content, saving items, or profile info. What would you like to know?";
        }
        
        botMsg.innerHTML = response;
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    }, 500);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;
}

function handleChatbotKeypress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
}

/* ======================
   Helper Functions
====================== */

function saveQuestions() {
    localStorage.setItem("campusQuestions", JSON.stringify(QUESTIONS));
}

function saveAnswers() {
    localStorage.setItem("campusAnswers", JSON.stringify(ANSWERS));
}

function saveProjects() {
    localStorage.setItem("campusProjects", JSON.stringify(PROJECTS));
}

function saveUserVotes() {
    localStorage.setItem("campusUserVotes", JSON.stringify(USER_VOTES));
}

function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8"};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function updateAuthUI() {
    const authSection = document.getElementById("authSection");
    if (!authSection) return;

    authSection.innerHTML = `
        <div class="dropdown">
            <button class="btn btn-outline-primary dropdown-toggle" type="button" 
                    data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-user me-2"></i>${CURRENT_USER.name}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#" onclick="switchSection('profile')">
                    <i class="fas fa-user me-2"></i>Profile
                </a></li>
                <li><a class="dropdown-item" href="#" onclick="switchSection('saved')">
                    <i class="fas fa-bookmark me-2"></i>Saved Items
                </a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt me-2"></i>Logout
                </a></li>
            </ul>
        </div>
    `;
}

function handleLogout() {
    localStorage.removeItem("campusCurrentUser");
    window.location.href = "login.html";
}

function filterGlobal(searchTerm) {
    if (!searchTerm.trim()) {
        // If empty search, show current section
        const activeSection = document.querySelector('.nav-item.active');
        if (activeSection) {
            switchSection(activeSection.dataset.target);
        }
        return;
    }
    
    // Search in all sections
    const searchLower = searchTerm.toLowerCase();
    
    // Check questions
    const questionMatches = QUESTIONS.filter(q => 
        q.title.toLowerCase().includes(searchLower) ||
        q.desc.toLowerCase().includes(searchLower) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
    
    // Check projects
    const projectMatches = PROJECTS.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.desc.toLowerCase().includes(searchLower) ||
        p.tech.some(tech => tech.toLowerCase().includes(searchLower))
    );
    
    // Show results
    const container = document.getElementById("questionsList");
    if (container) {
        if (questionMatches.length === 0 && projectMatches.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No Results Found</h3>
                    <p>No items match your search criteria.</p>
                </div>
            `;
        } else {
            let resultsHTML = '';
            
            if (questionMatches.length > 0) {
                resultsHTML += `
                    <h4 class="mb-3"><i class="fas fa-question-circle me-2"></i>Questions (${questionMatches.length})</h4>
                    ${questionMatches.map((q, index) => `
                        <div class="item-card mb-3">
                            <div class="item-header">
                                <div class="item-title">${q.title}</div>
                            </div>
                            <p>${q.desc.substring(0, 150)}...</p>
                            <div class="item-meta">
                                ${q.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
                            </div>
                        </div>
                    `).join('')}
                `;
            }
            
            if (projectMatches.length > 0) {
                resultsHTML += `
                    <h4 class="mb-3 mt-4"><i class="fas fa-folder me-2"></i>Projects (${projectMatches.length})</h4>
                    <div class="row g-3">
                        ${projectMatches.map(p => `
                            <div class="col-md-6">
                                <div class="item-card">
                                    <div class="item-header">
                                        <div class="item-title">${p.title}</div>
                                        <span class="tag">${p.difficulty}</span>
                                    </div>
                                    <p>${p.desc.substring(0, 100)}...</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            container.innerHTML = resultsHTML;
        }
    }
}

/* ==========================
   COMMUNITIES LOGIC
========================== */

const COMMUNITIES = [
    { id: 1, name: "Coding Club", members: 120 },
    { id: 2, name: "AI & ML Society", members: 85 },
    { id: 3, name: "Robotics Club", members: 60 }
];

const communityList = document.getElementById("communityList");
const adminRequests = document.getElementById("adminRequests");

function loadCommunities() {
    if (!communityList) return;
    communityList.innerHTML = "";

    COMMUNITIES.forEach(c => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        col.innerHTML = `
            <div class="item-card">
                <h5>${c.name}</h5>
                <p>${c.members} members</p>
                <button class="btn btn-outline-primary btn-sm"
                        onclick="requestJoin('${c.name}')">
                    Request to Join
                </button>
            </div>
        `;

        communityList.appendChild(col);
    });
}

function requestJoin(name) {
    const req = document.createElement("div");
    req.className = "alert alert-warning d-flex justify-content-between align-items-center";
    req.innerHTML = `
        <span>Join request for <strong>${name}</strong></span>
        <button class="btn btn-success btn-sm" onclick="approveRequest(this)">
            Approve
        </button>
    `;
    adminRequests.appendChild(req);
}

function approveRequest(btn) {
    btn.parentElement.className = "alert alert-success";
    btn.remove();
}

/* Load when section opens */
document.addEventListener("DOMContentLoaded", loadCommunities);


const tabQuiz = document.getElementById("tabQuiz");
const tabRoadmap = document.getElementById("tabRoadmap");

const quizSection = document.getElementById("quizSection");
const roadmapSection = document.getElementById("roadmapSection");

if (tabQuiz && tabRoadmap) {

  // default
  quizSection.style.display = "block";
  roadmapSection.style.display = "none";

  tabQuiz.addEventListener("click", () => {
    tabQuiz.classList.add("active");
    tabRoadmap.classList.remove("active");

    quizSection.style.display = "block";
    roadmapSection.style.display = "none";
  });

  tabRoadmap.addEventListener("click", () => {
    tabRoadmap.classList.add("active");
    tabQuiz.classList.remove("active");

    roadmapSection.style.display = "block";
    quizSection.style.display = "none";
  });
}
