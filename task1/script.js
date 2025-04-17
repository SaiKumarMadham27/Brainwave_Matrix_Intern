document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("task-form");
    const taskTable = document.getElementById("task-table").getElementsByTagName('tbody')[0];

    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get values from form inputs
        const time = document.getElementById("time").value;
        const task = document.getElementById("task").value;
        const priority = document.getElementById("priority").value;

        if (task.trim() !== "" && priority !== "Select priority") {
            // Create a task object with priority
            const newTask = {
                time: time,
                task: task,
                priority: priority
            };

            // Save task to localStorage
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.push(newTask);
            localStorage.setItem("tasks", JSON.stringify(tasks));

            // Display the new task in the table
            displayTasks();
        }

        // Clear the form
        taskForm.reset();
    });

    function convertTo24Hour(time) {
        const [hour, minutePeriod] = time.split(':');
        const [minute, period] = minutePeriod.split(' ');

        let hour24 = parseInt(hour, 10);

        if (period === 'AM') {
            if (hour24 === 12) {
                hour24 = 0;
            }
        } else {
            if (hour24 !== 12) {
                hour24 += 12;
            }
        }

        return `${hour24.toString().padStart(2, '0')}:${minute}`;
    }

    // Function to display all tasks from localStorage
    function displayTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        // Clear the table
        taskTable.innerHTML = "";

        // Add each task to the table
        tasks.forEach((task, index) => {
            const row = taskTable.insertRow();

            // Set the background color based on priority
            let priorityColor = "";
            switch (task.priority) {
                case "High":
                    priorityColor = "#ff000069";
                    break;
                case "Medium":
                    priorityColor = "#ffa60081";
                    break;
                case "Low":
                    priorityColor = "#ffff0057";
                    break;
                default:
                    priorityColor = "white";
            }

            // Apply the priority color to the row
            row.style.backgroundColor = priorityColor;

            // Create cells for time, task, and actions
            const timeCell = row.insertCell(0);
            timeCell.textContent = task.time;

            const taskCell = row.insertCell(1);
            taskCell.textContent = task.task;

            const prioritycell = row.insertCell(2);
            prioritycell.textContent = task.priority;

            const actionCell = row.insertCell(3);
            actionCell.innerHTML = `
                <button class="edit">Edit</button>
                <button class="delete">Completed</button>
            `;

            // Add event listeners for edit and delete buttons
            const editButton = actionCell.querySelector(".edit");
            const deleteButton = actionCell.querySelector(".delete");

            editButton.addEventListener("click", function () {
                editTask(index);
            });

            deleteButton.addEventListener("click", function () {
                deleteTask(index);
            });
        });
    }

    // Function to edit a task
    function editTask(index) {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        const taskToEdit = tasks[index];

        // Fill the form with the task's data
        document.getElementById("time").value = taskToEdit.time;
        document.getElementById("task").value = taskToEdit.task;
        document.getElementById("priority").value = taskToEdit.priority;

        // Remove the task from the list after editing
        deleteTask(index);
    }

    // Function to delete a task
    function deleteTask(index) {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks.splice(index, 1);

        // Save the updated task list back to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Update the task table
        displayTasks();
    }

    // Sorting function for Time
    function sortByTime() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks.sort((a, b) => {
            const timeA = convertTo24Hour(a.time);
            const timeB = convertTo24Hour(b.time);
            return timeA.localeCompare(timeB); // Ascending order
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        timeHeader.innerHTML = "Time";
        priorityHeader.innerHTML = "Priority ▲▼";
        displayTasks();
    }

    let prioritySortedAscending = true; // Toggle for sorting direction

function sortByPriority() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    
    // Sort by priority based on ascending or descending order
    tasks.sort((a, b) => {
        const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
        return prioritySortedAscending
            ? priorityOrder[a.priority] - priorityOrder[b.priority]  // Ascending order
            : priorityOrder[b.priority] - priorityOrder[a.priority]; // Descending order
    });
localStorage.setItem("tasks", JSON.stringify(tasks));
    // Update the tasks table
    displayTasks();
     if (prioritySortedAscending) {
        priorityHeader.innerHTML = "Priority ▲";
        timeHeader.innerHTML="Time ▼";
    } else {
        priorityHeader.innerHTML = "Priority ▼";
        timeHeader.innerHTML="Time ▼";
    }

    // Toggle the sorting direction for next click
    prioritySortedAscending = !prioritySortedAscending;
}


    // Add event listeners for column headers
    const timeHeader = document.getElementById("time-header");
    const priorityHeader = document.getElementById("priority-header");

    timeHeader.addEventListener("click", sortByTime);
    priorityHeader.addEventListener("click", sortByPriority);

    // Display tasks when the page loads
    displayTasks();
});
