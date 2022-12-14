const express = require("express");
const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
var fileupload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./utils/database");
const User = require("./models/user");
const ForgotPasswordRequest = require("./models/forgot-password-request");
const Group = require("./models/group");
const Message = require("./models/message");
const UserGroup = require("./models/user-group");
const userRoutes = require("./routes/user-routes");
const forgotPasswordRequestRoutes = require("./routes/forgot-password-routes");
const groupRoutes = require("./routes/group-routes");
const messageRoutes = require("./routes/message-routes");
const userGroupRoutes = require("./routes/user-group-routes");

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,"access.log"),
    {flags : "a"}
);

const app = express();
app.use(cors());
// app.use(helmet({
//     contentSecurityPolicy: false,
//   }));
app.use(morgan("combined", { stream : accessLogStream}));
app.use(fileupload());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, `views`,`static`)));



User.hasMany(ForgotPasswordRequest);
User.hasMany(Message);
User.hasMany(UserGroup);
Group.hasMany(Message);
Group.hasMany(UserGroup);
UserGroup.belongsTo(User, {contraints : true, onDelete : "CASCADE"});
UserGroup.belongsTo(Group, {contraints : true, onDelete : "CASCADE"})
Message.belongsTo(User, {contraints : true, onDelete : "CASCADE"});
Message.belongsTo(Group, {contraints : true, onDelete : "CASCADE"});
ForgotPasswordRequest.belongsTo(User, {contraints : true, onDelete : "CASCADE"});


let authenticateToken = async (req, res, next) => {
    try{
        //console.log(req.headers);
        const token = req.headers['authorization'];
        //console.log(req.headers);
        if (token == null){
            throw undefined;
        }
        if(req.user == null){
            const  userId = Number(jwt.verify(token, process.env.TOKEN_SECRET));
            const user = await User.findByPk(userId);
            req.user = user;
        }
        next();
    }catch(err){
        console.log(err);
        res.status(404).json({success : false, data : "Token or User Authentication Error!"});
    }
}
app.use("/user",userRoutes);
app.use("/password", forgotPasswordRequestRoutes);
app.use("/messages", authenticateToken, messageRoutes);
app.use("/groups", authenticateToken, groupRoutes);
app.use("/user-groups", authenticateToken, userGroupRoutes);

app.use((req, res, next)=>{
    try{
        let url = req.url.split("/");
        console.log(url);
        if(url[url.length-1]==""){
            res.sendFile(path.join(__dirname,`views`,`index.html`));
        }else{
            res.sendFile(path.join(__dirname,`views`,`${url[url.length-1]}`));
        }
    }catch(error){
        res.status(404).sendFile(path.join(__dirname),`views`,`error.html`);
    }
});


app.use((req, res)=>{
    res.status(404).sendFile(path.join(__dirname),`views/error.html`);
});

sequelize.sync().then(() => {
    app.listen(process.env.PORT || 4000);
}).catch(err => console.log(err));