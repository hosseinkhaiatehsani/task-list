// import { TEST } from "./test.js";
import { toDoListData } from "./data.js";


let storageName = "toDoList";
const app = document.querySelector("[data-app]");
const toDoForm = document.querySelector("[data-submit-todo-form]");
// const addToDoButton = document.querySelector("[data-add-todo]");

// console.log(TEST);

document.addEventListener("DOMContentLoaded", function(){
    init();
    loadFromStorage();
    // console.log(toDoForm)
    renderToDoList();
    console.log(toDoListData)
    toDoForm.addEventListener("submit", handleFromAction);
});


// function createToDoInput(){
//     let inputContainer = document.createElement("div");
//     let input = document.createElement("input");
// }
function init(){
    let list = document.createElement("div");
    list.dataset.listId = "list-id";
    list.id = "list-container";
    app.appendChild(list);
}

function handleFromAction(event){
    event.preventDefault();
    let form = event.target;
    let input = form.querySelector("[data-todo-input]");

    if(input.value.trim() == "") return;

    let newItem = {
        id: generateIndex(),
        text: input.value,
        done: false,
    }

    toDoListData.push(newItem);
    renderItem(newItem);

    saveToStorage();

    input.value = "";
}

function generateIndex(){
    let len = toDoListData.length;

    return len;
}

function saveToStorage(){
    let preparedData = JSON.stringify(toDoListData);
    localStorage.setItem(storageName, preparedData);
}

function loadFromStorage(){
    let storageData = localStorage.getItem(storageName);
    let storageJsonData = JSON.parse(storageData);

    if(storageJsonData && storageJsonData.length > 0){
        toDoListData.push(...storageJsonData)
    }
}

function renderToDoList(){
    if(toDoListData.length == 0) return;

    // let list = document.createElement("div");
    // list.dataset.listId = "list-id";
    // list.id = "list-container";

    // let list = document.querySelector("[data-list-id]");

    toDoListData.forEach(item => {
        // let newItem = `<div class="list-item" id="${item.id}">${item.text}</div>`;
        // list.innerHTML += newItem;
        renderItem(item);
    });

    // app.appendChild(list);
}

function renderItem(item){
    let list = document.querySelector("[data-list-id]");

    let newItem = `<div class="list-item" id="${item.id}">${item.text}</div>`;
    list.innerHTML += newItem;
}