const MAX_LEN=5;

 export function generate() {
    let ans="";
    let string ="123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i=0;i<MAX_LEN;i++){
        ans+=string.charAt(Math.floor(Math.random() * string.length));
    }
    return ans;

}