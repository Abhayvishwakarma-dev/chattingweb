// //const express=require("express")
// import express from "express" 
// app=express()

// app.listen(3000,()=>{
//     console.log("server at port no 3000")
// })



import express from "express";



const app = express();

app.use(express.json());
app.get("/",(req,res)=>{
    console.log("sever is running");
    res.send("sererv one get");
});
app.listen(3000, () => {
  console.log("server at port no 3000");
});




