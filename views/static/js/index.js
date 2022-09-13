var groupDiv = document.querySelector("#group-container");
var userDetails = null;
let emptyDivHtml = `<div class="msg-div" id="emptyDiv">
                        <div class="empty"></div>
                    </div>`;
var currentGroupMembers = [];
var instanceID = null;
var lastMessageId = null;


let url = "http://localhost:4000";
let jwt_token = sessionStorage.getItem('token'); //getCookie('token')
let options = { 
    headers : { 
        authorization : `${jwt_token}` 
    } 
};

// function getCookies() {
//     return document.cookie.split("; ").reduce(function(cookies, token){
//         // split key=value into array
//         var pair = token.split("=");
//         // assign value (1) as object's key with (0)
//         cookies[pair[0]] = decodeURIComponent(pair[1]);
//         // pass through the key-value store
//         return cookies;
//     }, { /* start with empty "cookies" object */ });
// }

// function getCookie(name) {
//     return getCookies()[name];
// }

function togglePopup() {
    document.getElementById("popup-1")
     .classList.toggle("active");
}

async function getMesssages (groupId){
    try {

        if(instanceID){
            clearInterval(instanceID);
        }
        instanceID = setInterval(async ()=>{
    
                let response = await axios.get(`${url}/messages/group/${groupId}?lastMessageId=${lastMessageId}`, options);
                //console.log(response);
                let data = response.data.data;
                for(let i=0;i<data.length;i++){
                    let message = data[i].message;
                    let user = data[i].user;
                    let time = new Date(message.createdAt);
                    let timeText = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;
                    
                    if(message.message == "Joined!" || message.message == "Removed!" || message.message == "Created Group!"){
                        document.querySelector("#add-messages-div").innerHTML += `<div class="notification-div">
                                                                                        <h4 class="notfification">${user.name} ${message.message}</h4>
                                                                                    </div>`;
                    }else if(message.userId == userDetails.id){
                        if(message.message.split(":").includes("img-link")){
                            document.querySelector("#add-messages-div").innerHTML += `<div class="msg-div">
                                                                                    <div class="sent">
                                                                                    <p class="sent-name">${userDetails.name}</p>
                                                                                    <p><a href="${message.message.slice(9)}"><img class="sent-msg" style="max-width: 500px; height: auto;" src="${message.message.slice(9)}"/></a></p>
                                                                                    <p class="sent-time">${timeText}</p>
                                                                                    </div>
                                                                                </div>`
                        }else{
                            document.querySelector("#add-messages-div").innerHTML += `<div class="msg-div">
                            <div class="sent">
                                <p class="sent-name">${userDetails.name}</p>
                                <p class="sent-msg">${message.message}</p>
                                <p class="sent-time">${timeText}</p>
                                </div>
                            </div>`;
                        }
                    }else{
                        if(message.message.split(":").includes("img-link")){
                            document.querySelector("#add-messages-div").innerHTML += `<div class="msg-div">
                                                                                            <div class="received">
                                                                                                <p class="received-name">${user.name}</p>
                                                                                                <p class="received-msg">${message.message}</p>
                                                                                                <p class="received-time">${timeText}</p>
                                                                                            </div>
                                                                                        </div>`;
                        }else{
                            document.querySelector("#add-messages-div").innerHTML += `<div class="msg-div">
                                                                                            <div class="received">
                                                                                                <p class="received-name">${user.name}</p>
                                                                                                <p><a href="${message.message.slice(9)}"><img class="sent-msg" style="max-width: 500px; height: auto;" src="${message.message.slice(9)}"/></a></p>
                                                                                                <p class="received-time">${timeText}</p>
                                                                                            </div>
                                                                                        </div>`;
                        }
                    }
                    
                }
                if(data.length>0){
                    lastMessageId = data[data.length-1].message.id;
                }
                document.querySelector("#emptyDiv").remove();
                document.querySelector("#add-messages-div").innerHTML += emptyDivHtml;
                
    
        }, 1000);
        
    } catch (error) {
        console.log(error);
        alert("Error In Getting New Messages!");
    }
}

async function groupDivClick(id) {
    try {
            lastMessageId = null;
            let data = [];
            let messagesString = localStorage.getItem(id);
            let messagesObj = null;
            if(messagesString){
                messagesObj = JSON.parse(messagesString);
            }
            if(messagesObj){
                lastMessageId = messagesObj.lastMessageId;
                data = messagesObj.data;
            }
            
            //console.log(id);
            if(document.querySelector(".active")){
                document.querySelector(".active").classList.remove("active");
            }
            
            document.querySelector("#hiddenGroupId").value = id;
            let response = null;
            if(lastMessageId){
                response = await axios.get(`${url}/messages/group/${id}?lastMessageId=${lastMessageId}`, options);
            }else{
                response = await axios.get(`${url}/messages/group/${id}`, options);
            }
            //console.log(response);
            if( !response || response.data.success == false){
                console.log(response);
                alert("Error in Getting Messages!");
                return;
            }
            data.push(...response.data.data);
            document.querySelector("#add-messages-div").innerHTML = "";
            for(let i=0;i<data.length;i++){
                let message = data[i].message;
                let user = data[i].user;
                let time = new Date(message.createdAt);
                let timeText = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;
                
                if(message.message == "Joined!" || message.message == "Removed!" || message.message == "Created Group!"){
                    document.querySelector("#add-messages-div").innerHTML += `<div class="notification-div">
                                                                                    <h4 class="notfification">${user.name} ${message.message}</h4>
                                                                                </div>`;
                }else if(message.userId == userDetails.id){
                    if(message.message.split(":").includes("img-link")){
                        document.querySelector("#add-messages-div").innerHTML += `<div class="msg-div">
                                                                                <div class="sent">
                                                                                <p class="sent-name">${userDetails.name}</p>
                                                                                <p><a href="${message.message.slice(9)}"><img class="sent-msg" style="max-width: 500px; height: auto;" src="${message.message.slice(9)}"/></a></p>
                                                                                <p class="sent-time">${timeText}</p>
                                                                                </div>
                                                                            </div>`
                    }else{
                        document.querySelector("#add-messages-div").innerHTML += `<div class="msg-div">
                        <div class="sent">
                            <p class="sent-name">${userDetails.name}</p>
                            <p class="sent-msg">${message.message}</p>
                            <p class="sent-time">${timeText}</p>
                            </div>
                        </div>`;
                    }
                }else{
                    if(message.message.split(":").includes("img-link")){
                        document.querySelector("#add-messages-div").innerHTML += `<div class="msg-div">
                                                                                        <div class="received">
                                                                                            <p class="received-name">${user.name}</p>
                                                                                            <p><a href="${message.message.slice(9)}"><img class="sent-msg" style="max-width: 500px; height: auto;" src="${message.message.slice(9)}"/></a></p>
                                                                                            <p class="received-time">${timeText}</p>
                                                                                        </div>
                                                                                    </div>`;
                    }else{
                        document.querySelector("#add-messages-div").innerHTML += `<div class="msg-div">
                                                                                        <div class="received">
                                                                                            <p class="received-name">${user.name}</p>
                                                                                            <p class="received-msg">${message.message}</p>
                                                                                            <p class="received-time">${timeText}</p>
                                                                                        </div>
                                                                                    </div>`;
                    }
                }
                
            }
            document.querySelector("#add-messages-div").innerHTML += emptyDivHtml;
            if(document.querySelector(".input-container-div")){
                document.querySelector(".input-container-div").remove();
            }
            document.querySelector(".chat-container-div").innerHTML += `<div class="input-container-div">
                                                                            <input type="file" id="file" name="file" style="cursor:pointer;">
                                                                            <button type="button" id="uploadImage">Upload Image</button>
                                                                            <input type="text" name="message" id="msg" placeholder="Send a Message...">
                                                                            <button type="button" id="sendBtn">Send</button>
                                                                        </div>`
            document.querySelector(".chat-container-div").scrollTop = document.querySelector(".chat-container-div").scrollHeight;
            if(data.length>0){
                lastMessageId = data[data.length-1].message.id;
                messagesObj = {
                    lastMessageId : lastMessageId,
                    data : data
                }
                localStorage.setItem(id, JSON.stringify(messagesObj));
            }
            
            //getMesssages(id);
        
    } catch (error) {
        console.log(error);
        alert("Error WhileClicking on group Div")
    }
}

const getClick = async (e) => {
    try{

        if(e.target.id == "logout"){
            let response = await axios.post(`${url}/user/logout`, {}, options);
            console.log(response.data);
            sessionStorage.removeItem('token');
            if(response.data.success == true){
                window.location.replace(`${url}/login.html`);
            }else{
                window.location.replace(`${url}/error.html`);
            }
        }

        if(e.target.id == "createGroup"){
            Swal.fire({
                title: "Create A Group!",
                text: "Write Group Name:",
                input: 'text',
                showCancelButton: true        
            }).then(async (result) => {
                let inputValue = result.value
                if (inputValue === null || result.isDismissed == true) return false;
                
                if (inputValue === "") {
                  swal.showInputError("You need to write something!");
                  return false
                }
                let response = await axios.post(`${url}/groups/create-group`, {name : inputValue},options);4
                if(response.data.success==true){
                    swal.fire("Success!", "Group Created: " + inputValue, "success");

                    let data = response.data.data;
                    let groupName = data.groupDetails.name;
                    if(groupName.length>10){
                        groupName = groupName.slice(0, 10);
                        groupName += "...";
                    }
                    let text = `<div class="group-div" id="${data.groupDetails.id}">
                                <div class="group-content">
                                    <!-- <img class="group-profile-pic" src="./static/img/oshin.jpg"> -->
                                    <h2 class="group-details">${groupName}</h2>
                                </div>
                                <div class="group-extra-content">
                                    <div class="add-to-group"><button class="members-btn" onclick="togglePopup()">Members</button></div>
                                    <div class="delete-group"><button class="delete-group">Delete Group</button></div>
                                </div>
                            </div>`;
                    
                    groupDiv.innerHTML += text;
                    groupDiv.scrollTop = groupDiv.scrollHeight;
                }else{
                    swal.fire("ERROR!", "Group Cannot Be Created: " + inputValue, "warning");
                }
                
              });
        }

        if(e.target.className == "members-btn"){
            currentGroupMembers = [];
            document.querySelector(".members-div").innerHTML = "";
            let groupId = e.target.parentNode.parentNode.parentNode.id;
            document.querySelector("#popupGroupName").innerText = e.target.parentNode.parentNode.parentNode.querySelector(".group-details").innerText;
            let response = await axios.get(`${url}/user-groups/all/${groupId}`, options);
            if(response.data.success == true){
                currentGroupMembers = response.data.data;
            }
            let text = "";
            for(let i=0;i<currentGroupMembers.length;i++){
                if(currentGroupMembers[i].userGroup.isAdmin == true){
                    text += `<div class="member" id="${currentGroupMembers[i].userGroup.id}">
                                    <h2>${currentGroupMembers[i].userDetails.name}</h2>
                                    <p>${currentGroupMembers[i].userDetails.email}</p>
                                    <p>${currentGroupMembers[i].userDetails.phone}</p>
                                    <button class="admin-btn">Remove as Admin</button>
                                    <input type="hidden" class="hiddenAdminRights" value="1">
                                    <button class="remove-user-btn">Remove</button>
                                </div>`;
                }else{
                    text += `<div class="member" id="${currentGroupMembers[i].userGroup.id}">
                                <h2>${currentGroupMembers[i].userDetails.name}</h2>
                                <p>${currentGroupMembers[i].userDetails.email}</p>
                                <p>${currentGroupMembers[i].userDetails.phone}</p>
                                <button class="admin-btn">Set as Admin</button>
                                <input type="hidden" class="hiddenAdminRights" value="0">
                                <button class="remove-user-btn">Remove</button>
                            </div>`;
                }
            }

            document.querySelector(".members-div").innerHTML = text;
        }

        if(e.target.className == "add-to-group-btn"){
            let groupId = currentGroupMembers[0].userGroup.groupId;
            let userId = e.target.parentNode.id;
            console.log(groupId, userId);
            let response = await axios.post(`${url}/user-groups/addUserGroup`, { userId : userId, groupId : groupId}, options);
            if(response.data.success == true){
                let userName = e.target.parentNode.querySelector(".name").innerText;
                let userEmail = e.target.parentNode.querySelector(".email").innerText;
                let userPhone = e.target.parentNode.querySelector(".phone").innerText;
                let text = `<div class="member" id="${userId}">
                                <h2>${userName}</h2>
                                <p>${userEmail}</p>
                                <p>${userPhone}</p>
                                <button class="admin-btn">Set as Admin</button>
                                <input type="hidden" class="hiddenAdminRights" value="0">
                                <button class="remove-user-btn">Remove</button>
                            </div>`
                document.querySelector(".members-div").innerHTML += text;
                e.target.parentNode.remove();
                alert("Added Successfully!");
            }else{
                alert("Error Adding User!");
            }
        }

        if(e.target.className == "delete-group"){
            let groupId = e.target.parentNode.parentNode.parentNode.id;
            console.log(groupId);
            let response = await axios.delete(`${url}/groups/${groupId}`, options);
            if(response.data.success == true){
                e.target.parentNode.parentNode.parentNode.remove();
                if(document.querySelector(".active")){
                    document.querySelector(".active").classList.remove("active");
                }
                document.querySelector("#add-messages-div").innerHTML = "";
                document.querySelector(".chat-container-div").innerHTML = `<div class="add-messages-div" id="add-messages-div"></div>`;
                Swal.fire("Group Deleted Successfully!");
            }else{
                alert("Error While Deleting! Please Try Again Later.")
            }
        }

        if(e.target.className == "group-div"){
            let id = e.target.id;
            e.target.classList.add("active");
            groupDivClick(id);

        }

        if(e.target.className == "group-content"){
            let id = e.target.parentNode.id;
            e.target.parentNode.classList.add("active");
            groupDivClick(id);
        }

        if(e.target.className == "group-details"){
            let id = e.target.parentNode.parentNode.id;
            e.target.parentNode.parentNode.classList.add("active");
            groupDivClick(id);
        }

        if(e.target.id == "sendBtn"){
            let text = document.querySelector("#msg").value;
            //console.log(text);
            let groupId = document.querySelector("#hiddenGroupId").value;
            let response = null;
            if(text == ""){
                alert("Please Enter A Message!");
                return;
            }else{
                let body = {
                    groupId : groupId,
                    message : text
                }
                response = await axios.post(`${url}/messages/addMessage`, body, options);
            }

            if(response){
                //console.log(response);
                let message = response.data.data;
                let time = new Date(message.createdAt);
                let timeText = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;
                document.querySelector("#emptyDiv").remove();
                document.querySelector("#add-messages-div").innerHTML += `<div class="msg-div">
                                                                            <div class="sent">
                                                                            <p class="sent-name">${userDetails.name}</p>
                                                                            <p class="sent-msg">${message.message}</p>
                                                                            <p class="sent-time">${timeText}</p>
                                                                            </div>
                                                                        </div>` + emptyDivHtml;
                document.querySelector(".chat-container-div").scrollTop = document.querySelector(".chat-container-div").scrollHeight

                lastMessageId = message.id;

            }
            document.querySelector("#msg").value = "";
        }

        if(e.target.className == "remove-group"){
            let groupId = e.target.parentNode.parentNode.parentNode.id;
            console.log(groupId);
            let response = await axios.delete(`${url}/user-groups/deleteByGroupId/${groupId}`, options);
            console.log(response);
            if(response.data.success == true){
                e.target.parentNode.parentNode.parentNode.remove();
                if(document.querySelector(".input-container-div")){
                    document.querySelector(".input-container-div").remove();
                }
                document.querySelector("#add-messages-div").innerHTML = "";
                alert("Group Removed!");
            }else{
                alert("Group Cannot Be Removed!");
            }
            
        }

        if(e.target.className == "admin-btn"){
            let userGroupId = e.target.parentNode.id;
            let adminValue = e.target.parentNode.querySelector(".hiddenAdminRights").value;
            let isAdmin = adminValue == "1" ? true : false;
            let response = await axios.post(`${url}/user-groups/setAdmin`, {userGroupId : userGroupId, isAdmin : isAdmin}, options);
            if(response.data.success == true){
                if(isAdmin == true){
                    e.target.innerText = "Set as Admin";
                    e.target.parentNode.querySelector(".hiddenAdminRights").value = "0";
                    alert("Administrator Rights Removed!");
                }else{
                    e.target.innerText = "Remove as Admin";
                    e.target.parentNode.querySelector(".hiddenAdminRights").value = "1";
                    alert("Administrator Rights Provided!");
                }
                
            }else{
                alert("Something Went Wrong While Assigning Admin-Rights!");
            }
        }

        if(e.target.id == "searchBtn"){
            document.querySelector(".search-container").innerHTML = "";
            let searchText = document.querySelector("#searchBox").value;
            if(searchText == ""){
                return;
            }
            let searchType = document.querySelector("#selectBox").value;
            let response = await axios.post(`${url}/user/getByType`,{ searchText : searchText, searchType : searchType});
            let users = response.data.data;
            let text = "";
            for(let i=0;i<users.length;i++){
                let check = false;
                for(let j=0;j<currentGroupMembers.length;j++){
                    if(currentGroupMembers[j].userDetails.id == users[i].id){
                        check = true;
                        break;
                    }
                }
                if(check == true){
                    text += `<div class="user" id="${users[i].id}">
                            <h2 class="name">${users[i].name} (Member)</h2>
                            <p class="email">${users[i].email}</p>
                            <p class="phone">${users[i].phone}</p>
                        </div>`
                }else{
                    text += `<div class="user" id="${users[i].id}">
                            <h2 class="name">${users[i].name}</h2>
                            <p class="email">${users[i].email}</p>
                            <p class="phone">${users[i].phone}</p>
                            <button class="add-to-group-btn" >Add</button>
                        </div>`
                }
            }
            document.querySelector(".search-container").innerHTML = text + `<button class="second-button" style="cursor:pointer;" id="searchCancel">Close Search</button>`;
            document.querySelector("#searchBox").value = "";
            document.querySelector("#selectBox").value = "name";
            document.querySelector("#searchBtn").style.display = "none"; 
        }

        if(e.target.className == "remove-user-btn"){
            let userGroupId = e.target.parentNode.id;
            console.log(userGroupId);
            let response = await axios.delete(`${url}/user-groups/delete/${userGroupId}`, options);
            if(response.data.success == true){ 
                alert("Removed Successfully!");
                e.target.parentNode.remove();
            }else{
                alert("User Cannot Be Removed! Try Again Later.");
            }
        }

        if(e.target.id == "searchCancel"){
            document.querySelector(".search-container").innerHTML = "";
            document.querySelector("#searchBtn").style.display = "initial"; 
        }

        if(e.target.id == "uploadImage"){
            let groupId = document.querySelector("#hiddenGroupId").value;
            var formData = new FormData();
            var imagefile = document.querySelector('#file');
            if(imagefile == "" || !imagefile){
                return;
            }
            formData.append("image", imagefile.files[0]);
            options = { 
                headers : { 
                    authorization : `${jwt_token}`,
                    'Content-Type': 'multipart/form-data'
                } 
            };
            Swal.fire({
                title: 'Wait ...',
                onBeforeOpen () {
                  Swal.showLoading ()
                },
                onAfterClose () {
                  Swal.hideLoading()
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            })
            let response  = await axios.post(`${url}/messages/upload-image?groupId=${groupId}`, formData, options);
            console.log(response);
            Swal.close();
            options = { 
                headers : { 
                    authorization : `${jwt_token}` 
                } 
            };
            if(response.data.success == true){
                //console.log(response);
                let message = response.data.data;
                let time = new Date(message.createdAt);
                let timeText = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;
                document.querySelector("#emptyDiv").remove();
                document.querySelector("#add-messages-div").innerHTML += `<div class="msg-div">
                                                                            <div class="sent">
                                                                            <p class="sent-name">${userDetails.name}</p>
                                                                            <p><a href="${message.message.slice(9)}"><img class="sent-msg" style="max-width: 500px; height: auto;" src="${message.message.slice(9)}"/></a></p>
                                                                            <p class="sent-time">${timeText}</p>
                                                                            </div>
                                                                        </div>` + emptyDivHtml;
                document.querySelector(".chat-container-div").scrollTop = document.querySelector(".chat-container-div").scrollHeight

                lastMessageId = message.id;

            }else{
                alert("Image Could Not Be Uploaded!")
            }
            document.querySelector('#file').value ="";
        }

    }catch(error){
        alert("ERROR:", error);
        console.log(error);
    }
}


let loadGroups = async (e) => {
    e.preventDefault();
    try {
        //console.log(sessionStorage.getItem('token'));
        if(!sessionStorage.getItem('token')){
            window.location.replace(`${url}/login.html`);
            return;
        }
        let response = await axios.get(`${url}/user-groups/all`, options);
        if(response.data.success == false){
            swal.fire("Error in Response!")
            return;
        }
        //console.log(response.data);
        userDetails = response.data.user;
        document.querySelector("#navDiv").innerHTML = `<div class="nav-user-div"><img src="https://media-exp1.licdn.com/dms/image/C4D12AQHeCRo1KD6kiw/article-cover_image-shrink_600_2000/0/1520185441093?e=2147483647&v=beta&t=TblcRLcNS8m_4gEy-j_pazTFTUWm3xySdqk4BXG61sw"><h2 id="username">${userDetails.name}</h2></div>
                                                            <div class="create-group"><button id="createGroup">Create Group</button></div>
                                                            <div class="logout-div">
                                                            <button id="logout" type="button">Log-Out</button>
                                                        </div>`

        let data = response.data.data;
        for(let i=0;i<data.length;i++){
            //console.log(data[i]);
            let groupName = data[i].groupDetails.name;
            if(groupName.length>16){
                groupName = groupName.slice(0, 10);
                groupName += "...";
            }
            let text = "";
            if(data[i].userGroup.isAdmin == true){
                text = `<div class="group-div" id="${data[i].groupDetails.id}">
                            <div class="group-content">
                                <!-- <img class="group-profile-pic" src="./static/img/oshin.jpg"> -->
                                <h2 class="group-details">${groupName}</h2>
                            </div>
                            <div class="group-extra-content">
                                <div class="add-to-group"><button class="members-btn" onclick="togglePopup()">Members</button></div>
                                <div class="delete-group"><button class="delete-group">Delete Group</button></div>
                            </div>
                        </div>`;
            }else{
                text = `<div class="group-div" id="${data[i].groupDetails.id}">
                            <div class="group-content">
                                <!-- <img class="group-profile-pic" src="./static/img/oshin.jpg"> -->
                                <h2 class="group-details">${groupName}</h2>
                            </div>
                            <div class="group-extra-content">
                                <div class="delete-group"><button class="remove-group">Remove Group</button></div>
                            </div>
                        </div>`;
            }
            
            groupDiv.innerHTML += text;
        }
        
    } catch (error) {
        console.log(error);
        alert("Something Went Wrong! Check Console and Reload!");
       // window.location.replace(`${url}/login.html`);
    }
}


document.addEventListener("DOMContentLoaded",loadGroups);
document.addEventListener("click", getClick)