import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import {getALLFiles} from "./file";


const app =express();


app.use(cors());
app.use(express.json());

app.post("/deploy",async (req,res)=>{
    const repoUrl=req.body.repoUrl;
    const id=generate()
    await simpleGit().clone(repoUrl,path.join(__dirname,`output/${id}`))
    const file = getALLFiles(path.join(__dirname,`output/${id}`))
    //put this in S3
    console.log(file)

    res.json({id})
    
})

app.listen(3000)