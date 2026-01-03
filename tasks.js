// RBAC Group 3 - Task Manager JavaScript with Supabase

// ---------------------------------------------------------
// ⚡ SETUP INSTRUCTIONS:
// 1. Create a project at https://supabase.com
// 2. Create a table named 'tasks' with columns:
//    - id (int8, primary key)
//    - title (text)
//    - description (text)
//    - assignee (text)
//    - priority (text)
//    - milestone (text)
//    - due_date (date)
//    - status (text)
//    - created_at (timestamptz)
// 3. Copy your project URL and Key below.
// ---------------------------------------------------------

const SUPABASE_URL = 'https://tnmcaqnsstvumpdcxasl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bnfb-4IdAN4brgMftH_FYg_SSE5T2Xi';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Default Team Members for Dropdowns (Reference)
const teamMembers = [
    'Arshad Pasha', 'Depuru Joshika Reddy', 'Guru Karthik Reddy Marthala',
    'Kavya Ghantasala', 'Kushagra Bhargava', 'Mandha Shirisha',
    'Sri Saranya Chandrapati', 'Vinuthna Jangam'
];

// Default Tasks (Week 1)
const defaultTasks = [
    {
        title: 'Set up Python Virtual Environment',
        description: 'Install Python 3.8+, create virtual environment, install FastAPI, Streamlit, LangChain, sentence-transformers, and pandas.',
        assignee: 'Arshad Pasha',
        priority: 'high',
        milestone: 'Milestone 1',
        due_date: '2026-01-10',
        status: 'in-progress'
    },
    {
        title: 'Clone GitHub Repository (Step-by-Step Guide)',
        description: 'BEGINNER GUIDE:\n1. Open your browser and go to: https://git-scm.com/downloads\n2. Download and install "Git" for Windows.\n3. Open "VS Code" (Visual Studio Code).\n4. In VS Code, look at the top menu, click "Terminal" > "New Terminal".\n5. A black box will appear at the bottom. Click inside it.\n6. Type this exact command: git clone https://github.com/springboardmentor441p-coderr/Fintech-data\n7. Press the "Enter" key on your keyboard.\n8. Wait for 100% done.\n9. Go to "File" > "Open Folder" and select the "Fintech-data" folder you just downloaded.',
        assignee: 'Depuru Joshika Reddy',
        priority: 'high',
        milestone: 'Milestone 1',
        due_date: '2026-01-07',
        status: 'pending'
    },
    {
        title: 'Explore Markdown Documents (Reading Task)',
        description: 'BEGINNER GUIDE:\n1. Open your browser.\n2. Go to this link: https://github.com/springboardmentor441p-coderr/Fintech-data\n3. Scroll down the file list. Look for files ending with ".md" (Example: README.md, DATA.md).\n4. Click on the file name to open it.\n5. Read the content carefully to understand what the project is about.\n6. Open a Notepad on your computer.\n7. Write down 3 key points you understood from the files.\n8. Send these points to the group chat.',
        assignee: 'Guru Karthik Reddy Marthala',
        priority: 'medium',
        milestone: 'Milestone 1',
        due_date: '2026-01-08',
        status: 'pending'
    },
    {
        title: 'Explore CSV Documents',
        description: 'Explore all CSV files and understand the data format and columns.',
        assignee: 'Kavya Ghantasala',
        priority: 'medium',
        milestone: 'Milestone 1',
        due_date: '2026-01-08',
        status: 'pending'
    },
    {
        title: 'Create Role-to-Document Mapping',
        description: 'Create documentation mapping: Finance → financial reports; Marketing → marketing reports; HR → employee data; Engineering → tech docs; C-Level → all docs.',
        assignee: 'Kushagra Bhargava',
        priority: 'high',
        milestone: 'Milestone 1',
        due_date: '2026-01-10',
        status: 'pending'
    },
    {
        title: 'Create Project Folder Structure',
        description: 'Initialize project folder structure on local system with proper organization.',
        assignee: 'Mandha Shirisha',
        priority: 'medium',
        milestone: 'Milestone 1',
        due_date: '2026-01-07',
        status: 'pending'
    },
    {
        title: 'Create requirements.txt',
        description: 'Document all Python dependencies in requirements.txt file for team members.',
        assignee: 'Sri Saranya Chandrapati',
        priority: 'medium',
        milestone: 'Milestone 1',
        due_date: '2026-01-08',
        status: 'pending'
    },
    {
        title: 'Write Data Exploration Report',
        description: 'Write a summary report documenting the content and structure of all documents explored.',
        assignee: 'Vinuthna Jangam',
        priority: 'low',
        milestone: 'Milestone 1',
        due_date: '2026-01-12',
        status: 'pending'
    }
];

// State
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

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    fetchTasks();
    setupEventListeners();
    setupNavigation();
});

// Navigation setup
function setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }
}

// --- SUPABASE OPERATIONS ---

// 1. Fetch Tasks (Read)
async function fetchTasks() {
    tasksContainer.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">Loading tasks...</div>';

    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        tasks = data || [];

        // Check if DB is empty, offer to seed
        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state" id="emptyState">
                    <div class="empty-icon">📂</div>
                    <h3>Database is Empty</h3>
                    <p>No tasks found. Would you like to load the default Week 1 tasks?</p>
                    <button onclick="seedDatabase()" class="btn btn-primary" style="margin-top: 1rem;">
                        Load Default Tasks
                    </button>
                    <p style="margin-top:2rem; color:var(--text-muted); font-size:0.8rem">Or verify your Supabase connection keys.</p>
                </div>`;
            updateStats(); // updates to 0
            return;
        }

        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        // Fallback or error message if keys aren't set
        if (SUPABASE_URL.includes('YOUR_SUPABASE')) {
            tasksContainer.innerHTML = `
                <div style="text-align: center; color: var(--warning); padding: 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--warning);">
                    <h3>⚠️ Configuration Required</h3>
                    <p>Please connect Supabase by adding your <strong>URL</strong> and <strong>KEY</strong> in <code>tasks.js</code>.</p>
                </div>`;
        } else {
            tasksContainer.innerHTML = `<div style="text-align: center; color: var(--warning);">Error loading tasks: ${error.message}</div>`;
        }
    }
}

// 2. Seed Database
async function seedDatabase() {
    if (!confirm('This will add 8 default tasks to your database. Continue?')) return;

    tasksContainer.innerHTML = '<div style="text-align: center; color: var(--text-secondary);">Seeding database...</div>';

    try {
        const { data, error } = await supabase
            .from('tasks')
            .insert(defaultTasks)
            .select();

        if (error) throw error;

        alert('Success! Default tasks loaded.');
        fetchTasks(); // Reload
    } catch (error) {
        console.error('Error seeding:', error);
        alert('Seeding failed: ' + error.message);
        fetchTasks();
    }
}

// Global scope for HTML access
window.seedDatabase = seedDatabase;

// 2. Add Task (Create)
async function createTask(taskData) {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .insert([taskData])
            .select();

        if (error) throw error;

        // Add to local state (optimistic update or re-fetch)
        if (data) {
            tasks.unshift(data[0]);
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task: ' + error.message);
    }
}

// 3. Update Task (Update)
async function updateTask(id, updates) {
    try {
        const { error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        // Update local state
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task: ' + error.message);
    }
}

// 4. Delete Task (Delete)
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Update local state
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task: ' + error.message);
    }
}

// ---------------------------

// Setup event listeners
function setupEventListeners() {
    // Add task button
    addTaskBtn.addEventListener('click', () => openModal());

    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal on overlay click
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) closeModal();
    });

    // Form submit
    taskForm.addEventListener('submit', handleFormSubmit);

    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderTasks();
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'n' && e.ctrlKey) {
            e.preventDefault();
            openModal();
        }
    });
}

// Open modal
function openModal(task = null) {
    taskModal.classList.add('active');

    if (task) {
        // Edit mode
        editingTaskId = task.id;
        modalTitle.textContent = 'Edit Task';
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('assignee').value = task.assignee;
        document.getElementById('priority').value = task.priority;
        document.getElementById('milestone').value = task.milestone;
        document.getElementById('dueDate').value = task.due_date || ''; // Note: due_date
        document.getElementById('status').value = task.status;
    } else {
        // Add mode
        editingTaskId = null;
        modalTitle.textContent = 'Add New Task';
        taskForm.reset();
    }
}

// Close modal
function closeModal() {
    taskModal.classList.remove('active');
    taskForm.reset();
    editingTaskId = null;
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();

    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        assignee: document.getElementById('assignee').value,
        priority: document.getElementById('priority').value,
        milestone: document.getElementById('milestone').value,
        due_date: document.getElementById('dueDate').value, // match DB column due_date
        status: document.getElementById('status').value
        // created_at is handled by DB default
    };

    if (editingTaskId) {
        updateTask(editingTaskId, taskData);
    } else {
        createTask(taskData);
    }

    closeModal();
}

// Toggle task status
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        updateTask(id, { status: newStatus });
    }
}

// Edit task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        openModal(task);
    }
}

// Render tasks
function renderTasks() {
    let filteredTasks = tasks;

    if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(t => t.status === currentFilter);
    }

    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    tasksContainer.innerHTML = filteredTasks.map(task => `
        <div class="task-card ${task.status === 'completed' ? 'completed-task' : ''}" data-id="${task.id}">
            <div class="task-header">
                <div class="task-title-section">
                    <h3 class="task-title">
                        ${getStatusIcon(task.status)} ${task.title}
                    </h3>
                    <span class="task-milestone">${task.milestone || 'No Milestone'}</span>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn complete" onclick="toggleComplete(${task.id})" title="${task.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete'}">
                        ${task.status === 'completed' ? '↩️' : '✓'}
                    </button>
                    <button class="task-action-btn edit" onclick="editTask(${task.id})" title="Edit Task">✏️</button>
                    <button class="task-action-btn delete" onclick="deleteTask(${task.id})" title="Delete Task">🗑️</button>
                </div>
            </div>
            ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
            <div class="task-meta">
                <div class="task-meta-item">
                    <span>👤</span>
                    <strong>${task.assignee}</strong>
                </div>
                ${task.due_date ? `
                    <div class="task-meta-item">
                        <span>📅</span>
                        <strong>${formatDate(task.due_date)}</strong>
                    </div>
                ` : ''}
                <span class="priority-badge ${task.priority}">${task.priority}</span>
                <span class="status-badge-task ${task.status}">${formatStatus(task.status)}</span>
            </div>
        </div>
    `).join('');
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Get status icon
function getStatusIcon(status) {
    switch (status) {
        case 'completed': return '✅';
        case 'in-progress': return '🔄';
        default: return '⏳';
    }
}

// Format status
function formatStatus(status) {
    if (!status) return 'Unknown';
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Format date
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Update stats
function updateStats() {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('inProgressTasks').textContent = inProgress;
    document.getElementById('completedTasks').textContent = completed;
}

// Export functions to window for HTML onclick handlers
window.deleteTask = deleteTask;
window.editTask = editTask;
window.toggleComplete = toggleComplete;

console.log('RBAC Group 3 - Task Manager (Supabase Edition) Loaded! 🚀');
