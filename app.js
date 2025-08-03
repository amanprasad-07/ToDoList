let enterTask = document.getElementById("enterTask");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

function createTaskItem(taskText, isCompleted = false) {
    let newListItem = document.createElement("li");

    //  Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted;
    checkbox.style.marginRight = "10px";

    //  Create task text span
    const taskSpan = document.createElement("span");
    taskSpan.innerText = taskText;
    if (isCompleted) {
        taskSpan.classList.add("completed");
    }

    //  Mark task as complete on checkbox change
    checkbox.addEventListener("change", function () {
        taskSpan.classList.toggle("completed");
        saveTasks();
    });

    // 🗑 Remove button
     const removeButton = document.createElement("button");
    removeButton.innerHTML = `<i class="fas fa-trash-alt" style="color: #362b2b;"></i>`;
    removeButton.style.marginLeft = "10px";
    removeButton.style.background = "none";
    removeButton.style.border = "none";
    removeButton.style.cursor = "pointer";
    removeButton.title = "Remove Task";

    removeButton.addEventListener("click", function () {
        newListItem.remove();
        saveTasks();
    });

    //  Append everything
    newListItem.appendChild(checkbox);
    newListItem.appendChild(taskSpan);
    newListItem.appendChild(removeButton);
    taskList.appendChild(newListItem);
}

function saveTasks() {
    const allTasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const span = li.querySelector("span");
        allTasks.push({
            text: span.innerText,
            completed: checkbox.checked
        });
    });
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function taskAdder(event) {
    event.preventDefault();
    const task = enterTask.value.trim();
    if (task !== "") {
        createTaskItem(task);
        saveTasks();
        enterTask.value = "";
    } else {
        alert("Please enter a task.");
    }
}

addTask.addEventListener("click", taskAdder);

enterTask.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        taskAdder(event);
    }
});


//  Filter dropdown
document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        const filter = e.target.getAttribute("data-filter");
        filterTasks(filter);
    });
});

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

//  Load tasks on page load
window.addEventListener("load", () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        createTaskItem(task.text, task.completed);
    });
});
