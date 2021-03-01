const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async(req,res) => {

    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,//es6 spread operator => copy all data  of req.body to this current object
        owner: req.user._id
    })

    // task.save().then(() => {

    //     res.status(201).send(task)

    // }).catch((e) => {

    //     res.status(400).send(e)
    // })

    try{
        await task.save()
        res.status(201).send(task)

    }catch (e) {

        res.status(400).send(e)
    }

})



//GET /tasks?completed=true

//2 new options for pagination => limit and skip
//GET /tasks?limit=10&skip=0 //get 1st 10 resluts
//GET /tasks?limit=10&skip=10 // gtelist of 10 after skipping 10 results
//GET /tasks?sortBy=createdAt:asc or :desc //can use any special character
router.get('/tasks', auth,async (req,res) => {

    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e) => {
    //     //internal server error like server connection lost
    //     res.status(500).send(e)
    // })

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed =  req.query.completed === 'true'
    }

    if(req.query.sortBy){

        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }


    try{
        // const tasks = await Task.find({owner: req.user._id})
        // res.send(tasks)

        //--->below line does exact same work as above

        // await req.user.populate('tasks').execPopulate()// send all tasks
        // res.send(req.user.tasks)

        //filtering tasks
        await req.user.populate({
            path: 'tasks',
            // match: {
            //     completed: false //only completed taska will get returned
            // }
            match,
            options: {
                limit: parseInt(req.query.limit),//only if limit is provided then only this will apply .. otherwise it will ignored by mongoose
                skip: parseInt(req.query.skip),
                // sort: {
                //     // createdAt: -1 //descending fashion
                //     // completed: -1 //completed tasks shown first
                // }
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)

    }catch (e) {

        res.status(500).send()
    }
})

router.get('/tasks/:id', auth,async(req,res) => {
    const _id =  req.params.id 

    // Task.findById(_id).then( (task) => {
    //     //if there is no user
    //     if(!task){
            
    //         return res.status(404).send()
    //     }
    //     res.send(task)

    // }).catch((e) => {

    //     res.status(500).send(e)
    // })

    try{

        // const task = await Task.findById(_id)

        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task){
        return res.status(404).send()
        }
        res.send(task)

    }catch (e) {

        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth, async (req,res)=>{

    const updates= Object.keys(req.body)//converts body objects to its string form of keys only
    const allowedUpdates = ["description", "completed"]

    const isValidOperation = updates.every((update)=>{

        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid Updates"})
    }

    
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        // const task = await Task.findById(req.params.id)
        const task =await Task.findOne({_id:req.params.id, owner: req.user._id})

        if(!task)
        {
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            //update coming is a string . thus we cant use user.update like user.name
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)

    } catch (e) {
        
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req,res)=>{
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task =await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})


        if(!task){
            return res.status(404).send()
        }

        res.send(task)

    } catch (e) {
        
        res.status(500).send(e)
    }
})




module.exports = router