require("dotenv").config();
require("./config/database").connect()
const express = require("express");
 
const bcrypt =  require('bcrypt')
const jwt =  require('jsonwebtoken')
const app = express();
const User =  require("./models/userModel")
app.use(express.json());

const auth = require("./middleware/auth");
const saltRounds = 10;
 
app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.post("/register", async (req,res)=>{

try{
    const {first_name,  last_name,  email, password } = req.body

    email == email.toLowerCase()
    password  ==  password.toLowerCase()
    last_name == last_name.toLowerCase()
    first_name  == first_name.toLowerCase()

    if (!(email && password && first_name && last_name )){
        res.status(400).send("All input is required")
    }

    const oldUser = await User.findOne({email});

    if (oldUser){
        return res.status(409).send("User Already Exist")
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    encryptedPassword = bcrypt.hashSync(password, salt);

    const user =  await User.create({
        first_name,last_name,email: email.toLowerCase(),
        password: encryptedPassword,
    })
     
    const token =  jwt.sign(
        {user_id: user._id,email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );

    user.password = undefined;
    user.token = token;
    res.status(201).json(user)
}
    catch(err){
            console.log(err)
    }
})

app.post("/login", async(req,res)=>{

try{
    const { email, password } =  req.body

    email == email.toLowerCase()
    password  ==  password.toLowerCase()

    if (!(email && password)){
        res.status(400).send("All input is required")
    }

    const user = await User.findOne({email : email})

    if( user && (await bcrypt.compare(password,user.password))){
        const token = jwt.sign(
            { user_id : user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }   
        );
        user.token = token;
        user.password =  undefined;
        res.status(200).json(user);
    }
}
catch(err){
    console.log(err) 
}
})


module.exports = app
