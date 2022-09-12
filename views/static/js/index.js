
//let totalExpenseDiv = document.querySelector("#total-expense"); // ****ERROR : Causing PassByValue
var msg = document.getElementById("msg");
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

let url = "http://54.159.134.29:4000";
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



const getClick = async (e) => {
    e.preventDefault()
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

    }catch(error){
        alert("ERROR:", error);
        console.log(error);
    }
}


let loadChats = async (e) => {
    e.preventDefault();
    try {
        //console.log(sessionStorage.getItem('token'));
        // if(!sessionStorage.getItem('token')){
        //     window.location.replace(`${url}/login.html`);
        //     return;
        // }
        
        
    } catch (error) {
        console.log(error);
        alert("Something Went Wrong! Check Console and Reload!");
       // window.location.replace(`${url}/login.html`);
    }
}


document.addEventListener("DOMContentLoaded",loadChats);
document.addEventListener("click", getClick)