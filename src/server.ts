import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

app.listen(3005,()=>{
    console.log("3005 Port Is Running");
});