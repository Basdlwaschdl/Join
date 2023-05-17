let contactsA = [];
let activID;
let contact_exist = false;
let contact = {};
let allUsersDB = [];
let regUser = localStorage.getItem('currentUser');
let userData;
let userArryId;
let orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);

/**
 * Load Data from server
 * 
 */
async function init() {
    await getCurrentUser();
    await getAllUsers();
    insertContactsToContactList();
};

/**
 * loads all users from the backend
 */

async function getAllUsers() {
    await getItem('users');
    getCurrentUserData();
};

/**
 * determines the current user
 */

function getCurrentUserData() {
    users.forEach(function users(value, index) {
        if (value.mail === regUser) {
            userData = value;
            userArryId = index;
            contactsA = value.contacts || [];
        }
    })
};

/**
 * load all Contacts to contacts list
 */

async function insertContactsToContactList() {
    let container = document.getElementById('contacts-list');
    container.innerHTML = '';
    orderContacts();
    for (let i = 0; i < orderedContacts.length; i++) {
        if (orderedContacts[i].length > 0) {
            container.innerHTML += genContactsHeader(i);
            for (let j = 0; j < orderedContacts[i].length; j++) {
                const contact = orderedContacts[i][j];
                container.innerHTML += genContactHtml(orderedContacts[i][j]);
            }
        }
    }
};

/**
 * Sort Contacts by Firstname from A to Z
 */

function sortContacts() {
    contactsA = contactsA.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(
            b.name.toLowerCase()
        );
    });
}

/**
 * Sort Contacts alphabetical to orderedContacts
 * 
 */

function orderContacts() {
    sortContacts();
    orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);
    for (let i = 0; i < contactsA.length; i++) {
        contactsA[i].id = i;
        let letter = contactsA[i].name.toLowerCase().toString();
        letter = letter.replace(/\u00e4/g, "ae").replace(/\u00fc/g, "ue").replace(/\u00f6/g, "oe");
        letter = letter.slice(0, 1);
        letter = letter.charCodeAt(0) - 97;
        orderedContacts[letter].push(contactsA[i]);
    }
};

/**
 * Retrunt a random Color-Hexcode 
 * @returns random color hexcode (#7D735F)
 */

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

/**
 * 
determines the initials of the contact
 */

function getInitial(username) {
    if (username.includes(' ')) {
        return username.charAt(0).toUpperCase() + username.charAt(username.lastIndexOf(' ') + 1).toUpperCase();
    } else {
        return username.charAt(0).toUpperCase();
    }
};

/**
 * deletes the contact from the user
 */

function delContact(userId) {
    showNotice('delete');
    users[userArryId]['contacts'].splice(userId, 1);
    saveContacts();
    document.getElementById('contactDetails').innerHTML = '';
    animationAndPushToServer();
};


function addContact() {
    let name = document.getElementById('name-input').value;
    let email = document.getElementById('email-input').value;
    let phone = document.getElementById('phone-input').value;
    pushNewContactToUser(name, email, phone);
};

/**
 * adds a new contact to the user
 */

function pushNewContactToUser(name, email, phone) {
    let initials = getInitial(name);
    let color = getRandomColor();
    let singelContact = { name: name, mail: email, phone: phone, initials: initials, color: color };
    checkIfContactExist(email);
    if (contact_exist == true) showNotice('emailExist');
    else {
        users[userArryId]['contacts'].push(singelContact);
        saveContacts();
        animationAndPushToServer();
        showNotice('created');
    }
};

/**
 * saves the users in the backend
 */

async function saveContacts() {
    setYouToUserName(users);
    await setItem('users', JSON.stringify(users));
};

/**
 * checks whether the adding email already exists for a user
 */

function checkIfContactExist(email) {
    contact_exist = false;
    users[userArryId]['contacts'].forEach(function users(value, index) {
        if (value.mail === email) {
            showNotice('emailExist');
            contact_exist = true;
            return;
        }
    });
};

/**
 * 
 * @param {Integer} id - id from user you want to edit
 */

function editContact(id) {
    let name = document.getElementById('name-input').value;
    let email = document.getElementById('email-input').value;
    let phone = document.getElementById('phone-input').value;
    let initials = getInitial(name);
    saveEditContact(id, name, email, phone, initials);
};

/**
 * saves the edited contact in the user
 */

function saveEditContact(id, name, email, phone, initials) {
    contactsA[id].name = name;
    contactsA[id].mail = email;
    contactsA[id].phone = phone;
    contactsA[id].initials = initials;
    users[userArryId]['contacts'] = contactsA;
    animationAndPushToServer();
    showDetails(id)
};


function animationAndPushToServer() {
    saveContacts();
    closeEditContact()
    insertContactsToContactList();
};


function showDetailsAtMobile(i) {
    let windowWidth = window.innerWidth;
    if (windowWidth < 1251) {
        document.getElementById('contacts-list').classList.add('d-none')
        document.getElementsByClassName('contact-info')[0].classList.remove('d-none-mobile')
        document.getElementsByClassName('new-contact')[0].classList.add('d-none')
    }
    if (windowWidth < 600) document.getElementById('mobileIcon').style.display = `block`;
    document.getElementById('mobileIcon').innerHTML = `
        <img src="./assets/img/contacts-icons/pen-white.png" class="edit_img" onclick="editShowContact(${i})">
        <img src="assets/img/board-icons/delete.png" class="trash" onclick="delContact(${i})">`;
};


function hideContactInfo() {
    document.getElementById('mobileIcon').style.display = `none`;
    document.getElementById('contacts-list').classList.remove('d-none')
    document.getElementsByClassName('contact-info')[0].classList.add('d-none-mobile')
    document.getElementsByClassName('new-contact')[0].classList.remove('d-none')
    document.getElementById('mobile-menu').innerHTML = '';
};

/**
 * opens the add task menu
 */

function addScroll() {
    document.getElementById('overlayAddTask').classList.remove('d-none');
    document.getElementById('overlayAddTask').classList.remove('overlay-closed');
    document.getElementById('overlayAddTask').classList.add('overlay-add-task');
    document.getElementById('mobileCreate').style.visibility = 'visible';
    renderOverlayAddTask();
    getDateOverlay('dateOverlay');
};

/*Gen HTML Content */

/**
 * 
 * @param {JSON} contact - User from Database
 * @returns html template
 */
function genContactHtml(contact) {
    return /*html */`
    <div class="list-contact" onclick="showDetails(${contact.id}); showDetailsAtMobile(${contact.id})" id="${contact.id}">
            <span class="contact-frame" style="background-color: ${contact.color}" >${contact.initials}</span>
            <div class="list-contact-info">
                <p>${contact.name}</p>
                <p>${contact.mail}</p>
            </div>
        </div>   
    
    `;
}

/**
 * 
 * @param {Number} i formCharCode  
 * @returns HTML template Contactlist header
 */
function genContactsHeader(i) {
    return /*html */ `
        <div class="list-header">
               ${String.fromCharCode(i + 97).toUpperCase()}
        </div>
    `;
};

/**
 * displays the contact details
 */

function showDetails(id) {
    removeHighlighted();
    let editname = id;
    document.getElementById(id).classList.add('highlighted');
    document.getElementById('contactDetails').innerHTML = '';
    document.getElementById('contactDetails').innerHTML = 
    showDetailsHTML(id, editname)
    document.getElementById('contactDetails').classList.add('slide-in-right');
    setTimeout(() => document.getElementById('contactDetails').classList.remove('slide-in-right'), 500);
};


function removeHighlighted() {
    const items = document.querySelectorAll('.highlighted');
    items.forEach(item => {
        item.classList.remove("highlighted");
    });
}

/**
closes the overlay
 */

function closeOverlay(i) {
    setYouToUserName(users)
    clearAll();
    if (i == 'bc') document.getElementById('boardContent').classList.remove('d-none');
    document.getElementById('overlayAddTask').classList.add('overlay-closed');
    setTimeout(() => document.getElementById('overlayAddTask').classList.add('d-none'), 250);
    document.body.classList.remove('overflow-hidden');
    document.getElementById('mobileCreate').style.visibility = 'hidden';
};

/**
 * opens the menu for editing the contact
 */

function editShowContact(contact) {
    document.getElementById('overlayContent').classList.add('slide-in-blurred-right');
    document.getElementById('overlayContent').classList.remove('d-none')
    document.getElementById('overlayContent').classList.remove('slide-out-blurred-right');
    document.getElementById('overlayContent').classList.remove('overlay-closed');
    document.getElementById('overlayContent').innerHTML = '';
    if (typeof contact !== 'undefined') showEditContact(contact);
    else showCreateContact();
};

/**
 * closes the edit menu of the contact
 */

function closeEditContact() {
    document.getElementById('overlayContent').classList.remove('slide-in-blurred-right');
    document.getElementById('overlayContent').classList.add('slide-out-blurred-right');
    setTimeout(() => document.getElementById('overlayContent').classList.add('d-none'), 250);
    //document.getElementById('overlayContent').classList.add('overlay-closed');
    //setTimeout(() => document.getElementById('overlayContent').classList.add('d-none'), 200);
};

/**
 * renders HTML code
 */

function showCreateContact() {
    document.getElementById('overlayContent').innerHTML =  showCreateContactHTML();
};

/**
 * renders HTML code
 */

function showEditContact(id) {
    let userId = id;
    document.getElementById('overlayContent').innerHTML = showEditContactHTML(id, userId);
};