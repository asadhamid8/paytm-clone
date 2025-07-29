const express = require('express');
const zod=require('zod');
const router = express.Router();
router.use(express.json());

const jwt= require('jsonwebtoken');
const jwtsecret = require('../config');
const middleware=require('./middleware')

const { userdbmodel, accountmodel } = require('../db');
const usersignschema=zod.object({

     email:zod.string().email().min(6),
    password:zod.string().min(6).max(12)
})
const userschema= zod.object({
    firstname:zod.string().min(3),
    lastname:zod.string(),
    email:zod.string().email().min(6),
    password:zod.string().min(6).max(12)
})


router.post('/signup',async (req,res)=>{
    
    const signupdata=req.body;
    try{
        const parseddata=userschema.parse(signupdata);
        const user= await userdbmodel.find({email:parseddata.email});
        if(user.length>0)
        {res.send("user already exists") 
        }
        else
        {
           const user1= new userdbmodel({
            firstname:parseddata.firstname,
            lastname:parseddata.lastname,
            email:parseddata.email,
            password:parseddata.password    })
            const savedUser = await user1.save()
            const encodedid=jwt.sign({userid:savedUser._id
            },jwtsecret)

             const account1= new accountmodel({
                userid:user1._id,
                balance: 500
            })
            const savedaccount=await account1.save();
            console.log(savedaccount);

            res.status(201).json({
             message: 'User created successfully',
            token: encodedid
            }); 

           
        }
    }
    catch(error){        
        res.status(411).send('incorrect input format')
                 }
})




router.post('/signin',async (req,res)=>{

const signeddata=req.body;
console.log(signeddata);
 try{
;
        const parseddata=usersignschema.parse(signeddata);
            console.log(parseddata);
        const user=await userdbmodel.find({email:parseddata.email});
        console.log(user);
    if(user.length>0)
    {

        console.log(typeof(signeddata.password));

        console.log(typeof(user.password));
        if(signeddata.password==user[0].password)
        {
          const jwttoken= jwt.sign({userid:user[0]._id},jwtsecret);
          res.json({ token: jwttoken });
        }
        else
        {
            res.status(401).json({ message: 'Incorrect password' });
        }


    }
    else
    {res.status(404).json({ message: 'User does not exist' })}

}
catch(error)
{
    res.status(411).send('invalid inputs ( password or email format )');
}

})

const updateBody = zod.object({
	
     firstname: zod.string().optional(),
    lastname: zod.string().optional(),
    password: zod.string().min(6).optional()
   
})

router.put('/update',middleware,async (req,res)=>
{
try {

    
    
    
    const parsedData = updateBody.parse(req.body); 
   
    const userId = req.user.userid;

    
    if (Object.keys(parsedData).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    
    const updatedUser = await userdbmodel.findByIdAndUpdate(
      userId,
      parsedData,
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      updatedUser
    });
  } catch (error) {
   
    res.status(411).json({ message: "Error while updating information"});
  }
    
})


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await userdbmodel.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            email: user.email,
            firstName: user.firstname,
            lastName: user.lastname,
            _id: user._id
        }))
    })
})

module.exports = router;