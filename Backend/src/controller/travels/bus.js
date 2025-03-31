const busService = require("../../service/travels/bus")
const buses = require("../../model/travels/bus")


const createBus = async (req, res) => {
    try {
        const busData = req.body
        console.log(busData)
        const busNumber = busData.busNumber
        const existingBus = await buses.findOne({ busNumber })
        if (existingBus) {
            res.json({ message: "bus already existed" })
        }
        else {
            const bus = await busService.createBus(busData)
            res.status(201).json({ bus, message: "bus created is successfully" })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message })
    }
}

const deleteBus = async (req, res) => {
    try {
        const _id = req.params['id']
        const existingBus = await buses.findOne({ _id })
        console.log(existingBus)
        if (!existingBus) {
            res.json({ message: "bus not found" })
        }
        else {
            const deleteBus = await buses.findOneAndDelete({ _id })
            res.status(201).json({ bus: deleteBus, message: "bus deleted successfully" })
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message })
    }
}
const updateBus = async (req, res) => {
    const busData = req.body
    const busNumber = busData.busNumber
    console.log(busData)
    try {
        const busExist = await buses.findOne({ busNumber })
        console.log(busExist)
        if (!busExist) {
            res.json({ message: "bus not exists" })

        } else {
            const newBusData = busService.updateBus(busData, busExist)
            const bus = await buses.findOneAndUpdate({ busNumber }, { $set: newBusData })
            res.status(201).json({ bus, message: "bus Updated" })
        }
    } catch (error) {
        res.json({ message: error })
    }

}
const getBusDetails = async (req, res) => {
    const data = await busService.getBusDetails()
    res.status(201).json(data)
}
const searchBus = async (req, res) => {
    try {
        const { departure, arrival, date } = req.body
        const arval = arrival.toLowerCase()
        const searchBus = await buses.find({ arrival: arval, date })
        console.log(searchBus)
        const filterBus = searchBus.filter((bus) => {
            if (bus.departure.toLowerCase() === departure.toLowerCase()) {
                return bus
            }
        })
        if (filterBus.length) {
            res.status(201).json(filterBus)
        } else {
            res.status(404).json({ message: "bus not found" })
        }
    } catch (err) {
        console.log(err)

    }
}

const searchbusad = async (req, res) => {
    try {
        const { busNumber } = req.body
        const searchBus = await buses.find({ busNumber: busNumber })
        console.log(searchBus)
        if (searchBus) {
            res.status(201).json(searchBus)
        } else {
            res.status(404).json({ message: "bus not found" })
        }
    } catch (err) {
        console.log(err)

    }
}

module.exports = { createBus, deleteBus, updateBus, getBusDetails, searchBus, searchbusad }