const request = require('supertest');
const mongoose = require('mongoose');
const busService = require('../src/service/travels/bus');
const buses = require('../src/model/travels/bus');
const express = require('express');
const busController = require('../src/controller/travels/bus');
const authMiddleware = require('../src/middleware/authentication');

jest.mock('../src/middleware/authentication');
jest.mock('../src/model/travels/bus');

describe('Bus Service and Controller Tests', () => {
  let app;
  
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/bus/create-bus', authMiddleware.authenticateToken, busController.createBus);
    app.delete('/delete-bus/:id', authMiddleware.authenticateToken, busController.deleteBus);
    app.put('/update-bus', authMiddleware.authenticateToken, busController.updateBus);
    app.get('/view/bus-details', authMiddleware.authenticateToken, busController.getBusDetails);
    app.post('/user/view/search-bus', busController.searchBus);
    app.post('/bus/search-bus', authMiddleware.authenticateToken, busController.searchbusad);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Bus Service', () => {
    test('createBus should create and save a new bus', async () => {
      const mockBusData = {
        busName: 'Express',
        busNumber: 'BUS001',
        totalSeat: 50,
        Bustype: 'AC',
        availableSeat: 50,
        bookedSeat: 0,
        inAC: true,
        arrival: 'Mumbai',
        departure: 'Delhi',
        stoppings: ['Pune', 'Surat'],
        arriveTime: '10:00 AM',
        departureTime: '9:00 PM',
        date: '2024-03-30'
      };

      const mockSavedBus = { ...mockBusData, _id: 'mockId' };
      
      const saveSpy = jest.spyOn(buses.prototype, 'save').mockResolvedValue(mockSavedBus);

      const result = await busService.createBus(mockBusData);
      
      expect(result).toEqual(mockSavedBus);
      expect(saveSpy).toHaveBeenCalled();
    });

    test('updateBus should merge new and old bus data', () => {
      const oldBusData = {
        busName: 'Old Express',
        busNumber: 'BUS001',
        totalSeat: 50
      };

      const newBusData = {
        busName: 'New Express',
        busNumber: 'BUS001'
      };

      const result = busService.updateBus(newBusData, oldBusData);
      
      expect(result).toEqual({
        busName: 'New Express',
        busNumber: 'BUS001',
        totalSeat: 50,
        availableSeat: undefined,
        bookedSeat: undefined,
        inAC: undefined,
        arrival: undefined,
        departure: undefined,
        stoppings: undefined,
        arriveTime: undefined,
        departureTime: undefined,
        date: undefined
      });
    });
  });

  describe('Bus Controller', () => {
    test('createBus - should create bus when not existing', async () => {
      const mockBusData = {
        busNumber: 'BUS001',
        busName: 'Express'
      };

      buses.findOne.mockResolvedValue(null);
      buses.prototype.save.mockResolvedValue({ ...mockBusData, _id: 'mockId' });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const req = {
        body: mockBusData
      };

      await busController.createBus(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'bus created is successfully'
      }));
    });

    test('deleteBus - should delete existing bus', async () => {
      const mockBus = { _id: 'mockId', busNumber: 'BUS001' };

      buses.findOne.mockResolvedValue(mockBus);
      buses.findOneAndDelete.mockResolvedValue(mockBus);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const req = {
        params: { id: 'mockId' }
      };

      await busController.deleteBus(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'bus deleted successfully'
      }));
    });

    test('searchBus - should find buses matching criteria', async () => {
      const mockSearchData = {
        departure: 'Mumbai',
        arrival: 'Delhi',
        date: '2024-03-30'
      };

      const mockBuses = [
        { 
          departure: 'Mumbai', 
          arrival: 'delhi', 
          date: '2024-03-30' 
        }
      ];

      buses.find.mockResolvedValue(mockBuses);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const req = {
        body: mockSearchData
      };

      await busController.searchBus(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBuses);
    });
  });

  describe('Integration Tests', () => {
    test('POST /bus/create-bus - successful bus creation', async () => {
      authMiddleware.authenticateToken.mockImplementation((req, res, next) => next());
      
      buses.findOne.mockResolvedValue(null);
      buses.prototype.save.mockResolvedValue({ 
        busNumber: 'BUS001', 
        _id: 'mockId' 
      });

      const response = await request(app)
        .post('/bus/create-bus')
        .send({
          busNumber: 'BUS001',
          busName: 'Express Bus'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'bus created is successfully');
    });
  });
});