const name = document.querySelector("#name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const password = document.querySelector("#password");
const cpassword = document.querySelector("#cpassword");
const signupBtn = document.querySelector("#signup-btn");
const login = document.querySelector("#login");
const formDiv = document.querySelector("#form-div");
const msg = document.querySelector("#msg");

let url = "http://18.237.47.157:4000";

let verifyEmail = async () => {
    try{
        let response = await axios.post(`${url}/user/verify-email`,{email : email.value});
        console.log(response);
        if(response.data.success == true){
            return true;
        }
        return false;
    }catch(err){
        console.log(err);
    }
}

formDiv.addEventListener("click", async (e) => {
    e.preventDefault();
    try{
        if(e.target.id=="signup-btn"){
            console.log("clicked");
            if(name.value == ""){
                msg.innerHTML = "<p style='color : red'>'Name' field should not be empty!</p>";
            }else if(email.value == ""){
                msg.innerHTML = "<p style='color : red'>'Email' is necessary for Login!</p>";
            }else if(await verifyEmail()){
                msg.innerHTML = "<p style='color : red'>User with this 'Email' already exists!</p>";
            }else if(phone.value==""){
                msg.innerHTML = "<p style='color : red'>Please enter a 'Phone Number!'</p>";
            }else if(password.value == ""){
                msg.innerHTML = "<p style='color : red'>Please enter a 'Password!'</p>";
            }else if(cpassword.value == ""){
                msg.innerHTML = "<p style='color : red'>'Confirm Password' in-order to continue!</p>";
            }else if(cpassword.value != password.value){
                msg.innerHTML = "<p style='color : red'>'Confirm Password' is not matching your 'Password'!</p>";
            }else{

                let requestBody = {
                    name : name.value,
                    email : email.value,
                    password : password.value,
                    phone : phone.value
                }
        
                let response = await axios.post(`${url}/user/add-user`, requestBody);
                console.log(response);
                name.value="";
                email.value="";
                password.value = ""
                cpassword.value=""
                if(response.data.success == true){
                    alert("Successfully Signed-Up!");
                    window.location.replace(`${url}/login.html`);
                }else{
                    msg.innerHTML = "<p style='color : red'>ERROR in Response : Please Try Again!</p>"
                }
            }
        }

        if(e.target.id=="login"){
            window.location.replace(`${url}/login.html`);
        }
    }catch(err){
        console.log(err);
    }
});


