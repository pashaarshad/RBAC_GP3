// RBAC Group 3 - Offline Task Manager (Manual Mode)
// ---------------------------------------------------------
// 📝 NOTE: This file contains all task data.
// To add/edit tasks permanently, edit the 'defaultTasks' array below.
// ---------------------------------------------------------

// 1. Define Team Members
const teamMembers = [
    'Arshad Pasha', 'Depuru Joshika Reddy', 'Guru Karthik Reddy Marthala',
    'Kavya Ghantasala', 'Kushagra Bhargava', 'Mandha Shirisha',
    'Sri Saranya Chandrapati', 'Vinuthna Jangam'
];

// 2. Define The Tasks (WEEK 1 DETAILED PLAN)
const defaultTasks = [
    // Task 1: Environment Setup (Member 1: Arshad)
    {
        id: 1,
        title: 'Environment Setup & Standardization',
        description: `<strong>Goal:</strong> Make sure the whole team uses the same Python setup.<br><br>
1. Create Python virtual environment.<br>
2. Install required packages: FastAPI, Streamlit, LangChain, sentence-transformers, pandas.<br>
3. Create requirements.txt.<br>
4. Write simple setup steps (SETUP.md).<br>
5. Test if the setup works without errors.<br><br>
<strong>📌 Output:</strong> requirements.txt + setup instructions`,
        assignee: 'Arshad Pasha',
        priority: 'high',
        milestone: 'Milestone 1',
        due_date: '2026-01-07',
        status: 'in-progress'
    },

    // Task 2: Repository & Folder Structure (Member 2: Depuru Joshika Reddy)
    {
        id: 2,
        title: 'Repository & Folder Structure',
        description: `<strong>Goal:</strong> Prepare a clean, professional project structure.<br><br>
1. Clone the GitHub documents repo.<br>
2. Decide folder structure (e.g. data/finance, data/hr, backend/, frontend/).<br>
3. Keep files organized (no random dumps).<br>
4. Clean up the repo.<br><br>
<strong>📌 Output:</strong> Final folder structure committed to repo.`,
        assignee: 'Depuru Joshika Reddy',
        priority: 'high',
        milestone: 'Milestone 1',
        due_date: '2026-01-08',
        status: 'pending'
    },

    // Task 3: Finance & CSV Document Exploration (Member 3: Guru Karthik Reddy)
    {
        id: 3,
        title: 'Finance & CSV Document Exploration',
        description: `<strong>Goal:</strong> Understand what data exists in Finance & CSVs.<br><br>
1. Explore all CSV files in the dataset.<br>
2. Identify what information each file contains.<br>
3. Note sensitive vs general information.<br>
4. Create short summaries for the team.<br><br>
<strong>📌 Output:</strong> Document summaries (short, clear notes).`,
        assignee: 'Guru Karthik Reddy Marthala',
        priority: 'medium',
        milestone: 'Milestone 1',
        due_date: '2026-01-09',
        status: 'pending'
    },

    // Task 4: HR Documents Exploration (Member 4: Kavya Ghantasala)
    {
        id: 4,
        title: 'HR Documents Exploration',
        description: `<strong>Goal:</strong> Analyze all HR-related documents.<br><br>
1. Read through HR policy documents and employee records.<br>
2. Identify key data points (Salary, Personal Info, Public Info).<br>
3. Determine who should access these (e.g. HR Only vs All Employees).<br><br>
<strong>📌 Output:</strong> HR Document summaries & sensitivity notes.`,
        assignee: 'Kavya Ghantasala',
        priority: 'medium',
        milestone: 'Milestone 1',
        due_date: '2026-01-09',
        status: 'pending'
    },

    // Task 5: Marketing Documents Exploration (Member 5: Kushagra Bhargava)
    {
        id: 5,
        title: 'Marketing Documents Exploration',
        description: `<strong>Goal:</strong> Analyze Marketing & Sales materials.<br><br>
1. Review marketing campaigns, brochures, and public docs.<br>
2. Identify which documents are "Public" (Safe) and which are "Internal Strategies" (Confidential).<br><br>
<strong>📌 Output:</strong> Marketing Document summaries.`,
        assignee: 'Kushagra Bhargava',
        priority: 'low',
        milestone: 'Milestone 1',
        due_date: '2026-01-09',
        status: 'pending'
    },

    // Task 6: Engineering / Tech Docs Exploration (Member 6: Mandha Shirisha)
    {
        id: 6,
        title: 'Engineering & Tech Docs Exploration',
        description: `<strong>Goal:</strong> Understand the technical documentation.<br><br>
1. Review API docs, architecture diagrams, and dev guides.<br>
2. Summarize the technical stack described in the docs.<br>
3. Identify access mapping (Engineering Team only?).<br><br>
<strong>📌 Output:</strong> Tech details summary.`,
        assignee: 'Mandha Shirisha',
        priority: 'medium',
        milestone: 'Milestone 1',
        due_date: '2026-01-09',
        status: 'pending'
    },

    // Task 7: Role-Document Mapping (Member 7: Sri Saranya Chandrapati)
    {
        id: 7,
        title: 'Role-to-Document Mapping (RBAC)',
        description: `<strong>Goal:</strong> Decide access control (RBAC foundation).<br><br>
1. Map roles clearly: Finance → finance docs, HR → HR docs, etc.<br>
2. Define "C-Level" access (ALL docs).<br>
3. Define "Employee" access (General Handbook).<br>
4. Create a matrix table.<br><br>
<strong>📌 Output:</strong> Role-Document Mapping table (Markdown).`,
        assignee: 'Sri Saranya Chandrapati',
        priority: 'high',
        milestone: 'Milestone 1',
        due_date: '2026-01-11',
        status: 'pending'
    },

    // Task 8: Final Week 1 Summary & README (Member 8: Vinuthna Jangam)
    {
        id: 8,
        title: 'Final Week 1 Summary Report',
        description: `<strong>Goal:</strong> Make everything understandable for future weeks.<br><br>
1. Combine everyone's summaries (Env Setup, Data notes, Role mapping).<br>
2. Write a consolidated WEEK1_SUMMARY.md.<br>
3. Ensure the README.md is clean and professional.<br>
4. Verify the repo looks good.<br><br>
<strong>📌 Output:</strong> WEEK1_SUMMARY.md & Updated README.`,
        assignee: 'Vinuthna Jangam',
        priority: 'high',
        milestone: 'Milestone 1',
        due_date: '2026-01-12',
        status: 'pending'
    }
];

// STATE MGMT
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

// DOM Elements
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const addTaskBtn = document.getElementById('addTaskBtn');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const tasksContainer = document.getElementById('tasksContainer');
const emptyState = document.getElementById('emptyState');
const modalTitle = document.getElementById('modalTitle');
const filterTabs = document.querySelectorAll('.filter-tab');

// INITIALIZE
document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
    setupEventListeners();
    setupNavigation();
});

// --- CORE FUNCTIONS (LOCAL ONLY) ---

function loadTasks() {
    // 1. Try to get assignments from LocalStorage (so checkboxes work)
    const stored = localStorage.getItem('rbac_tasks_local_v2'); // New key for fresh start

    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        // 2. First time? Use the Code defaults
        tasks = [...defaultTasks];
        saveTasks();
    }

    renderTasks();
    updateStats();
}

function saveTasks() {
    localStorage.setItem('rbac_tasks_local_v2', JSON.stringify(tasks));
    renderTasks();
    updateStats();
}

// "Restore Defaults" Button
function seedDatabase() {
    if (confirm("Load the 'Week 1 Detailed Plan' for all 8 members? This will reset current changes.")) {
        tasks = [...defaultTasks];
        saveTasks();
        alert("Week 1 Plan Loaded Successfully!");
    }
}
window.seedDatabase = seedDatabase;

// Create
function createTask(taskData) {
    const newId = Date.now(); // Simple ID generation
    const newTask = { ...taskData, id: newId, created_at: new Date().toISOString() };
    tasks.unshift(newTask);
    saveTasks();
}

// Update
function updateTask(id, updates) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        saveTasks();
    }
}

// Delete
function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
}

// --- UI HANDLING ---

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        updateTask(id, { status: newStatus });
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        // Strip HTML for the form edit
        const cleanDesc = task.description.replace(/<br>/g, '\n').replace(/<strong>/g, '').replace(/<\/strong>/g, '');
        const editableTask = { ...task, description: cleanDesc };
        openModal(editableTask);
    }
}

function toggleDescription(id) {
    const descEl = document.getElementById(`desc-${id}`);
    const btnEl = document.getElementById(`btn-${id}`);

    if (descEl.classList.contains('expanded')) {
        descEl.classList.remove('expanded');
        btnEl.textContent = 'See Full Description ⬇';
    } else {
        descEl.classList.add('expanded');
        btnEl.textContent = 'Hide Description ⬆';
    }
}
// Global scope for HTML button
window.toggleDescription = toggleDescription;

function handleFormSubmit(e) {
    e.preventDefault();
    // Convert newlines to BR for display
    const rawDesc = document.getElementById('taskDescription').value;
    const formattedDesc = rawDesc.replace(/\n/g, '<br>');

    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: formattedDesc,
        assignee: document.getElementById('assignee').value,
        priority: document.getElementById('priority').value,
        milestone: document.getElementById('milestone').value,
        due_date: document.getElementById('dueDate').value,
        status: document.getElementById('status').value
    };

    if (editingTaskId) {
        updateTask(editingTaskId, taskData);
    } else {
        createTask(taskData);
    }
    closeModal();
}

// --- RENDER FUNCTIONS (CLEANED UP) ---

function renderTasks() {
    let filteredTasks = tasks;
    if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(t => t.status === currentFilter);
    }

    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = '';
        if (tasks.length === 0) {
            emptyState.style.display = 'block';
            tasksContainer.style.display = 'none';
        } else {
            tasksContainer.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-secondary)">No tasks found.</div>`;
            emptyState.style.display = 'none';
            tasksContainer.style.display = 'block';
        }
    } else {
        emptyState.style.display = 'none';
        tasksContainer.style.display = 'grid';
        tasksContainer.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');
    }
}

function createTaskHTML(task) {
    const names = task.assignee.split(' ');
    const initials = names.map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Status badges REMOVED
    const priorityClass = `priority-${task.priority}`;

    return `
    <div class="task-card ${priorityClass}">
        <div class="task-header">
            <!-- Space holder if needed or just empty -->
            <div style="flex-grow:1"></div> 
            
            <div class="task-actions">
                <button onclick="editTask(${task.id})" class="btn-icon" title="Edit">✏️</button>
                <button onclick="deleteTask(${task.id})" class="btn-icon delete" title="Delete">🗑️</button>
            </div>
        </div>
        
        <h3 class="task-title" style="margin-top:-10px">${task.title}</h3>
        
        <div class="task-desc-wrapper">
            <p class="task-desc" id="desc-${task.id}">${task.description}</p>
            <button class="read-more-btn" id="btn-${task.id}" onclick="toggleDescription(${task.id})">See Full Description ⬇</button>
        </div>
        
        <div class="task-milestone">🚩 ${task.milestone}</div>

        <div class="task-footer">
            <div class="task-meta">
                <div class="task-assignee">
                    <div class="assignee-avatar">${initials}</div>
                    ${task.assignee}
                </div>
                <div class="task-date">📅 Due: ${task.due_date || 'No Date'}</div>
            </div>
            
            <!-- Check/Complete Button REMOVED -->
        </div>
    </div>
    `;
}

function updateStats() {
    // Only update if elements exist (Safe for tasks.html)
    const totalEl = document.getElementById('totalTasks');
    if (!totalEl) return;

    totalEl.textContent = tasks.length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => t.status === 'pending').length;
    document.getElementById('inProgressTasks').textContent = tasks.filter(t => t.status === 'in-progress').length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.status === 'completed').length;
}

// Helpers
function setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle) {
        navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }
}

function setupEventListeners() {
    addTaskBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    taskModal.addEventListener('click', (e) => { if (e.target === taskModal) closeModal(); });
    taskForm.addEventListener('submit', handleFormSubmit);

    // Filter tabs listener (safe check)
    if (filterTabs && filterTabs.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentFilter = tab.dataset.filter;
                renderTasks();
            });
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(task = null) {
    taskModal.classList.add('active');
    if (task) {
        editingTaskId = task.id;
        modalTitle.textContent = 'Edit Task';
        document.getElementById('taskTitle').value = task.title;
        // Strip HTML for editing
        const cleanDesc = task.description.replace(/<br>/g, '\n').replace(/<strong>/g, '').replace(/<\/strong>/g, '');
        document.getElementById('taskDescription').value = cleanDesc;

        document.getElementById('assignee').value = task.assignee;
        document.getElementById('priority').value = task.priority;
        document.getElementById('milestone').value = task.milestone;
        document.getElementById('dueDate').value = task.due_date || '';
        document.getElementById('status').value = task.status;
    } else {
        editingTaskId = null;
        modalTitle.textContent = 'Add New Task';
        taskForm.reset();
    }
}

function closeModal() {
    taskModal.classList.remove('active');
    taskForm.reset();
    editingTaskId = null;
}
