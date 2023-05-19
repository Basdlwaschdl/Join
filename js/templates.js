function showInputCategoryHTML() {
    return document.getElementById('categoryBox').innerHTML = `
    <div class="category_name_box">  
                    <input class="input_category_name" type="text" placeholder="New category name" id="categoryValue" required maxlength="29">
                    <div class="x✔">
                        <div onclick="clearInputField()" class="x"><img src="assets/img/x.svg" alt=""></div>
                        <button onclick="addNewCategory()"><img class="hook" src="assets/img/haken.png"></button>
                    </div>
                </div>
                <div class="color_points">
                    <div id="#8AA4FF" class="color" onclick="setColor('#8AA4FF')" style="background-color: #8AA4FF;"></div>
                    <div id="#FF0000" class="color" onclick="setColor('#FF0000')" style="background-color: #FF0000;"></div>
                    <div id="#2AD300" class="color" onclick="setColor('#2AD300')" style="background-color: #2AD300;"></div>
                    <div id="#FF8A00" class="color" onclick="setColor('#FF8A00')" style="background-color: #FF8A00;"></div>
                    <div id="#E200BE" class="color" onclick="setColor('#E200BE')" style="background-color: #E200BE;"></div>
                    <div id="#0038FF" class="color" onclick="setColor('#0038FF')" style="background-color: #0038FF;"></div>
                </div>`;
};


function showCategoryHTML() {
    return document.getElementById('categoryBox').innerHTML = `
    <div class="drop_down" id="dropDown"  onclick="openCategory()">
                    Select task category
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="categorys" class="render_categorys_box"></div>`;
};


function showCategoryColorHTML() {
    return document.getElementById('categoryBox').innerHTML = `
    <div class="drop_down" id="dropDown" onclick="openCategory()">
                    <div class="category_color">
                        ${taskCategory}
                        <div  class="color2" style="background-color: ${color};"></div>
                    </div>
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="categorys" class="render_categorys_box"></div>`;
};


function renderCategorysHTML(clr, i, category) {
    return document.getElementById('categorys').innerHTML += `
        <div class="render_categorys" id="ctgry${i}">
                   <div class="set_category" onclick="setCategory('${category}', '${clr}')">
                        ${category}
                        <div  class="color2" style="background-color: ${clr};"></div>
                    </div>
                        <img class="delete_image" src="assets/img/x.svg" onclick="deleteCategory(${i})">
                    </div>`;
};


function renderSubtasHTML(subTask, i) {
    return document.getElementById('subtaskBox').innerHTML += `
        <div class="subtask_child" id="subTask${i}">
            <input type="checkbox" id="CheckboxTask${i}" class="checkbox_subtask" onclick="setSubtaskStatus(${i})")>
            <div class ="subTask_Text">${subTask}</div>
            <img src="assets/img/x.svg" onclick="deleteSubtask(${i})">
        </div>`;
};


function renderContactsHTML(i, userName) {
    document.getElementById('contacts').innerHTML += `
            <div class="render_categorys" onclick="setContacts(${i})">
                ${userName}  
                <div class="custom_checkBox">
                    <div id="Checkbox${i}"></div>
                </div>
            </div>`;
};


function renderOverlayHTML() {
    document.getElementById('overlay').innerHTML = `
    <div class="form form_contact">
    <div class="overlay_headline">Add Task</div>
        <div class="form_left">

            <!---------------------------------------------------------Title Input----------------------------------------------------------------------------->

            <span>Title</span>
            <input type="text" placeholder="Enter a title" id="title" maxlength="29" onfocus="removeBorder('title')">

            <!---------------------------------------------------------Description Input----------------------------------------------------------------------->

            <span>Description</span>
            <textarea placeholder="Enter a Description" id="description"
                onfocus="removeBorder('description')"></textarea>

            <!---------------------------------------------------------Category Menu--------------------------------------------------------------------------->

            <span>Category</span>
            <div id="categoryBox">
                <div class="drop_down" id="dropDown" onclick="openCategory()">
                    Select task category
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="categorys" class="render_categorys_box"></div>
            </div>

            <!-------------------------------------------------------------Contacts Menu----------------------------------------------------------------------->

            <span>Assigned to</span>
            <div id="contactBox">
                <div class="drop_down" id="dropDownContacts" onclick="openContacts()">
                    Select contacts to assign
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="contacts" class="render_categorys_box"></div>
            </div>
            <div id="initials" class="initials_box"></div>
        </div>

        <div class="form_right">

            <!-------------------------------------------------------------input Date------------------------------------------------------------------------->

            <span>Due date</span>
            <input type="date" id="dateOverlay" autofocus>

            <!-------------------------------------------------------------input Priority--------------------------------------------------------------------->

            <span>Prio</span>
            <div class="prio" id="prio">
                <div class="prio_button" id="prioUrgent" onclick="setPrio('urgent')">Urgent<img
                        src="assets/img/prioUrgent.png"></div>
                <div class="prio_button" id="prioMedium" onclick="setPrio('medium')">Medium <img
                        src="assets/img/prioMedium.png"></div>
                <div class="prio_button" id="prioLow" onclick="setPrio('low')">Low <img src="assets/img/prioLow.png">
                </div>
            </div>

            <!-------------------------------------------------------------input Subtasks--------------------------------------------------------------------->

            <span style="margin-top: 34px;">Subtasks</span>
            <div class="subtasks">
                <input type="text" placeholder="Add new subtask" id="subTask" maxlength="29">
                <img class="plus_image" src="assets/img/plus.svg" onclick="addSubtask()">
            </div>
            <div class="subtask_box" id="subtaskBox"></div>
            <div class="clear_create_task">
            <div class="clear_button" onclick="clearAll()">Clear x</div>
            <div class="create_button" onclick="createTaskonBoard()">Create Task ✔</div>
        </div>
        </div>`;
}


function renderClearEmaailHTML() {
    document.getElementById('contactBox').innerHTML = `
    <div class="drop_down" id="dropDownContacts" onclick="openContacts()">
                    Select contacts to assign
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="contacts" class="render_categorys_box"></div>`;
}


function renderInviteContactHTML() {
    document.getElementById('contactBox').innerHTML = `
    <div class="category_name_box">  
                    <input class="input_category_name" type="email" placeholder="Please enter e-mail" id="inviteValue" required maxlength="29">
                    <div class="x✔">
                        <div onclick="clearEmailField()" class="x"><img src="assets/img/x.svg" alt=""></div>
                        <button onclick="sendEmail()"><img class="hook" src="assets/img/haken.png"></button>
                    </div>
                </div>`;
}


function renderEditClearEmailHTML() {
    document.getElementById('contactBox').innerHTML = `
    <div class="drop_down" id="dropDownEditContacts" onclick="openEditTaskContacts()">
                        Select contacts to assign
                        <img class="down_image" src="assets/img/drop-down-arrow.png">
                    </div>
                    <div id="editContacts" class="render_categorys_box"></div>
                </div>`;
};


function htmlTaskDetailView(task) {
    return `
        <div class="content flip-card-front" onclick="noClose(event)">
            <div class="close">
                <img src="./assets/img/close.png" onclick="closeDetailView()">
            </div>
            <div id="content" class="task-details">
                <div class="category" style="background-color: ${task['category_color']}">${task['category']}</div>
                <div class="title">${task['title']}</div>
                <div class="font">${task['description']}</div>
                <div class="date">
                    Due date:
                    <div class="font">${task['date']}</div>
                </div>
                <div class="priority">
                    Priority:
                    <div class="prio-icon" style="background-color: ${getCategoryColor(task['prio'])}">
                        <div>${task['prio']}</div>
                        <img src="./assets/img/prio${capitalizeFirstLetter(task['prio'])}.png">
                    </div>
                </div>
                <div class="editors_edit">
                    Assigned To:
                    ${htmlAllEditors(task)}
                </div>
                <div class="editors">Subtasks:</div>
                <div id="subTasks" class="detail_subtaks"></div>
            </div>
            <div id="icons" class="icons">
                <div class="delete-button" onclick="deleteTask(${tasks.indexOf(task)})">
                    <img src="./assets/img/board-icons/delete.png">
                </div>
                <div class="edit-button" onclick="editTask(${tasks.indexOf(task)})">
                    <img src="./assets/img/board-icons/edit.png">
                </div>
            </div>
        </div>
    `;
};


function htmlEditTask(i) {
    return `<div class="flip-card-back">
            <div class="title">
                Title
                <input type="text" id="editTaskTitle" value="${tasks[i]['title']}">
            </div>
            <div class="description">
                Description
                <textarea id="editTaskDescription" rows="5" required>${tasks[i]['description']}</textarea>
            </div>
            <div class="date">
                Due date:
                <input type="date" id="editTaskDueDate" min="" value="${tasks[i]['date']}" class="edit_date">
            </div>
            <div class="priority">
                Prio
                <div class="edit-prio-buttons">
                    <div class="prio_button" id="editPrioUrgent" onclick="editPrio('urgent')">
                        Urgent
                        <img src="./assets/img/prioUrgent.png">
                    </div>
                    <div class="prio_button" id="editPrioMedium" onclick="editPrio('medium')">
                        Medium
                        <img src="./assets/img/prioMedium.png">
                    </div>
                    <div class="prio_button" id="editPrioLow" onclick="editPrio('low')">
                        Low
                        <img src="./assets/img/prioLow.png">
                    </div>
                </div>
            </div>
            <div class="editors">
                Assigned to
                <div id="contactBox" style="z-index: 5;">
                    <div class="drop_down" id="dropDownEditContacts" onclick="openEditTaskContacts()">
                        Select contacts to assign
                        <img class="down_image" src="assets/img/drop-down-arrow.png">
                    </div>
                    <div id="editContacts" class="render_categorys_box"></div>
                </div>
                <div id="initials" class="initials_box_edit"></div>
                <img class="plus_image_edit" src="assets/img/plus.svg" onclick="addSubtask_edit(${i})">
                <div class="subtasks_edit">
                <span class="editors">Subtasks</span>
                    <input type="text" placeholder="Add new subtask" id="subTask" maxlength="29" style class="input_edit">
                    <div class="subtask_box" id="editSubtask"></div>
                </div>
            </div>
            <span class="editors">Status</span>
            <div class="status_buttons">
                <div class="status-button" onclick="setEditStatus(${i}, 'todo')" id="status1">To do</div>
                <div class="status-button" onclick="setEditStatus(${i}, 'progress')" id="status2">In progress</div>
                <div class="status-button" onclick="setEditStatus(${i}, 'feedback')" id="status3">Feedback</div>
                <div class="status-button" onclick="setEditStatus(${i}, 'done')" id="status4">Done</div>
            </div>
            </div>
    `;
};


function showDetailsHTML(id, editname) {
    return `
    <div class="contact-details-head">
    <span class="list-contact-frame" style="background-color: ${contactsA[id].color}">${contactsA[id].initials}</span>
    <div class="contactInfo">
        <span class="contact-name">${contactsA[id].name}</span>
        <div class="add_task_contact" onclick="addScroll()"> + Add Task</div>
    </div>
    </div>
    <div class="contact-info-box">
    <div class="contact-info-head">
        <p>Contact Information</p>
        <div class="contact-edit">
            <img src="./assets/img/contacts-icons/pen.png" alt="">
            <p onclick="editShowContact(${editname})">Edit Contact</p>
        </div>
    </div>
    <div class="contact-info-container">
        <div class="contact-info-segment">
            <span class="contact-info-title">Email</span>
            <a href="mailto:mail@egal.de">${contactsA[id].mail}</a>
        </div>
        <div class="contact-info-segment">
            <span class="contact-info-title">Phone</span>
            <a href="tel:+4915166456">${contactsA[id].phone}</a>
        </div>
    </div>
    </div>
    <div id="mobile-menu" onclick="editShowContact(${editname})"></div>`;
};


function showCreateContactHTML() {
    return `
    <div class="right_left">
    <div class="close-top">
        <img src="./assets/img/contacts-icons/close-white.png" alt="" onclick="toggleDNone('overlayContent')" class="white">
    </div><div class="overlay-left">        
    <img src="./assets/img/menu-logo.png" alt="" id="logo">
    <p class="overlay-title">Add contact</p>
    <p>Task are better with a team!</p>
    <div class="overlay-sep"></div>
    </div>
    <!-- createContact -->
        <div class="overlay-right">
        <img src="./assets/img/contacts-icons/userIcon.png" alt="" class="user_icon">
        <form class="form_overlay" action="#" onsubmit="addContact(); return false">
            <input class="name-input" id="name-input" placeholder="Name" type="text" pattern="[a-zA-ZÄäÜüÖöß ]*" maxlength="30" required>
            <input class="email-input" id="email-input" placeholder="Email" type="email" required>
            <input class="phone-input" type="number" id="phone-input" placeholder="Phone" type="tel" pattern="[0-9+/ ]*" minlength="6" maxlength="30" required>
            <div class="buttons">
                <button type="button" class="cancel-contact-btn" onclick="closeEditContact('overlayContent')">Cancel </button>
                <button type="submit" class="add-contact-btn" >
                Create contact
                </button>
            </div>
            </form>
                <div class="close-contact">
                <img src="./assets/img/contacts-icons/close.png" alt="" onclick="closeEditContact('overlayContent')" class="dark">
                </div>
            </div>
            </div>`;
};


function showEditContactHTML(id, userId) {
    return `
    <div class="right_left">
    <div class="overlay-left">
        <div class="close-top">
        <img src="./assets/img/contacts-icons/close-white.png" alt="" onclick="toggleDNone('overlayContent')" class="white">
    </div>
    <img src="./assets/img/menu-logo.png" alt="" id="logo">
    <p class="overlay-title">Edit contact</p>
    <div class="overlay-sep"></div>
    </div>
    <div class="overlay-right">
    <span class="initial-circle mobile-circle" style="background-color: ${contactsA[id].color}">${contactsA[id].initials}</span>
    <form class="form_overlay" action="#" onsubmit="editContact(${userId}); return false">
        <input class="name-input" id="name-input" placeholder="Name" type="text" pattern="[a-zA-ZÄäÜüÖöß ]*" maxlength="30" required value="${contactsA[id].name}">
        <input class="email-input" id="email-input" placeholder="Email" type="email" required value="${contactsA[id].mail}">
        <input class="phone-input" id="phone-input" placeholder="Phone" type="tel" pattern="[0-9+/ ]*" minlength="6" maxlength="30" required value="${contactsA[id].phone}">
        <div class="buttons">
            <button type="button" class="cancel-contact-btn" onclick="delContact(${userId})">Delete</button>
            <button type="submit" class="add-contact-btn" >
                Save
            </button>
        </div>        
    </form>
    <div class="close-contact">
        <img src="./assets/img/contacts-icons/close.png" alt="" onclick="closeEditContact()" class="dark">
    </div>
    </div>
    </div>`
};