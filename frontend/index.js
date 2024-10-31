import { backend } from 'declarations/backend';

// State management
const state = {
    currentView: 'home',
    currentProfile: null,
    employees: []
};

// View management
function showView(viewName) {
    document.querySelectorAll('.home-content, .profile-content, .directory-content')
        .forEach(el => el.classList.remove('active'));
    
    document.querySelector(`.${viewName}-content`).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    state.currentView = viewName;
}

// Initialize navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        showView(view);
        
        if (view === 'directory') {
            renderPeopleGrid();
        }
    });
});

// Render people grid
async function renderPeopleGrid() {
    const grid = document.querySelector('.people-grid');
    grid.innerHTML = '<div class="loading">Loading...</div>';

    try {
        state.employees = await backend.getAllEmployees();
        grid.innerHTML = state.employees.map(employee => `
            <div class="person-card" data-id="${employee.id}">
                <div class="person-header">
                    <div class="person-avatar">${employee.firstName[0]}${employee.lastName[0]}</div>
                    <div class="person-info">
                        <div class="person-name">${employee.firstName} ${employee.lastName}</div>
                        <div class="person-title">${employee.title}</div>
                    </div>
                </div>
                <div style="color: var(--text-secondary); font-size: 0.875rem">
                    <div>${employee.department}</div>
                    <div>Employee #${employee.employeeId}</div>
                    <div>${employee.email}</div>
                </div>
            </div>
        `).join('');

        // Add click handlers to cards
        document.querySelectorAll('.person-card').forEach(card => {
            card.addEventListener('click', () => {
                const employeeId = card.getAttribute('data-id');
                showEmployeeProfile(employeeId);
            });
        });
    } catch (error) {
        grid.innerHTML = `<div>Error loading employees: ${error.message}</div>`;
    }
}

// Show employee profile
async function showEmployeeProfile(employeeId) {
    try {
        const employee = await backend.getEmployee(employeeId);
        if (!employee) return;

        state.currentProfile = employeeId;
        
        // Populate all form fields
        Object.keys(employee).forEach(key => {
            const input = document.querySelector(`[data-field="${key}"]`);
            if (input) input.value = employee[key];
        });

        showView('profile');
    } catch (error) {
        showToast(`Error loading profile: ${error.message}`);
    }
}

// Handle form changes
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('change', async (e) => {
        if (!state.currentProfile) return;

        const field = e.target.getAttribute('data-field');
        const value = e.target.value;

        try {
            await backend.updateEmployee(state.currentProfile, { [field]: value });
            showToast('Changes saved successfully');
        } catch (error) {
            showToast(`Error saving changes: ${error.message}`);
        }
    });
});

// Search functionality
const searchBar = document.querySelector('.search-bar');
searchBar.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    try {
        const searchResults = await backend.searchEmployees(searchTerm);
        const grid = document.querySelector('.people-grid');
        grid.innerHTML = searchResults.map(employee => `
            <div class="person-card" data-id="${employee.id}">
                <div class="person-header">
                    <div class="person-avatar">${employee.firstName[0]}${employee.lastName[0]}</div>
                    <div class="person-info">
                        <div class="person-name">${employee.firstName} ${employee.lastName}</div>
                        <div class="person-title">${employee.title}</div>
                    </div>
                </div>
                <div style="color: var(--text-secondary); font-size: 0.875rem">
                    <div>${employee.department}</div>
                    <div>Employee #${employee.employeeId}</div>
                    <div>${employee.email}</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showToast(`Error searching employees: ${error.message}`);
    }
});

// Profile tabs
document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        document.querySelectorAll('.profile-tab').forEach(t => 
            t.classList.remove('active'));
        tab.classList.add('active');

        // Show corresponding section
        const section = tab.getAttribute('data-section');
        document.querySelectorAll('.section').forEach(s => 
            s.style.display = s.getAttribute('data-section') === section ? 'block' : 'none');
    });
});

// Back button
document.querySelector('.back-button').addEventListener('click', () => {
    showView(state.currentView === 'profile' ? 'directory' : 'home');
});

// Quick actions
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const action = button.getAttribute('data-action');
        switch(action) {
            case 'view-profile':
                showEmployeeProfile(state.currentUser?.id || '12345');
                break;
            case 'time-off':
                showToast('Time off request feature coming soon');
                break;
            case 'view-team':
                showView('directory');
                break;
        }
    });
});

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize the application
async function init() {
    try {
        const currentUser = await backend.getCurrentUser();
        document.getElementById('welcome-name').textContent = currentUser.firstName;
        state.currentUser = currentUser;
    } catch (error) {
        showToast(`Error loading current user: ${error.message}`);
    }
    showView('home');
    renderPeopleGrid();
}

// Start the app
init();
