// Sample Communities
const communities = [
  {
    id: 1,
    name: "Coding Club",
    desc: "Learn DSA, web dev, and hackathons.",
    status: "none",
    link: "https://chat.whatsapp.com/example-coding"
  },
  {
    id: 2,
    name: "Robotics Club",
    desc: "Build robots, compete and innovate.",
    status: "none",
    link: "https://chat.whatsapp.com/example-robotics"
  },
  {
    id: 3,
    name: "Literary Club",
    desc: "Public speaking, debates, poetry sessions.",
    status: "none",
    link: "https://chat.whatsapp.com/example-literary"
  }
];

const communityList = document.getElementById("communityList");
const adminRequests = document.getElementById("adminRequests");

function renderCommunities() {
  communityList.innerHTML = "";

  communities.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${c.name}</h3>
      <span class="badge">Admin Managed</span>
      <p>${c.desc}</p>

      ${c.status === "none" ? `
        <button class="btn-request" onclick="requestAccess(${c.id})">
          Request Access
        </button>
      ` : ""}

      ${c.status === "pending" ? `
        <button class="btn-disabled" disabled>Pending Approval...</button>
      ` : ""}

      ${c.status === "approved" ? `
        <div class="link-box">
          WhatsApp Group Link: <br>
          <strong>${c.link}</strong>
        </div>
      ` : ""}
    `;

    communityList.appendChild(card);
  });
}

function renderAdminPanel() {
  adminRequests.innerHTML = "";

  const pending = communities.filter(c => c.status === "pending");

  if (pending.length === 0) {
    adminRequests.innerHTML = "<p>No pending requests.</p>";
    return;
  }

  pending.forEach(c => {
    const row = document.createElement("div");
    row.className = "card";

    row.innerHTML = `
      <strong>${c.name}</strong> — Join Request
      <br><br>
      <button class="btn-approve" onclick="approve(${c.id})">Approve</button>
      <button class="btn-reject" onclick="reject(${c.id})">Reject</button>
    `;

    adminRequests.appendChild(row);
  });
}

    function goToDashboard() {
        window.location.href = "dashboard.html";
    }


function requestAccess(id) {
  const community = communities.find(c => c.id === id);
  community.status = "pending";
  renderCommunities();
  renderAdminPanel();
}

function approve(id) {
  const community = communities.find(c => c.id === id);
  community.status = "approved";
  renderCommunities();
  renderAdminPanel();
}

function reject(id) {
  const community = communities.find(c => c.id === id);
  community.status = "none";
  renderCommunities();
  renderAdminPanel();
}

// Initial render
renderCommunities();
renderAdminPanel();
