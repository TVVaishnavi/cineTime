const request = require('supertest');
const mongoose = require('mongoose');
const flightService = require('../src/service/travels/flight');
const Flight = require('../src/model/travels/flight');
const express = require('express');
const flightController = require('../src/controller/travels/flight');
const authMiddleware = require('../src/middleware/authentication');

jest.mock('../src/middleware/authentication');
jest.mock('../src/model/travels/flight');

describe('Flight Service and Controller Tests', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/flight/create-flight', authMiddleware.authenticateToken, flightController.createFlight);
        app.delete('/delete-flight/:id', authMiddleware.authenticateToken, flightController.deleteFlight);
        app.put('/update-flight', authMiddleware.authenticateToken, flightController.updateFlight);
        app.get('/view/flight-details', authMiddleware.authenticateToken, flightController.getFlightDetails);
        app.post('/user/view/search-flight', flightController.searchFlight);
        app.post('/flight/search-flight', authMiddleware.authenticateToken, flightController.searchFlightId);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('searchFlight - should find flights matching criteria', async () => {
        const mockSearchData = {
            destination: 'Mumbai',
            source: 'Delhi',
            date: '2024-03-30'
        };

        const mockFlights = [
            {
                destination: 'Mumbai',
                source: 'delhi',
                date: '2024-03-30'
            }
        ];

        Flight.find.mockResolvedValue(mockFlights);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const req = {
            body: mockSearchData
        };

        try {
            await flightController.searchFlight(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockFlights);
        } catch (error) {
            throw new Error(`Unexpected error: ${error.message}`);
        }
    });

    test('updateFlight should merge new and old flight data', () => {
        const oldFlightData = {
            name: 'Old Flight',
            flightNumber: 'AI001',
            source: 'Mumbai',
            destination: 'Delhi',
            availableSeats: 200
        };

        const newFlightData = {
            name: 'New Flight',
            flightNumber: 'AI001'
        };

        const result = flightService.updateFlight(newFlightData, oldFlightData);

        expect(result).toEqual({
            name: 'New Flight',
            flightNumber: 'AI001',
            source: 'Mumbai',
            destination: 'Delhi',
            arrivalTime: undefined,
            stoppings: undefined,
            availableSeats: 200,
            bookedSeats: undefined,
            pricePerSeat: undefined
        });
    });
});

describe('Flight Controller', () => {
    test('createFlight - should create flight when not existing', async () => {
        const mockFlightData = {
            flightNumber: 'AI001',
            name: 'Express Flight'
        };

        Flight.findOne.mockResolvedValue(null);
        Flight.prototype.save.mockResolvedValue({ ...mockFlightData, _id: 'mockId' });

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const req = {
            body: mockFlightData
        };

        await flightController.createFlight(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'flight created successfully'
        }));
    });

    test('deleteFlight - should delete existing flight', async () => {
        const mockFlight = { _id: 'mockId', flightNumber: 'AI001' };

        Flight.findOne.mockResolvedValue(mockFlight);
        Flight.findOneAndDelete.mockResolvedValue(mockFlight);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const req = {
            params: { id: 'mockId' }
        };

        await flightController.deleteFlight(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Flight deleted successfully'
        }));
    });

    test('searchFlight - should throw error for invalid source', async () => {
        const mockSearchData = {
            departure: 'Mumbai',
            sourcve: 'Delhi', 
            date: '2024-03-30'
        };
    
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        const req = {
            body: mockSearchData
        };
    
        Flight.find = jest.fn().mockRejectedValue(new Error('Invalid source'));

        await expect(flightController.searchFlight(req, res)).rejects.toThrow();
   
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });

    test('updateFlight - should update existing flight', async () => {
        const mockFlightData = {
            flightNumber: 'AI001',
            name: 'Updated Express'
        };

        const existingFlight = {
            flightNumber: 'AI001',
            name: 'Original Express'
        };

        Flight.findOne.mockResolvedValue(existingFlight);
        Flight.findOneAndUpdate.mockResolvedValue({ ...existingFlight, ...mockFlightData });

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const req = {
            body: mockFlightData
        };

        await flightController.updateFlight(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Flight updated'
        }));
    });
});

describe('Error Handling', () => {
    test('createFlight - should handle errors', async () => {
        Flight.findOne.mockRejectedValue(new Error('Database error'));

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const req = {
            body: { flightNumber: 'AI001' }
        };

        await flightController.createFlight(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});