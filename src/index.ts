import express from "express";
import cors from "cors";

const app =express();

app.listen(3000)
app.use(cors());
app.use(express.json());

app.post("deploy",async (req,res)=>{
    const repoUrl=req.body.repoUrl;
    
})

app.use()