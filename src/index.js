const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task') 


const app = express()
const port = process.env.PORT

//////////////////////////////////////////////////////////////////////
/*
const multer = require('multer')

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000 //1 mega byte 
    },
    fileFilter(req, file, cb) {// cb is the callback function

        // if(!file.originalname.endsWith('.pdf')){ //only for identifuying PDF
            if(!file.originalname.match(/\.(doc|docx)$/)){ 
            return cb(new Error('Please upload a word document'))//id file is not a supportedd format only
        }

        //regular expressions source --> regex101.com
        
        cb(undefined, true)
        
    }
})

// const errorMiddleWare = (req,res,next) =>{

//     throw Error('From Middleware')
    
// }

app.post('/upload', upload.single('upload'), (req,res) => {
// app.post('/upload', errorMiddleWare, (req,res) => {
res.send() 
}, (error,req,res,next) => {

    res.status(400).send({error: error.message})

})
*/
//////////////////////////////////////////////////////////////////////

// app.use((req,res,next) => {
    
//     if(req.method === 'GET') {
//         res.send('GET request are disabled')
//     }else{ 
//         next()
//     }   
// })

//during maintainance shut down all http requests
// app.use((req,res,next)=>{

//     res.status(503).send('Site is under maintainance!! Please try back soon')

// })


//to get the client side data in parsed json format
app.use(express.json())


// const router = new express.Router()
// router.get('/test',(req,res)=>{
//     res.send("new router registered")
// })
// //registrering the new router
// app.use(router)

app.use(userRouter)
app.use(taskRouter)

// without middleware = new request => route handler assignes it appropriate router
// with middleware: new request =>do something => run route handler


app.listen(port, () => {
    console.log('Server is up on port '+port);
})

/*
//hashing ->irreversible
//encryption => reverrsible
const bcrypt = require('bcrypt')

const myFunction = async() =>{
    const password = 'whatsapp'
    const hashedPassword = await bcrypt.hash(password, 8)

    // console.log(password);
    // console.log(hashedPassword);

    //compare if password is in database
    const isMatch = await bcrypt.compare(password, hashedPassword)
    console.log(isMatch);

}

myFunction()

*/

/*
//json web token
const jwt = require('jsonwebtoken')

const myFunction = async () => {

    const token = jwt.sign({ _id: '6031f17466cb895ab83649bd'}, 'thisismynewcourse', {expiresIn: '2 days'})
    console.log(token);

    const data = jwt.verify(token, 'thisismynewcourse')
    console.log(data);
} 

myFunction()

//3 parts of token
// base64 encoded json string =>called header => contains meta info about what type of tken and the algo taken
// base 64 encoded json string =>payload or body => data provided(id in our case)
// signature => used to verify the token

//whole point of token is not to hide data but to verify the given oject data via the given sectret string 'thisismynewcourse'
//the token body is actually decodable to get it obj info and is publically accessible
//www.base64decode.org
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDMxZjE3NDY2Y2I4OTVhYjgzNjQ5YmQiLCJpYXQiOjE2MTM5MzY2NDh9.JUWMFpSQR5rltwt5ikR6_SMe8Npx4dk5LrnB2IE215k
*/

// const pet = {
//     name:"bull"
// }
// pet.toJSON = function () {
//     // console.log(this);
//     return {}
// }
// console.log(JSON.stringify(pet));


// const main = async () => {
//     // const task  = await Task.findById('60337a61cc21312c48001400')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner);


//     const user =await User.findById('6033794bc08fb371e4f1048d')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks);//null
// }

// main()

