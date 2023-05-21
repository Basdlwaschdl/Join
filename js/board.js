let currentDraggedElement;
let editors;
let task_status;
let filteredTasks;
let currentPrioEditTask;
let editContacts = [];

async function initBoard() {
    await getCurrentUser();
    await loadData();
    await loadDataTask();
    renderTasks(tasks);
};

//displays the current date

function getDateOverlay(id) {
    let todayDate = new Date().toISOString().slice(0, 10);
    document.getElementById(id).min = todayDate;
    document.getElementById(id).valueAsDate = new Date();
    date = document.getElementById(id).value;
};

// load data from backend

async function loadData() {
    await getItem('tasks');
    await getItem('categorys')
    await getItem('currentUser_name')
};

// save data to backend

async function saveData(key, array) {
    await setItem(key, JSON.stringify(array));
};

/**
 * renders the saved tasks into the board
 */

function renderTasks(inputArray) {
    deleteTasksOnBoard();
    for (let i = 0; i < inputArray.length; i++) {
        const task = inputArray[i];
        renderSingleTask(task, i);
    }
};

/**
 * render card for single task
 */

function renderSingleTask(task, i) {
    let id = task.task_id;
    let destination = document.getElementById(`${checkTaskStatus(task)}`);//${task['category']}`);
    destination.innerHTML += 
    statusMenuHTML(task, id, i);
};


function renderStatusMenu(id, i) {
    document.getElementById('statusMenu' + id).classList.add('slide-in-right')
    document.getElementById('statusMenu' + id).innerHTML =
    statusButtonsHTML(i, id); 
    highlightedButton(i, id);
}

async function saveStatus(id, i) {
    let task = tasks[i]
    document.getElementById('statusMenu' + id).classList.remove('slide-in-right')
    await saveData('tasks', tasks);
    setTimeout(() => initBoard(task, i), 500);
}


/**
 *  html code for the topic of the task
 */

function htmlTaskTopic(task) {
    return `<div class="task-topic" style="background-color: ${getCategorysColor(task['category'])}">${task['category']}</div>`;
};

/**
 * determines the color category
 */

function getCategorysColor(category) {
    let index = categorys['category'].indexOf(category);
    return categorys['color'][index];
}

function htmlTaskTitle(task) {
    return `<h4>${task['title']}</h4>`;
}

function htmlTaskDescription(task) {
    return `<div class="task-description-board">${task['description']}</div>`;
}


/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns html code for progress in subtasks
 * check first for available subtasks
 * task has property 'done' as array with booleans, if true, subtask is already done
 * filter(Boolean) returns only true values of array
 */
function htmlTaskSubtasks(task) {
    if (task['subtasks'].length == 0) return '<div class="task-subtasks"></div>';
    return `<div class="task-subtasks">
                <div class="task-subtasks-line">
                    <div class="progress" style="width: ${calcProgress(task)}%"></div>
                </div>
                <span>${task['done'].filter(Boolean).length}/${task['subtasks'].length} Done</span>
            </div>`;
};

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns progress of subtasks in %
 */
function calcProgress(task) {
    return task['done'].filter(Boolean).length / task['subtasks'].length * 100;
};

function htmlTaskDivBottom(task) {
    return `<div class="task-bottom">
                ${htmlTaskEditors(task)}
                ${htmlTaskPrio(task)}
            </div>`;
};

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns html code for the editors of the task 
 * 
 * all available editors are loaded from server and are stored global
 * get assigned contact id's from param task
 * get initials and color with contact id from global editors
 * if more than 2 editors, only show number of left over editors
 */

function htmlTaskEditors(task) {
    let htmlCodeTemp = '';
    editors = task['contacts'];
    for (let i = 0; i < editors.length; i++) {
        const editor = editors[i];
        if (editor == null) break; // exit for each loop when no editor is available - prevent error
        if (moreThan2Editors(i)) {
            htmlCodeTemp += htmlTaskLeftOverEditors(editors);
            break;
        }
        htmlCodeTemp += htmlTaskSingleEditor(editor);
    }
    return `<div class="editors">${htmlCodeTemp}</div>`;
};


function htmlTaskSingleEditor(editor) {
    return `<div class="contact-frame" style="background-color: ${editor['color']}">
                ${editor['initials']}
            </div>`;
};


function htmlTaskLeftOverEditors(editors) {
    return `<div class="contact-frame">
                +${editors.length - 2}
            </div>`;
};


function moreThan2Editors(i) {
    return i > 1;
};


function htmlTaskPrio(task) {
    return `<div class="task-prio">
                <img src="assets/img/prio${capitalizeFirstLetter(task['prio'])}.png">
            </div>`;
};


function openTaskDetailView(id) {
    document.getElementById('taskDetailView').classList.add('slide-in-right');
    editContacts.length = 0
    let task = tasks.find((e => e['task_id'] == id));
    renderTaskDetailView(task);
};

/**
 * renders the detail view of the task
 */

function renderTaskDetailView(task) {
    let detailView = document.getElementById('taskDetailView');
    detailView.classList.remove('d-none');
    detailView.innerHTML = htmlTaskDetailView(task);
    renderSubtasks(task);
};


function renderSubtasks(task) {
    for (let i = 0; i < task['subtasks'].length; i++) {
        const subtask = task['subtasks'][i];
        document.getElementById('subTasks').innerHTML += `
    <div>${subtask}</div>`;
    }
};

/**
 * collects data for the Edit Task function
 */

async function editTask(index) {
    edit_active = true;
    let content = document.getElementById('content');
    let icons = document.getElementById('icons');
    content.innerHTML = '';
    content.classList.remove('task-details');
    content.classList.add('edit-task');
    icons.innerHTML = htmlCheckIcon(index);
    content.innerHTML = htmlEditTask(index);
    getDateOverlay('editTaskDueDate');
    renderEditSubtask(index);
    checkSubtaskStatus(index)
    setPrioInEditTask(tasks[index]);
    renderEditorsInitials();
    pushEditorstoContacts();
};

/**
 * highlights the button that the task had as status
 */

function highlightedButton(i, id) {
    if (tasks[i]['status'] == 'todo') document.getElementById('status1' + id).classList.add('highlight-button')
    if (tasks[i]['status'] == 'progress') document.getElementById('status2' + id).classList.add('highlight-button')
    if (tasks[i]['status'] == 'feedback') document.getElementById('status3' + id).classList.add('highlight-button')
    if (tasks[i]['status'] == 'done') document.getElementById('status4' + id).classList.add('highlight-button')
}

/**
 * changes the status of the task
 */

function setEditStatus(i, id, status) {
    if (status == 'todo') tasks[i]['status'] = 'todo';
    if (status == 'progress') tasks[i]['status'] = 'progress';
    if (status == 'feedback') tasks[i]['status'] = 'feedback';
    if (status == 'done') tasks[i]['status'] = 'done';
    removeHighLighted(id);
    highlightedButton(i, id);
};

function removeHighLighted(id) {
    document.getElementById('status1'+id).classList.remove('highlight-button')
    document.getElementById('status2'+id).classList.remove('highlight-button')
    document.getElementById('status3'+id).classList.remove('highlight-button')
    document.getElementById('status4'+id).classList.remove('highlight-button')
};

/**
 * merges the Contacts task and the current user's contacts
 */

function pushEditorstoContacts() {
    let edit_colors = [];
    editors.forEach(element => {
        if (element.mail == current_user) element.name = 'You';
        editContacts.push(element)
        edit_colors.push(element.color)
    });
    contacts.forEach(element => {
        if (edit_colors.includes(element.color) == false) editContacts.push(element)
    });
};


function renderEditorsInitials() {
    document.getElementById('initials').innerHTML = '';
    for (let i = 0; i < editors.length; i++) {
        let initial = editors[i]['initials'];
        let bgrColor = editors[i]['color'];
        document.getElementById('initials').innerHTML += `
        <div class="initials" style="background-color: ${bgrColor};">
        ${initial}
        </div>`;
    }
};

/**
 * highlights the current task priority
 */

function setPrioInEditTask(task) {
    currentPrioEditTask = task['prio'];
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.add(`prio_button_${currentPrioEditTask}`);
};

/**
 * highlights the selected task priority
 */

function editPrio(prio) {
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.remove(`prio_button_${currentPrioEditTask}`);
    currentPrioEditTask = prio;
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.add(`prio_button_${currentPrioEditTask}`);
};

/**
 * determines the status of the subtask
 */

function checkSubtaskStatus(i) {
    if (tasks[i]['done'] != []) {
        for (let j = 0; j < tasks[i]['done'].length; j++) {
            if (tasks[i]['done'][j] == true) document.getElementById('CheckboxTask' + j).checked = true;
        }
    }
};

/**
 * adds a subtask to the selected task
 */

function addSubtask_edit(i) {
    let subtask = document.getElementById('subTask').value;
    if (subtask.length < 1) showNotice('pleaseEnterName');
    else {
        tasks[i]['done'].push(false);
        tasks[i]['subtasks'].push(subtask);
        editTask([i]);
    }
};

/**
 * deletes the selected subtask in the edit view
 */

function deleteSubtaskEdit(i, index) {
    document.getElementById('subTask' + i).classList.add('slide-out-right');
    setTimeout(() => {
        tasks[index]['subtasks'].splice(i, 1)
        tasks[index]['done'].splice(i, 1)
        editTask([index]);
    }, 400);
};

/**
 * changes the subtask status in the edit view
 */

function setSubtaskStatusEdit(i, index) {
    if (document.getElementById('CheckboxTask' + i).checked == true) tasks[index]['done'][i] = true;
    else tasks[index]['done'][i] = false;
};


function renderEditSubtask(index) {
    document.getElementById('editSubtask').innerHTML = ``;
    for (let i = 0; i < tasks[index]['subtasks'].length; i++) {
        let subTask = tasks[index]['subtasks'][i];
        document.getElementById('editSubtask').innerHTML += `
        <div class="subtask_child" id="subTask${i}">
            <input type="checkbox" id="CheckboxTask${i}" class="checkbox_subtask" onclick="setSubtaskStatusEdit(${i}, ${index})">
            <div class ="subTask_Text">${subTask}</div>
            <img src="assets/img/x.svg" onclick="deleteSubtaskEdit(${i}, ${index})">
        </div>`;
    };
};


function htmlCheckIcon(index) {
    return `
        <div class="check-button" onclick="saveTask(${index})">
            OK
            <img src="./assets/img/board-icons/check.png">
        </div>`;
};

/**
 * saves the edited task in the backend
 */

async function saveTask(idx) {
    saveChangedDataLocal(idx);
    await saveData('tasks', tasks);
    animateOut('taskDetailView');
    menuContactsOpen = false;
    await initBoard();
};

/**
 * closes the overlay
 */

function animateOut(id) {
    document.getElementById(id).classList.remove('slide-in-right');
};

/**
 * saves the edited task in the backend
 */

function saveChangedDataLocal(idx) {
    tasks[idx]['title'] = document.getElementById('editTaskTitle').value;
    tasks[idx]['description'] = document.getElementById('editTaskDescription').value;
    tasks[idx]['date'] = document.getElementById('editTaskDueDate').value;
    tasks[idx]['prio'] = currentPrioEditTask;
    tasks[idx]['contacts'] = editors;
};

/**
 **deletes the task in the board and saves it in the backend
 */

async function deleteTask(index) {
    tasks.splice(index, 1);
    animateOut('taskDetailView');
    await saveData('tasks', tasks);
    await initBoard();
};


function htmlAllEditors(task) {
    let htmlCodeTemp = '';
    editors = task['contacts'];
    setYouToUserName(editors);
    for (let i = 0; i < editors.length; i++) {
        const editor = editors[i];
        if (editor == null) break; // exit for each loop when no editor is available - prevent error
        htmlCodeTemp += htmlTaskSingleEditorDetail(editor);
    }
    return htmlCodeTemp;
};


function htmlTaskSingleEditorDetail(ed) {
    return `
        <div class="single-editor">
            <div class="ed-initials" style="background-color: ${ed['color']}">${ed['initials']}</div>
            <div class="font">${ed['name']}</div>
        </div>
    `;
};


function getCategoryColor(prio) {
    if (prio == 'low') {
        return '#7AE229';
    } else if (prio == 'medium') {
        return '#FFA800';
    } else if (prio == 'urgent') {
        return '#FF3D00';
    } else {
        return '#000000';
    };
};

/**
 * replaces the first letter of the string with a capital letter
 */

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};


function startDragging(id) {
    currentDraggedElement = id;
    markDraggableArea(`2px dotted #a8a8a8`);
};


function allowDrop(ev) {
    ev.preventDefault();
};

/**
 * 
 * @param {String} status assign column in board - todo, progress, feedback, done
 * task_id != currentDraggedElement, therefore find Index of task in task with task_id
 */

function moveTo(status) {
    let taskIndex = tasks.findIndex((task) => task['task_id'] == currentDraggedElement);
    tasks[taskIndex]['status'] = status;
    markDraggableArea(``);
    saveData('tasks', tasks);
    renderTasks(tasks);
};

/**
 * clears the contents of the board
 */

function deleteTasksOnBoard() {
    document.getElementById('tasks-todo').innerHTML = '';
    document.getElementById('tasks-progress').innerHTML = '';
    document.getElementById('tasks-feedback').innerHTML = '';
    document.getElementById('tasks-done').innerHTML = '';
};

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns column where task has to be rendered
 * if no status is available, task is new and not started
 */

function checkTaskStatus(task) {
    if (task['status'] != null) {
        return `tasks-${task['status']}`;
    } else {
        return 'tasks-todo';
    }
};


function markDraggableArea(style) {
    let draggableArea = document.getElementsByClassName('task-body');
    for (let i = 0; i < draggableArea.length; i++) {
        const area = draggableArea[i];
        area.style.border = style;
    }
};

/**
 * opens the add task menu
 */

function overlayAddTask(status) {
    task_status = status;
    document.getElementById('hidden').classList.add('overflow-hidden');
    document.getElementById('mobileCreate').classList.add('create_mobile_active');
    document.getElementById('overlayAddTask').classList.add('slide-in-right');
    renderOverlayAddTask();
    getDateOverlay('dateOverlay');
};

/**
 * closes the detail view of the task
 */

function closeDetailView() {
    editContacts = [];
    animateOut('taskDetailView');
    menuContactsOpen = false;
};

/**
 * closes the overlay
 */

function noClose(event) {
    event.stopPropagation();
};

/**
 * 
 */

function filterTasks() {
    filteredTasks = [];
    let inputValue = document.getElementById('search-input').value;
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (inputValueIsInTask(inputValue, task)) filteredTasks.push(task);
    }
    renderTasks(filteredTasks);
};


function clearSearch() {
    renderTasks(tasks);
    document.getElementById('search-input').value = '';
}

function inputValueIsInTask(input, task) {
    return task['title'].toLowerCase().includes(input.toLowerCase()) || task['description'].toLowerCase().includes(input.toLowerCase());
};

/**
 * saves the created task from the add task function
 */

function createTaskonBoard(x) {
    if (x == 'contacts') createTask();
    if (allFilled()) addTask();
    else showTasknotFull();
};

/**
 * saves the created task from the add task function
 */

async function addTask() {
    closeMenu('contacts', 'dropDownContacts')
    showNotice('addBordBox');
    await fillTaskjJson();
    task = {};
    contacts = {};
    editors = {};
    clearAll();
    closeOverlay();
    initBoard();
};

/**
 *checks whether everything has been filled out and gives feedback if not 
 */

function showTasknotFull() {
    if (!button_delay) {
        button_delay = true;
        if (!taskCategory) clearInputField();
        if (taskCategory) setCategory(taskCategory, color);
        if (enter_email) clearEmailField();
        closeMenu('contacts', 'dropDownContacts')
        showNotice('missing');
        checkWhichFieldIsEmpty()
        setTimeout(() => button_delay = false, 2500);
    }
};

/**
 * opens the contact menu in the add task function
 */

function openEditTaskContacts() {
    if (!menuContactsOpen) {
        document.getElementById('editContacts').innerHTML = '';
        openMenu('editContacts', 'dropDownEditContacts');
        menuContactsOpen = true;
        renderEditContacts();
    } else {
        closeMenu('editContacts', 'dropDownEditContacts')
        menuContactsOpen = false;
    }
};

/**
 * renders the contacts in the contact menu of the add task function
 */

function renderEditContacts() {
    document.getElementById('editContacts').innerHTML = ``;
    document.getElementById('editContacts').innerHTML += `<div class="render_categorys" onclick="inviteContact() ">Invite new contact</div>`;
    for (let i = 0; i < editContacts.length; i++) {
        let userName = editContacts[i]['name'];
        renderEditTaskContactsHTML(i, userName);
        if (editors.includes(editContacts[i])) {
            document.getElementById('Checkbox' + i).classList.add('custom_checkBox_child');
        }
    }
};

function renderEditTaskContactsHTML(i, userName) {
    document.getElementById('editContacts').innerHTML += `
            <div class="render_categorys" onclick="editTaskSetContacts(${i})">
                ${userName}  
                <div class="custom_checkBox">
                    <div id="Checkbox${i}"></div>
                </div>
            </div>`;
};

/**
determines the selected contacts
 */

function editTaskSetContacts(i) {
    let index = editors.indexOf(editContacts[i])
    if (index == -1) {
        document.getElementById('Checkbox' + i).classList.add('custom_checkBox_child');
        if (editContacts[i]['name'] == 'You') editContacts[i]['name'] = user_name;
        editors.push(editContacts[i]);
        renderEditorsInitials()
    } else {
        document.getElementById('Checkbox' + i).classList.remove('custom_checkBox_child');
        editors.splice(index, 1);
        renderEditorsInitials()
    }
};