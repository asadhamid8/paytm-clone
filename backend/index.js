const express = require("express");
const rootrouter=require('./routes/index')
const App= express();

const cors=require("cors");

App.use(cors());
App.use(express.json())



App.use("/api/v1",rootrouter)



App.listen(3000, (error)=>{
    if(!error)
    {console.log('backend listening on port 3000')}
    else
    console.log(error);
});


