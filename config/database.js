const mongoose =  require('mongoose')
const { MONGO_URL } = process.env

const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

exports.connect = () =>{
    //connecting to database 
    mongoose.connect(MONGO_URL,option)
    .then(()=>{
        console.log("Successfully connected to database");
    })
    .catch((error)=>{
        console.log("Database connection failed.")
        console.error(error)
    })
}