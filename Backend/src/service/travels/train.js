const Train = require("../../model/travels/train")

class trainService {
    constructor(){
        if(!trainService.instance){
            trainService.instance = this
        }
        return trainService.instance
    }
    async createTrain(trainData){
        const {name, trainNumber, source, destination, departureTime, arrivalTime, totalSeats, availableSeats, pricePerSeat} = trainData
        const newTrain = new Train({
            name, trainNumber, source, destination, departureTime, arrivalTime, totalSeats, availableSeats, pricePerSeat
        })
        const saveTrain = await newTrain.save()
        return saveTrain
    }

    updateTrain (newTrainData, oldTrainData){
        return {
           name: newTrainData.name || oldTrainData.name,
           trainNumber: newTrainData.trainNumber || oldTrainData.trainNumber,
           source: newTrainData.source || oldTrainData.source,
           destination: newTrainData.destination || oldTrainData.destination, 
           arrivalTime: newTrainData.arrivalTime || oldTrainData.arrivalTime,
           totalSeats: newTrainData.totalSeats || oldTrainData.totalSeats,
           availableSeats: newTrainData.availableSeats || oldTrainData.availableSeats,
           pricePerSeat: newTrainData.pricePerSeat || oldTrainData.pricePerSeat, 
        }
    }
    async getTrainDetails() {
        return await Train.find({})
    }
}

const trainServiceInstance = new trainService()
Object.freeze(trainServiceInstance)
module.exports = trainServiceInstance