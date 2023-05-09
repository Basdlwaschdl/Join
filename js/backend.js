const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const STORAGE_TOKEN = 'UNRJCYEAL7BMUBE14GRH7TBF3ROSVSR0EB0SVWQ6'
let users = [];
let task_id;
let categorys = {};
let tasks;
let user_name;

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    await fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}


async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    let response = await fetch(url).then(res => res.json());
    if(key == 'categorys') categorys = JSON.parse(response['data']['value']);
    if(key == 'contacts') contacts = JSON.parse(response['data']['value']);
    if(key == 'index') task_id = response['data']['value'];
    if(key == 'currentUser_name') user_name = response['data']['value'];
    if(key == 'tasks') tasks = JSON.parse(response['data']['value']);
    if(key == 'all_users') allUsersDB = JSON.parse(response['data']['value']);
    if(key == 'users') users = JSON.parse(response['data']['value']);
}