let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    let text = document.getElementById("taskInput").value;
    let deadline = document.getElementById("deadlineInput").value;

    if (text.trim() === "") {
        alert("Enter task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        deadline,
        status: "todo"
    });

    saveTasks();
    renderTasks();

    document.getElementById("taskInput").value = "";
    document.getElementById("deadlineInput").value = "";
    
}

function renderTasks() {
    const todo = document.getElementById("todo");
    const inprogress = document.getElementById("inprogress");
    const done = document.getElementById("done");

    todo.innerHTML = "";
    inprogress.innerHTML = "";
    done.innerHTML = "";

    tasks.forEach(task => {
        let div = document.createElement("div");
        div.className = "task";
        div.draggable = true;
        div.dataset.id = task.id;

        div.innerHTML = `
            <p><strong>${task.text}</strong></p>
            <small>${task.deadline || ""}</small><br>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;

        // Drag start
        div.addEventListener("dragstart", () => {
            div.classList.add("dragging");
        });

        // Drag end
        div.addEventListener("dragend", () => {
            div.classList.remove("dragging");
        });

        if (task.status === "todo") {
            todo.appendChild(div);
        } else if (task.status === "inprogress") {
            inprogress.appendChild(div);
        } else {
            done.appendChild(div);
        }
    });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Drag & Drop Logic
const columns = document.querySelectorAll(".column div");

columns.forEach(column => {

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", () => {
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const taskId = Number(dragging.dataset.id);
        const status = column.id;

        tasks = tasks.map(task =>
            task.id === taskId ? { ...task, status } : task
        );

        saveTasks();
        renderTasks();
    });

});

renderTasks();