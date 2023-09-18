const mongoose = require("mongoose");


const mongodbURL = "mongodb+srv://vipunsanjana34:vipun1234@cluster0.xkoqeyo.mongodb.net/healthcenter?retryWrites=true&w=majority";
mongoose.connect(mongodbURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const connection = mongoose.connection;

connection.once("open",()=>{
    console.log("mongo db connected");
})

connection.on('error', (error) => {
    console.log("Error Connection mongo db" , error);
})

mongoose.exports = mongoose;