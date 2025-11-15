// Our list of tasks
let todos = [];

// Which filter is currently selected
let currentFilter = 'all';

// Get elements from the page
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const activeCountEl = document.getElementById('activeCount');
const completedCountEl = document.getElementById('completedCount');
const filterButtons = document.querySelectorAll('.btn-filter');

// When the page loads, get saved tasks from browser storage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
        renderTodos();
        updateStats();
    }
}

// Save tasks to browser storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Add a new task to the list
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text) {
        const newTodo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: Date.now()
        };
        
        todos.unshift(newTodo); // Add to beginning of array
        todoInput.value = ''; // Clear input
        
        saveTodos();
        renderTodos();
        updateStats();
        showToast('Task added successfully!');
    }
}

// Mark a task as done or not done
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    saveTodos();
    renderTodos();
    updateStats();
}

// Remove a task from the list
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    
    saveTodos();
    renderTodos();
    updateStats();
    showToast('Task deleted!');
}

// Show tasks based on selected filter
function getFilteredTodos() {
    if (currentFilter === 'active') {
        return todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        return todos.filter(todo => todo.completed);
    }
    return todos; // 'all' shows everything
}

// Update the stats badges
function updateStats() {
    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;
    
    activeCountEl.textContent = activeCount;
    completedCountEl.textContent = completedCount;
}

// Render all todos on the page
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    // Clear the list
    todoList.innerHTML = '';
    
    if (filteredTodos.length === 0) {
        // Show empty state message
        emptyState.style.display = 'block';
        const emptyText = emptyState.querySelector('.empty-text');
        
        if (currentFilter === 'completed') {
            emptyText.textContent = 'No completed tasks yet. Keep going!';
        } else if (currentFilter === 'active') {
            emptyText.textContent = 'No active tasks. Time to add some!';
        } else {
            emptyText.textContent = 'Your list is empty. Add a task to get started!';
        }
    } else {
        emptyState.style.display = 'none';
        
        // Create and add each todo item
        filteredTodos.forEach((todo, index) => {
            const todoItem = createTodoElement(todo, index);
            todoList.appendChild(todoItem);
        });
    }
}

// Create a single todo element
function createTodoElement(todo, index) {
    const div = document.createElement('div');
    div.className = 'card todo-item';
    div.style.animationDelay = `${index * 50}ms`;
    
    div.innerHTML = `
        <div class="todo-content">
            <input 
                type="checkbox" 
                class="checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo('${todo.id}')"
            >
            <span class="todo-text ${todo.completed ? 'completed' : ''}">
                ${todo.text}
            </span>
            <button class="btn-delete" onclick="deleteTodo('${todo.id}')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `;
    
    return div;
}

// Show a toast notification
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// Set up event listeners
addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update current filter
        currentFilter = button.dataset.filter;
        
        // Re-render todos
        renderTodos();
    });
});

// Load todos when page loads
loadTodos();
