
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {

    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})


//basic version of user model


//basic version of task model



// const task = new Task({
//     description:'water the plants      ',
    
// })


// task.save().then(() => {

//     console.log(task);

// }).catch((error) => {

//     console.log(error);

// }) 


