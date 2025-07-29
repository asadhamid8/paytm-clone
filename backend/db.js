const mongoose = require('mongoose')



async function connecttodb(){
try
{
   const res=await mongoose.connect('mongodb+srv://asadhamid8:koauTYF2OPXBoaeE@cluster0.7qpnn4t.mongodb.net/paytm')
  console.log('connected to db');
}
catch(error)
{
console.log('failed to connect to db')
}
}

connecttodb();


const userschema= new mongoose.Schema({

    firstname: String,
    lastname:String,
    email:String,
    password:String

})

const userdbmodel= mongoose.model('userdbmodel',userschema);
const accountschema= new mongoose.Schema({
userid:{
  type:mongoose.Schema.Types.ObjectId,
  ref: 'userdbmodel' ,
required:true
},  
balance:{
  type:Number,
  required:true
}
})

const accountmodel= mongoose.model('accountmodel',accountschema);




module.exports={accountmodel,userdbmodel};
// const user1= new usermodel(
//     {firstname:"asad",
//         lastname:"hamid",
//         email:"aaltufaltu@gmail.com"

//     }
// )

// user1.save();