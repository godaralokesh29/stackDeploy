import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();



import {getALLFiles} from "./file";
import {uploadFile} from "./aws"

console.log({
  region: process.env.AWS_REGION,
  accessKeyExists: !!process.env.AWS_ACCESS_KEY_ID,
  secretExists: !!process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyLength: process.env.AWS_ACCESS_KEY_ID?.length,
  secretLength: process.env.AWS_SECRET_ACCESS_KEY?.length,
});



const app =express();


app.use(cors());
app.use(express.json());

app.post("/deploy",async (req,res)=>{
    const repoUrl=req.body.repoUrl;
    const id=generate()
    await simpleGit().clone(repoUrl,path.join(__dirname,`output/${id}`))
    const file = getALLFiles(path.join(__dirname,`output/${id}`))
    
    const rootFolder = path.join(__dirname, `output/${id}`);
    for (const filePath of file) {
    const relativePath = path.relative(rootFolder, filePath);

    await uploadFile(
        `${id}/${relativePath}`,
        filePath
    );
}

    publisher.lPush("build-queue", id);
    console.log(file)

    res.json({id})
    
})

app.listen(3000)