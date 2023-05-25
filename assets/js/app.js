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
    // console.log(toDoListData)
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

    let list = document.querySelector("[data-list-id]");
    list.innerHTML = "";

    toDoListData.forEach(item => {
        // let newItem = `<div class="list-item" id="${item.id}">${item.text}</div>`;
        // list.innerHTML += newItem;
        renderItem(item);
    });

    // app.appendChild(list);
}

function renderItem(item){
    let list = document.querySelector("[data-list-id]");

    let newItem = document.createElement("div");

    newItem.id = item.id;
    newItem.classList.add("list-item");
    newItem.innerHTML = `<div class="item-content">${item.text}</div>`;
    

    let itemFooter = document.createElement("div");
    itemFooter.classList.add("list-item-footer");
    itemFooter.dataset.id = item.id;

    let checkBox = document.createElement("input");
    checkBox.classList.add("check-item");
    checkBox.type = "checkbox";
    if(item.done == true){
        checkBox.setAttribute("checked", item.done);
        newItem.querySelector(".item-content").classList.add("blur");
    }

    let deleteButton = document.createElement("div");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = `
        <svg enable-background="new 0 0 500 500" height="500px" id="Layer_1" version="1.1" viewBox="0 0 500 500" width="500px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><line fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="101.642" x2="120.633" y1="134.309" y2="430.972"/><path d="   M120.633,430.972c0,10.5,8.519,19.031,18.992,19.031" fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="139.625" x2="360.389" y1="450.003" y2="450.003"/><path d="   M360.389,450.003c10.474,0,18.979-8.531,18.979-19.031" fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><polyline fill="none" points="   379.367,430.972 398.386,134.309 101.642,134.309  " stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><path d="   M432.779,115.973c0,10.059-8.143,18.215-18.188,18.215" fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="414.592" x2="85.409" y1="134.188" y2="134.188"/><path d="   M85.409,134.188c-10.018,0-18.188-8.156-18.188-18.215" fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><path d="   M67.221,115.973c0-10.019,8.17-18.188,18.188-18.188" fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="85.409" x2="414.592" y1="97.784" y2="97.784"/><path d="   M414.592,97.784c10.045,0,18.188,8.17,18.188,18.188" fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="307.364" x2="307.364" y1="97.49" y2="68.988"/><path d="   M307.364,68.988c0-10.474-8.505-18.991-18.965-18.991" fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="288.399" x2="211.628" y1="49.997" y2="49.997"/><path d="   M211.628,49.997c-10.487,0-18.979,8.518-18.979,18.991" fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><polyline fill="none" points="   192.649,68.988 192.649,97.49 307.364,97.49  " stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><g><line fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="166.332" x2="166.332" y1="172.278" y2="406.06"/><line fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="222.102" x2="222.102" y1="172.278" y2="406.06"/><line fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="277.926" x2="277.926" y1="172.278" y2="406.06"/><line fill="none" stroke="#130B7A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="333.669" x2="333.669" y1="172.278" y2="406.06"/></g></g></svg>
    `;

    itemFooter.appendChild(checkBox);
    itemFooter.appendChild(deleteButton);

    checkBox.addEventListener("change", handleListItemChange);
    deleteButton.addEventListener("click", handleItemDelete)

    // let newItem = `<div class="list-item" id="${item.id}">${item.text}</div>`;
    newItem.appendChild(itemFooter);
    list.appendChild(newItem);
}

function handleListItemChange(e) {
    let grandParent = e.target.parentElement.parentElement;
    let taskId = e.target.parentElement.dataset.id;

    toggleToDoItemStatus(taskId);
    toggleBlur(grandParent);
    saveToStorage();
}

function toggleToDoItemStatus(id){
    id = parseInt(id);
    return toDoListData.map(item => {
        if(item.id == id)
            item.done = !item.done;
    })
}

function toggleBlur(parent){
    let content = parent.querySelector(".item-content");
    // console.log(content)
    content.classList.toggle("blur");
}

function handleItemDelete(e){
    // console.log(e.target)
    let itemId = e.target.parentElement.dataset.id;
    itemId = parseInt(itemId);

    let newList = toDoListData.filter(item => item.id != itemId);
    toDoListData.length = 0;
    toDoListData.push(...newList);

    renderToDoList();
    saveToStorage();

}