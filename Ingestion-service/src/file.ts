import fs from 'fs';
import path from 'path';

export const getALLFiles=(folderPath:string)=>{
    let response:string []=[];
     const allFilesandFolder=fs.readdirSync(folderPath);
     allFilesandFolder.forEach(file => {
        const fullFilepath=path.join(folderPath,file);
        if(fs.statSync(fullFilepath).isDirectory()){
            response=response.concat(getALLFiles(fullFilepath))
        }else{
        response.push(fullFilepath);

        }
        
     });
     return response;

}