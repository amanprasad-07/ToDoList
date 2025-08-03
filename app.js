// Get references to DOM elements
let enterTask = document.getElementById("enterTask");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

/**
 * Creates a new task list item in the DOM
 * @param {string} taskText - The text content of the task
 * @param {boolean} isCompleted - Whether the task is marked as completed
 */
function createTaskItem(taskText, isCompleted = false) {
    let newListItem = document.createElement("li");

    // Create the checkbox to mark task as complete/incomplete
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted;
    checkbox.style.marginRight = "10px";

    // Create the span element that holds the task text
    const taskSpan = document.createElement("span");
    taskSpan.innerText = taskText;

    // Apply completed class if the task is marked as done
    if (isCompleted) {
        taskSpan.classList.add("completed");
    }

    // Toggle completion status when checkbox is changed
    checkbox.addEventListener("change", function () {
        taskSpan.classList.toggle("completed");
        saveTasks(); // Update localStorage
    });

    // Create the delete (trash) button
    const removeButton = document.createElement("button");
    removeButton.innerHTML = `<i class="fas fa-trash-alt" style="color: #362b2b;"></i>`;
    removeButton.style.marginLeft = "10px";
    removeButton.style.background = "none";
    removeButton.style.border = "none";
    removeButton.style.cursor = "pointer";
    removeButton.title = "Remove Task";

    // Remove the task item on click
    removeButton.addEventListener("click", function () {
        newListItem.remove();
        saveTasks(); // Update localStorage
    });

    // Append all components to the task list item
    newListItem.appendChild(checkbox);
    newListItem.appendChild(taskSpan);
    newListItem.appendChild(removeButton);

    // Add the task item to the task list in the DOM
    taskList.appendChild(newListItem);
}

/**
 * Saves all current tasks to localStorage
 */
function saveTasks() {
    const allTasks = [];

    // Collect task data from each list item
    document.querySelectorAll("#taskList li").forEach(li => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const span = li.querySelector("span");

        allTasks.push({
            text: span.innerText,
            completed: checkbox.checked
        });
    });

    // Store task array as JSON in localStorage
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

/**
 * Handles adding a new task when user submits
 * @param {Event} event - The click or keypress event
 */
function taskAdder(event) {
    event.preventDefault(); // Prevent form submission default behavior

    const task = enterTask.value.trim();

    if (task !== "") {
        createTaskItem(task);  // Add new task to list
        saveTasks();           // Save updated task list to localStorage
        enterTask.value = "";  // Clear input field
    } else {
        alert("Please enter a task.");  // User feedback for empty input
    }
}

// Add new task on button click
addTask.addEventListener("click", taskAdder);

// Add new task on pressing Enter key inside the input field
enterTask.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        taskAdder(event);
    }
});

// Filter logic: All, Active, Completed
document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent link navigation
        const filter = e.target.getAttribute("data-filter"); // Get selected filter
        filterTasks(filter); // Apply filter
    });
});

/**
 * Filters the tasks shown based on status
 * @param {string} filter - 'all', 'active', or 'completed'
 */
function filterTasks(filter) {
    const allTasks = document.querySelectorAll("#taskList li");

    allTasks.forEach(li => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const isCompleted = checkbox.checked;

        if (filter === "all") {
            li.style.display = "flex";
        } else if (filter === "active") {
            li.style.display = !isCompleted ? "flex" : "none";
        } else if (filter === "completed") {
            li.style.display = isCompleted ? "flex" : "none";
        }
    });
}

// Load saved tasks from localStorage when page loads
window.addEventListener("load", () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Re-create each saved task in the DOM
    savedTasks.forEach(task => {
        createTaskItem(task.text, task.completed);
    });
});
