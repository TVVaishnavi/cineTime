const trainService = require("../../service/travels/train")
const Train = require("../../model/travels/train")

const createTrain = async(req, res)=>{
    try {
        const trainData = req.body
        const trainNumber = trainData.trainNumber
        const existingTrain = await Train.findOne({trainNumber})

        if(existingTrain){
            res.json({message: "train already existed"})
        }else{
            const train = await trainService.createTrain(trainData)
            res.status(201).json({train, message : "train created successfully"})
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const deleteTrain   = async(req, res)=>{
    try {
        const _id = req.params['id']
        const existingTrain = await Train.findOne({_id})
        if(!existingTrain){
            res.json({message: "train not found"})
        }else{
            const deleteTrain = await Train.findOneAndDelete({_id})
            res.status(201).json({Train: deleteTrain, message: "train deleted successfully"})
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const updateTrain = async(req, res)=>{
    const trainData = req.body
    const trainNumber = trainData.trainNumber
    try {
        const trainExist = await Train.findOne({trainNumber})
        if(!trainExist){
            res.json({message: "Train not found"})
        }else{
            const newTrainData = trainService.updateTrain(trainData, trainExist)
            const train = await Train.findOneAndUpdate({trainNumber}, {$set: newTrainData})
            res.status(201).json({train, message: "Train updated"})
        }
    } catch (error) {
        res.json({message: error})
    }
}

const getTrainDetails = async(req, res)=>{
    const data = await trainService.getTrainDetails()
    res.status(201).json(data)
}

const searchTrain = async(req, res)=>{
    try {
        const {departure, source, date} = req.body
        const arval = source.toLowerCase()
        const searchTrain = await Train.find({source : arval, date})
        const filterTrain = searchTrain.filter((train)=>{
            if(train.departure.toLowerCase() === departure.toLowerCase()){
                return train
            }
        })
        if (filterTrain.length) {
            res.status(201).json(filterTrain)
        } else {
            res.status(404).json({ message: "Train not found" })
        }
    } catch (error) {
        console.log(error)
    }
}

const searchTrainId = async(req, res)=>{
    try {
        const {trainNumber} = req.body
        const searchTrain = await Train.find({trainNumber: trainNumber})
        if(searchTrain){
            res.status(201).json(searchTrain)
        }else{
            res.status(404).json({message: "train not found"})
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createTrain, deleteTrain, updateTrain, getTrainDetails, searchTrain, searchTrainId }