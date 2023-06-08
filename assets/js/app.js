// import { TEST } from "./test.js";
import { toDoListData } from "./data.js";
import { 
    storeData,
    retrieveAllData,
    deleteData,
} from "./indexed-db.js";


let storageName = "to-do-list";
const app = document.querySelector("[data-app]");
const toDoForm = document.querySelector("[data-submit-todo-form]");
// const addToDoButton = document.querySelector("[data-add-todo]");


let isTaskDeaitlModalActive = false;
let deferredPrompt;
// console.log(TEST);

document.addEventListener("DOMContentLoaded", function(){
    init();

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            // console.log('Service Worker registered with scope:', registration.scope);
          }, function(error) {
            // console.log('Service Worker registration failed:', error);
          });
        });
      }
});

window.addEventListener("popstate", handleWindowBackButton);

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevents the default mini-infobar or install dialog from appearing on mobile
    e.preventDefault();
    // Save the event because you'll need to trigger it later.
    deferredPrompt = e;
    // Show your customized install prompt for your PWA
    // Your own UI doesn't have to be a single element, you
    // can have buttons in different locations, or wait to prompt
    // as part of a critical journey.
    // showInAppInstallPromotion();
    console.log("before install was fired!")
});

// function createToDoInput(){
//     let inputContainer = document.createElement("div");
//     let input = document.createElement("input");
// }
async function init(){
    // openDatabase(storageName)
    toDoForm.addEventListener("submit", handleFromAction);
    let list = document.createElement("div");
    list.dataset.listId = "list-id";
    list.id = "list-container";
    app.appendChild(list);

    await loadFromStorage();
    renderToDoList();
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
    // resetIndexs();
    renderItem(newItem);

    saveToStorage();

    input.value = "";
}

function generateIndex(){
    let sectionOne = Date.now();
    let sectionTwo = Math.floor(Math.random() * 1000000);
    let id = `${sectionOne}-${sectionTwo}`;

    return id;
}

async function saveToStorage(){
    // let preparedData = JSON.stringify(toDoListData);
    // localStorage.setItem(storageName, preparedData);
    try{
        // last step => face db.transaction is not a function
        // console.log(toDoListData)
        await storeData(storageName, toDoListData);
    }catch(er) {
        console.log(er)
    }
}

async function loadFromStorage(){
    // let storageData = localStorage.getItem(storageName);
    // let storageJsonData = JSON.parse(storageData);
    return new Promise(async(resolve) => {
        let storageData = await retrieveAllData(storageName);
    
        if(storageData && storageData.length > 0){
            toDoListData.push(...storageData)
            resolve();
        }
    });


}

function renderToDoList(isFromDeleteMethod = false){
    if(toDoListData.length == 0 && !isFromDeleteMethod) return;

    let list = document.querySelector("[data-list-id]");
    list.innerHTML = "";

    toDoListData.forEach(item => {
        renderItem(item);
    });

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

    // let checkBoxContainer = document.createElement("label");
    // checkBoxContainer.classList.add("custom-checkbox");
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

    let magnify = document.createElement("span");
    magnify.classList.add("magnify");
    magnify.innerHTML = `
       <svg enable-background="new 0 0 32 32" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="search_magnifier_magnifying_glass_loupe"><g id="search_funds_x2C__magnifying_glass_x2C__magnifier_x2C__loupe_1_"><g id="analysis_2_"><g><g><g><path d="M23.586,23.586c0.122-0.122,0.262-0.217,0.408-0.299l-2.276-2.277c-0.195-0.195-0.512-0.195-0.707,0        c-0.195,0.196-0.195,0.512,0,0.708l2.271,2.271C23.368,23.846,23.464,23.707,23.586,23.586z" fill="#263238"/><path d="M28.5,31c-0.667,0-1.295-0.26-1.768-0.732l-3.5-3.5C22.76,26.295,22.5,25.668,22.5,25        s0.26-1.295,0.732-1.768c0.906-0.906,2.629-0.906,3.535,0l3.5,3.5C30.74,27.205,31,27.832,31,28.5s-0.26,1.295-0.732,1.768        S29.167,31,28.5,31z M25,23.52c-0.407,0-0.793,0.152-1.061,0.42C23.656,24.223,23.5,24.6,23.5,25s0.156,0.777,0.439,1.061        l3.5,3.5c0.567,0.566,1.554,0.566,2.121,0C29.844,29.277,30,28.9,30,28.5s-0.156-0.777-0.439-1.061l-3.5-3.5        C25.793,23.672,25.407,23.52,25,23.52z" fill="#263238"/></g><g><path d="M13,22.45c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5c3.767,0,7.035-2.404,8.133-5.981        c0.081-0.264,0.361-0.415,0.625-0.331c0.264,0.081,0.413,0.36,0.332,0.624C20.861,19.763,17.209,22.45,13,22.45z" fill="#263238"/></g><path d="M13,25C6.383,25,1,19.617,1,13S6.383,1,13,1s12,5.383,12,12S19.617,25,13,25z M13,2       C6.935,2,2,6.935,2,13s4.935,11,11,11s11-4.935,11-11S19.065,2,13,2z" fill="#263238"/></g></g></g></g><circle cx="22" cy="13" fill="#263238" r="0.5"/></g></svg>
    `;
    

    itemFooter.appendChild(checkBox);
    itemFooter.appendChild(deleteButton);

    checkBox.addEventListener("change", handleListItemChange);
    deleteButton.addEventListener("click", handleItemDelete);
    magnify.addEventListener("click", handleMagnifierButton);

    // let newItem = `<div class="list-item" id="${item.id}">${item.text}</div>`;
    newItem.appendChild(magnify);
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

async function handleItemDelete(e){
    let itemId = e.target.parentElement.dataset.id;
    itemId = itemId;

    let newList = toDoListData.filter(item => item.id != itemId);
    toDoListData.length = 0;
    toDoListData.push(...newList);
    
    // resetIndexs();
    await deleteData(storageName, itemId);
    renderToDoList(true);
    // saveToStorage();
}

// function resetIndexs(){
//     toDoListData.map((item, index) => {
//         item.id = index;
//         return item;
//     })
// }

function handleMagnifierButton(event){
    // console.log(event.target)
    let itemId = event.target.parentElement.id;
    let data = toDoListData.filter(item => {
        return item.id == itemId;
    });

    createModalElement(data[0]);
}

function createModalElement(data){

    let modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");
    
    let backDrop = document.createElement("div");
    backDrop.classList.add("modal-backdrop");

    let modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    prepareModalContent(modalContent, data);

    modalContainer.appendChild(backDrop);
    modalContainer.appendChild(modalContent);

    document.body.appendChild(modalContainer);

    backDrop.addEventListener("click", closeModal);
}

function prepareModalContent(modalContent, data){
    isTaskDeaitlModalActive = true;
    history.pushState(null, null, window.location);

    let modalHeader = document.createElement("h2");
    modalHeader.classList.add("modal-header");
    modalHeader.innerText = "Description"

    let textBox = document.createElement("textarea");
    textBox.classList.add("magnify-txt");
    textBox.setAttribute("readonly", "readonly")
    textBox.value = data.text;

    let modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");

    let close = document.createElement("button");
    close.classList.add("modal-close-btn");
    close.innerText = "Close";

    modalFooter.appendChild(close);
    modalContent.appendChild(modalHeader)
    modalContent.appendChild(textBox);
    modalContent.appendChild(modalFooter);

    close.addEventListener("click", closeModal);
}

function isTaskContentModalOpen(){
    return isTaskDeaitlModalActive;
}

function closeModal() {
    isTaskDeaitlModalActive = false;
    let parent = document.querySelector(".modal-container")
    parent.remove();
}

function handleWindowBackButton(){
    if(isTaskContentModalOpen()){
        closeModal();
    }
}