document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("taskList");
    const newTaskInput = document.getElementById("newTask");
    const taskDeadlineInput = document.getElementById("taskDeadline");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const searchInput = document.getElementById("search");

    function validateTask(task, deadline) {
        const now = new Date();
        const futureDate = deadline ? new Date(deadline) : null;
        return task.length >= 3 && task.length <= 255 && (!futureDate || futureDate > now);
    }

    function addTask(taskText, deadline) {
        if (!validateTask(taskText, deadline)) {
            alert("Zadanie musi mieć od 3 do 255 znaków, a data powinna być w przyszłości lub pusta.");
            return;
        }
    
        const li = document.createElement("li");
        li.dataset.deadline = deadline || null;
        updateTaskDisplay(li, taskText, deadline);

        li.addEventListener("click", (event) => {
            event.stopPropagation();
            editTask(li, taskText, deadline);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Usuń";
        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            removeTask(li);
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
        saveTasks();
    }

    function updateTaskDisplay(li, taskText, deadline) {
        let taskContent = li.querySelector(".task-content");
        if (!taskContent) {
            taskContent = document.createElement("span");
            taskContent.classList.add("task-content");
            li.insertBefore(taskContent, li.firstChild);
        }

        taskContent.innerHTML = "";
        taskContent.innerHTML = highlightText(taskText, searchInput.value);

        if (deadline && deadline != "null") {
            taskContent.innerHTML += ` (Termin: ${new Date(deadline).toLocaleDateString()})`;
        }
    }

    function saveTasks() {
        const tasks = Array.from(taskList.querySelectorAll("li")).map((li) => {
            const taskText = li.querySelector(".task-content").textContent.split(" (Termin:")[0];
            const deadline = li.dataset.deadline === "null" ? null : li.dataset.deadline;
            return { text: taskText, deadline };
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            addTask(task.text, task.deadline);
        });
    }

    function removeTask(li) {
        li.remove();
        saveTasks();
    }

    function editTask(li, oldText, oldDeadline) {
        li.innerHTML = "";

        const input = document.createElement("input");
        input.type = "text";
        input.value = oldText.trim();

        const deadlineInput = document.createElement("input");
        deadlineInput.type = "date";
        deadlineInput.value = oldDeadline ? new Date(oldDeadline).toISOString().split("T")[0] : "";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Usuń";
        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            removeTask(li);
        });

        li.appendChild(input);
        li.appendChild(deadlineInput);
        li.appendChild(deleteBtn);

        input.focus();

        function saveOnClickOutside(event) {
            if (!li.contains(event.target)) {
                const newText = input.value.trim();
                const newDeadline = deadlineInput.value || null;

                if (validateTask(newText, newDeadline)) {
                    li.innerHTML = "";
                    updateTaskDisplay(li, newText, newDeadline);
                    li.dataset.deadline = newDeadline;
                    li.appendChild(deleteBtn);
                    document.removeEventListener("click", saveOnClickOutside);
                    saveTasks();
                } else {
                    alert("Zadanie musi mieć od 3 do 255 znaków, a data powinna być w przyszłości lub pusta.");
                    input.focus();
                }
            }
        }

        document.addEventListener("click", saveOnClickOutside);
        deadlineInput.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }

    function highlightText(text, search) {
        if (!search || search.length < 2) return text;
        const regex = new RegExp(`(${search})`, "gi");
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.trim();
        
        if (searchValue.length >= 2) {
            taskList.querySelectorAll("li").forEach(li => {
                const taskContent = li.querySelector(".task-content");
                const taskText = taskContent.textContent.split(" (Termin:")[0];
                const isMatch = taskText.toLowerCase().includes(searchValue.toLowerCase());
                
                li.style.display = isMatch ? "" : "none";
                
                if (isMatch) {
                    updateTaskDisplay(li, taskText, li.dataset.deadline);
                }
            });
        } else {
            taskList.querySelectorAll("li").forEach(li => {
                const taskContent = li.querySelector(".task-content");
                const taskText = taskContent.textContent.split(" (Termin:")[0];
                li.style.display = "";
                updateTaskDisplay(li, taskText, li.dataset.deadline);
            });
        }
    });

    addTaskBtn.addEventListener("click", () => {
        const taskText = newTaskInput.value.trim();
        const deadline = taskDeadlineInput.value || null;
        addTask(taskText, deadline);
        newTaskInput.value = "";
        taskDeadlineInput.value = "";
    });

    loadTasks();
});
