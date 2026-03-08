// ==================== MVC ARCHITECTURE ====================

// MODEL - Data Management
class TodoModel {
    constructor() {
        this.todos = this.loadFromStorage();
    }

    // CREATE
    addTodo(todoData) {
        const todo = {
            id: Date.now(),
            title: todoData.title,
            description: todoData.description,
            category: todoData.category,
            priority: todoData.priority,
            dueDate: todoData.dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.todos.push(todo);
        this.saveToStorage();
        return todo;
    }

    // READ - Get all todos
    getAllTodos() {
        return this.todos;
    }

    // READ - Get single todo
    getTodoById(id) {
        return this.todos.find(todo => todo.id === id);
    }

    // UPDATE
    updateTodo(id, updatedData) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos[index] = {
                ...this.todos[index],
                ...updatedData
            };
            this.saveToStorage();
            return this.todos[index];
        }
        return null;
    }

    // DELETE
    deleteTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            const deleted = this.todos.splice(index, 1);
            this.saveToStorage();
            return deleted[0];
        }
        return null;
    }

    // DELETE ALL
    deleteAllTodos() {
        this.todos = [];
        this.saveToStorage();
    }

    // Toggle completion status
    toggleTodoCompletion(id) {
        const todo = this.getTodoById(id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            return todo;
        }
        return null;
    }

    // Search todos
    searchTodos(searchTerm) {
        return this.todos.filter(todo =>
            todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Filter todos
    filterTodos(filter) {
        const today = new Date().toDateString();
        switch (filter) {
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            case 'today':
                return this.todos.filter(todo => {
                    if (!todo.dueDate) return false;
                    return new Date(todo.dueDate).toDateString() === today;
                });
            default:
                return this.todos;
        }
    }

    // Filter by category
    filterByCategory(category) {
        if (category === 'all') return this.todos;
        return this.todos.filter(todo => todo.category === category);
    }

    // Sort todos
    sortTodos(sortBy, todos = this.todos) {
        const sorted = [...todos];
        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'priority-high':
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            case 'priority-low':
                const priorityOrderReverse = { low: 1, medium: 2, high: 3 };
                return sorted.sort((a, b) => priorityOrderReverse[a.priority] - priorityOrderReverse[b.priority]);
            case 'due-date':
                return sorted.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
            default:
                return sorted;
        }
    }

    // Get statistics
    getStatistics() {
        return {
            total: this.todos.length,
            completed: this.todos.filter(t => t.completed).length,
            pending: this.todos.filter(t => !t.completed).length,
            percentComplete: this.todos.length === 0 ? 0 : Math.round((this.todos.filter(t => t.completed).length / this.todos.length) * 100)
        };
    }

    // Local Storage
    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('todos');
        return stored ? JSON.parse(stored) : [];
    }
}

// VIEW - User Interface
class TodoView {
    constructor() {
        this.form = document.getElementById('add-todo-form');
        this.todosList = document.getElementById('todos-list');
        this.searchInput = document.getElementById('search-input');
        this.sortSelect = document.getElementById('sort-select');
        this.editModal = document.getElementById('edit-modal');
        this.viewModal = document.getElementById('view-modal');
        this.overlay = document.getElementById('overlay');
        this.toast = document.getElementById('toast');
        this.editForm = document.getElementById('edit-form');
    }

    // Render todos
    renderTodos(todos) {
        if (todos.length === 0) {
            this.todosList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>No tasks found</p>
                    <p style="font-size: 14px;">Create your first task to get started!</p>
                </div>
            `;
            return;
        }

        this.todosList.innerHTML = todos.map(todo => this.createTodoElement(todo)).join('');
    }

    // Create todo element
    createTodoElement(todo) {
        const categoryEmojis = {
            work: '🏢',
            personal: '👤',
            shopping: '🛒',
            health: '❤️'
        };

        const priorityEmojis = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };

        const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No date';

        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                       onchange="controller.toggleTodo(${todo.id})">
                
                <div class="todo-content">
                    <div class="todo-header">
                        <h3 class="todo-title">${this.escapeHtml(todo.title)}</h3>
                        <span class="todo-category">${categoryEmojis[todo.category]} ${todo.category}</span>
                        <span class="todo-priority ${todo.priority}">${priorityEmojis[todo.priority]} ${todo.priority}</span>
                    </div>
                    ${todo.description ? `<p class="todo-description">${this.escapeHtml(todo.description)}</p>` : ''}
                    <div class="todo-footer">
                        <span class="todo-date">📅 ${dueDate}</span>
                    </div>
                </div>

                <div class="todo-actions">
                    <button class="action-btn view-btn" onclick="controller.viewTodo(${todo.id})">👁️ View</button>
                    <button class="action-btn edit-btn" onclick="controller.openEditModal(${todo.id})">✏️ Edit</button>
                    <button class="action-btn delete-btn" onclick="controller.deleteTodo(${todo.id})">🗑️ Delete</button>
                </div>
            </div>
        `;
    }

    // Show toast notification
    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast show ${type}`;

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    // Get form data
    getFormData() {
        return {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            priority: document.getElementById('priority').value,
            dueDate: document.getElementById('due-date').value
        };
    }

    // Clear form
    clearForm() {
        this.form.reset();
    }

    // Update statistics
    updateStats(stats) {
        document.getElementById('total-todos').textContent = stats.total;
        document.getElementById('completed-todos').textContent = stats.completed;
        document.getElementById('pending-todos').textContent = stats.pending;
        document.getElementById('progress-fill').style.width = stats.percentComplete + '%';
        document.getElementById('progress-text').textContent = stats.percentComplete + '% Complete';
    }

    // Show edit modal
    showEditModal(todo) {
        document.getElementById('edit-id').value = todo.id;
        document.getElementById('edit-title').value = todo.title;
        document.getElementById('edit-description').value = todo.description;
        document.getElementById('edit-category').value = todo.category;
        document.getElementById('edit-priority').value = todo.priority;
        document.getElementById('edit-due-date').value = todo.dueDate || '';
        
        this.editModal.classList.add('open');
        this.overlay.classList.add('active');
    }

    // Show view modal
    showViewModal(todo) {
        const categoryEmojis = {
            work: '🏢 Work',
            personal: '👤 Personal',
            shopping: '🛒 Shopping',
            health: '❤️ Health'
        };

        const priorityEmojis = {
            high: '🔴 High',
            medium: '🟡 Medium',
            low: '🟢 Low'
        };

        const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'Not set';
        const createdDate = new Date(todo.createdAt).toLocaleDateString();

        document.getElementById('view-content').innerHTML = `
            <div class="view-field">
                <div class="view-label">Title</div>
                <div class="view-value">${this.escapeHtml(todo.title)}</div>
            </div>
            ${todo.description ? `
                <div class="view-field">
                    <div class="view-label">Description</div>
                    <div class="view-value">${this.escapeHtml(todo.description)}</div>
                </div>
            ` : ''}
            <div class="view-field">
                <div class="view-label">Category</div>
                <div class="view-value">${categoryEmojis[todo.category]}</div>
            </div>
            <div class="view-field">
                <div class="view-label">Priority</div>
                <div class="view-value">${priorityEmojis[todo.priority]}</div>
            </div>
            <div class="view-field">
                <div class="view-label">Due Date</div>
                <div class="view-value">📅 ${dueDate}</div>
            </div>
            <div class="view-field">
                <div class="view-label">Status</div>
                <div class="view-value">${todo.completed ? '✅ Completed' : '⏳ Pending'}</div>
            </div>
            <div class="view-field">
                <div class="view-label">Created Date</div>
                <div class="view-value">📋 ${createdDate}</div>
            </div>
        `;

        this.viewModal.classList.add('open');
        this.overlay.classList.add('active');
    }

    // Escape HTML for security
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// CONTROLLER - Business Logic
class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.currentSort = 'newest';
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Add todo
        this.view.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Search
        this.view.searchInput.addEventListener('input', () => this.render());

        // Sort
        this.view.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.render();
        });

        // Edit form submit
        this.view.editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTodoChanges();
        });
    }

    addTodo() {
        const formData = this.view.getFormData();

        if (!formData.title.trim()) {
            this.view.showToast('Please enter a task title', 'error');
            return;
        }

        this.model.addTodo(formData);
        this.view.showToast('✅ Task added successfully!');
        this.view.clearForm();
        this.render();
    }

    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.model.deleteTodo(id);
            this.view.showToast('🗑️ Task deleted!');
            this.render();
        }
    }

    toggleTodo(id) {
        this.model.toggleTodoCompletion(id);
        this.view.showToast('✅ Task status updated!');
        this.render();
    }

    openEditModal(id) {
        const todo = this.model.getTodoById(id);
        if (todo) {
            this.view.showEditModal(todo);
        }
    }

    saveTodoChanges() {
        const id = parseInt(document.getElementById('edit-id').value);
        const updatedData = {
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-description').value,
            category: document.getElementById('edit-category').value,
            priority: document.getElementById('edit-priority').value,
            dueDate: document.getElementById('edit-due-date').value
        };

        if (!updatedData.title.trim()) {
            this.view.showToast('Please enter a task title', 'error');
            return;
        }

        this.model.updateTodo(id, updatedData);
        this.view.showToast('💾 Task updated successfully!');
        closeEditModal();
        this.render();
    }

    viewTodo(id) {
        const todo = this.model.getTodoById(id);
        if (todo) {
            this.view.showViewModal(todo);
        }
    }

    render() {
        let todos = this.model.getAllTodos();

        // Search
        const searchTerm = this.view.searchInput.value;
        if (searchTerm) {
            todos = this.model.searchTodos(searchTerm);
        }

        // Filter
        if (this.currentFilter !== 'all') {
            todos = this.model.filterTodos(this.currentFilter);
        }

        // Category filter
        if (this.currentCategory !== 'all') {
            todos = this.model.filterByCategory(this.currentCategory);
        }

        // Sort
        todos = this.model.sortTodos(this.currentSort, todos);

        // Render
        this.view.renderTodos(todos);
        this.view.updateStats(this.model.getStatistics());
    }
}

// ==================== GLOBAL FUNCTIONS ====================

// Initialize app
const model = new TodoModel();
const view = new TodoView();
const controller = new TodoController(model, view);

// Filter functions
function filterTodos(filter) {
    controller.currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    controller.render();
}

function filterByCategory(category) {
    controller.currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    controller.render();
}

// Modal functions
function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

function closeViewModal() {
    document.getElementById('view-modal').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

function closeAllModals() {
    closeEditModal();
    closeViewModal();
}

// Clear all todos
function clearAllTodos() {
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
        model.deleteAllTodos();
        view.showToast('🗑️ All tasks cleared!');
        controller.render();
    }
}