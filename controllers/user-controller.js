const UserService = require("../services/user-services");
const jwt = require('jsonwebtoken'); //require('crypto').randomBytes(64).toString('hex') --> type in node
const bcrypt = require('bcrypt');
const saltRounds = 10;


const userService = new UserService();
function generateAccessToken(userId) {
    return jwt.sign(userId, process.env.TOKEN_SECRET, {});
}

exports.loginUserByEmailAndPassword = async (req, res, next) => {
    try {
        let body = req.body;
        console.log(body);
        let user = await userService.findUserByEmail(body.email);
        if(user!=null){
            const token = generateAccessToken(user.id);
            res.json({success : true, token : token});
        }else{
            res.status(404).json({success : false, data : "Email or Password Invalid!"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success : false, data : "Internal Server Error!"});
    }
}

exports.getUsersByType = async (req, res, next)=>{
    try {
        let searchText = req.body.searchText;
        let searchType = req.body.searchType;
        console.log(searchText, searchType);
        let response = [];
        let users = await userService.getAllUsers();
        if(searchType == "name"){
            for(let i=0;i<users.length;i++){
                if(users[i].name.toUpperCase().includes(searchText.toUpperCase())){
                    response.push(users[i]);
                }
            }
        }else if(searchType == "email"){
            for(let i=0;i<users.length;i++){
                if(users[i].email.toUpperCase().includes(searchText.toUpperCase())){
                    response.push(users[i]);
                }
            }
        }else if(searchType == "phone"){
            for(let i=0;i<users.length;i++){
                if(users[i].phone.includes(searchText)){
                    response.push(users[i]);
                }
            }
        }
        res.json({success : true, data : response});

    } catch (error) {
        console.log(error);
        res.status(500).json({success : false});
    }
}

exports.addUser = async (req, res, next ) => {
    try {

        let body = req.body;
        console.log(body);
        let passwordHash = await bcrypt.hash(body.password, saltRounds);
        let response  = await userService.addUser(body.name, body.email, passwordHash, body.phone);
        res.json({success : true, data : response});
        
    } catch (error) {
        console.log(error);
        res.status(404).json({success : false, data : error});
    }
}

exports.logoutUser = async (req, res, next) => {
    try{
        req.user = null;
        res.json({success : true});
    }catch(error){
        console.log(error);
        res.status(404).json({success : false, data : error});
    }
}

exports.checkUserExists = async (req, res, next) => {
    try{
        let body = req.body;
        let users = await userService.findUserByEmail(body.email);;
        //console.log(users)
        if(users.length>0){
            res.json({success: true});
        }else{
            res.json({success : false, data : "User Not Found!"});
        }

    }catch(error){
        console.log(error);
        res.status(500).json({success : false, data : "Server Error"})
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error);
    }
} 

exports.deleteUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error);
    }
}