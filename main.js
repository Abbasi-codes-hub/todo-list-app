// DOM Elements
let time = document.querySelector(".time");
let date = document.querySelector(".date-display");
let taskInput = document.querySelector("#taskInput");
let addBtn = document.querySelector(".add-btn");
let taskContainer = document.querySelector(".tasks-list");

// Get todo data from localStorage
const getTodoDataFromLocal = () => {
    let localData = localStorage.getItem("todoTasks");
    return localData ? JSON.parse(localData) : [];
}

// Global task array (loaded from localStorage)
let tasks = getTodoDataFromLocal();

// Render single task to UI
const renderData = (taskObj) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.setAttribute("data-id", taskObj.id); // store ID

    // Task content
    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    const checkboxWrapper = document.createElement("div");
    checkboxWrapper.className = "checkbox-wrapper";

    const checkIcon = document.createElement("i");
    checkIcon.className = "fa-solid fa-check-double";
    checkIcon.title = "completed";
    checkboxWrapper.appendChild(checkIcon);

    const taskTextElem = document.createElement("p");
    taskTextElem.textContent = taskObj.text;
    taskTextElem.className = "tasktext";

    taskContent.appendChild(checkboxWrapper);
    taskContent.appendChild(taskTextElem);

    // Task actions
    const taskActions = document.createElement("div");
    taskActions.className = "task-actions";

    const prioritySpan = document.createElement("span");
    prioritySpan.className = "priority high";
    prioritySpan.textContent = "High";

    const editBtn = document.createElement("button");
    editBtn.className = "action-btn edit";
    const editIcon = document.createElement("i");
    editIcon.className = "fas fa-pen";
    editIcon.title = "edit";
    editBtn.appendChild(editIcon);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "action-btn delete";
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash-alt";
    deleteIcon.title = "delete";
    deleteBtn.appendChild(deleteIcon);

    taskActions.appendChild(prioritySpan);
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    li.appendChild(taskContent);
    li.appendChild(taskActions);
    taskContainer.appendChild(li);
}

// Save to localStorage
const addTodoDataToLocaStorage = (data) => {
    return localStorage.setItem("todoTasks", JSON.stringify(data));
}

// Render task when user adds
const renderTask = () => {
    let inputData = taskInput.value.trim();

    if (inputData !== "" && !tasks.some(t => t.text === inputData)) {
        let newTask = {
            id: Date.now().toString(),  // unique ID
            text: inputData
        };
        tasks.push(newTask);
        renderData(newTask);
        addTodoDataToLocaStorage(tasks);
    }

    taskInput.value = "";
}

// Show all tasks from localStorage
const TodoLists = () => {
    tasks.forEach((elem) => {
        renderData(elem);
    });
}
TodoLists()

// Add button listener
addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    renderTask();
});

// Enter key to add
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        renderTask();
    }
});

// Time and date
setInterval(() => {
    let timeLine = new Date().toLocaleTimeString();
    time.textContent = timeLine;
    date.textContent = new Date().toLocaleDateString();
}, 1000);

// Delete and Edit functionality
taskContainer.addEventListener("click", (e) => {
    let targetElem = e.target;

    // Delete functionality
    if (
        targetElem.classList.contains("delete") ||
        targetElem.closest(".delete")
    ) {
        let closestTask = targetElem.closest(".task-item");
        let taskId = closestTask.getAttribute("data-id");

        // Remove from DOM
        closestTask.remove();

        // Remove from array
        tasks = tasks.filter((task) => task.id !== taskId);

        // Update localStorage
        addTodoDataToLocaStorage(tasks);
    }

    // Edit functionality 
    if (
        targetElem.classList.contains("edit") ||
        targetElem.closest(".edit")
    ) {
        let closestTask = targetElem.closest(".task-item");
        let taskId = closestTask.getAttribute("data-id");
        let taskTextElem = closestTask.querySelector(".tasktext");
        let currentText = taskTextElem.textContent;

        // Create input field
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = currentText;
        inputField.className = "edit-input";
        inputField.placeholder = "Edit your task...";

        // Add modern attributes
        inputField.setAttribute("autocomplete", "off");
        inputField.setAttribute("spellcheck", "false");

        // Store reference to the parent element
        const parentElement = taskTextElem.parentNode;
        console.log(parentElement);
        
        // Replace text with input field
        parentElement.replaceChild(inputField, taskTextElem);
        inputField.focus();

        // Function to save edits
        const saveEdit = () => {
            const newText = inputField.value.trim();
            if (newText && newText !== currentText) {
                // Update the text content
                taskTextElem.textContent = newText;

                location.reload()

                // Update in array
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    tasks[taskIndex].text = newText;
                    addTodoDataToLocaStorage(tasks);
                }
            } else {
                // If empty or same text, revert
                parentElement.replaceChild(taskTextElem, inputField);
            }

            // Remove event listeners to prevent memory leaks
            inputField.removeEventListener("keydown", handleKeyDown);
            inputField.removeEventListener("blur", saveEdit);
        };

        // Handle Enter key separately
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                saveEdit();
            }
        };

        // Add event listeners
        inputField.addEventListener("keydown", handleKeyDown);
        inputField.addEventListener("blur", saveEdit);
    }
});