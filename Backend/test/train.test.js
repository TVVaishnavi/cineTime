const request = require('supertest');
const mongoose = require('mongoose');
const trainService = require('../src/service/travels/train');
const Train = require('../src/model/travels/train');
const express = require('express');
const trainController = require('../src/controller/travels/train');
const authMiddleware = require('../src/middleware/authentication');

// Mock dependencies
jest.mock('../src/middleware/authentication');
jest.mock('../src/model/travels/train');

describe('Train Service and Controller Tests', () => {
  let app;
  
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/train/create-train', authMiddleware.authenticateToken, trainController.createTrain);
    app.delete('/delete-train/:id', authMiddleware.authenticateToken, trainController.deleteTrain);
    app.put('/update-train', authMiddleware.authenticateToken, trainController.updateTrain);
    app.get('/view/train-details', authMiddleware.authenticateToken, trainController.getTrainDetails);
    app.post('/user/view/search-train', trainController.searchTrain);
    app.post('/train/search-train', authMiddleware.authenticateToken, trainController.searchTrainId);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Train Service', () => {
    test('createTrain should create and save a new train', async () => {
      const mockTrainData = {
        name: 'Rajdhani Express',
        trainNumber: 'TR001',
        source: 'Mumbai',
        destination: 'Delhi',
        departureTime: '10:00 AM',
        arrivalTime: '8:00 PM',
        totalSeats: 200,
        availableSeats: 200,
        pricePerSeat: 1500
      };

      const mockSavedTrain = { ...mockTrainData, _id: 'mockId' };
      
      const saveSpy = jest.spyOn(Train.prototype, 'save').mockResolvedValue(mockSavedTrain);

      const result = await trainService.createTrain(mockTrainData);
      
      expect(result).toEqual(mockSavedTrain);
      expect(saveSpy).toHaveBeenCalled();
    });

    test('updateTrain should merge new and old train data', () => {
      const oldTrainData = {
        name: 'Old Express',
        trainNumber: 'TR001',
        source: 'Mumbai',
        destination: 'Delhi',
        totalSeats: 200
      };

      const newTrainData = {
        name: 'New Express',
        trainNumber: 'TR001'
      };

      const result = trainService.updateTrain(newTrainData, oldTrainData);
      
      expect(result).toEqual({
        name: 'New Express',
        trainNumber: 'TR001',
        source: 'Mumbai',
        destination: 'Delhi',
        arrivalTime: undefined,
        totalSeats: 200,
        availableSeats: undefined,
        pricePerSeat: undefined
      });
    });
  });

  describe('Train Controller', () => {
    test('createTrain - should create train when not existing', async () => {
      const mockTrainData = {
        trainNumber: 'TR001',
        name: 'Express Train'
      };

      Train.findOne.mockResolvedValue(null);
      Train.prototype.save.mockResolvedValue({ ...mockTrainData, _id: 'mockId' });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const req = {
        body: mockTrainData
      };

      await trainController.createTrain(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'train created successfully'
      }));
    });

    test('deleteTrain - should delete existing train', async () => {
      const mockTrain = { _id: 'mockId', trainNumber: 'TR001' };

      Train.findOne.mockResolvedValue(mockTrain);
      Train.findOneAndDelete.mockResolvedValue(mockTrain);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const req = {
        params: { id: 'mockId' }
      };

      await trainController.deleteTrain(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'train deleted successfully'
      }));
    });

    test('searchTrain - should find trains matching criteria', async () => {
      const mockSearchData = {
        departure: 'Mumbai',
        source: 'Delhi',
        date: '2024-03-30'
      };

      const mockTrains = [
        { 
          departure: 'Mumbai', 
          source: 'delhi', 
          date: '2024-03-30' 
        }
      ];

      Train.find.mockResolvedValue(mockTrains);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const req = {
        body: mockSearchData
      };

      await trainController.searchTrain(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTrains);
    });

    test('updateTrain - should update existing train', async () => {
      const mockTrainData = {
        trainNumber: 'TR001',
        name: 'Updated Express'
      };

      const existingTrain = {
        trainNumber: 'TR001',
        name: 'Original Express'
      };

      Train.findOne.mockResolvedValue(existingTrain);
      Train.findOneAndUpdate.mockResolvedValue({ ...existingTrain, ...mockTrainData });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const req = {
        body: mockTrainData
      };

      await trainController.updateTrain(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Train updated'
      }));
    });
  });

  describe('Integration Tests', () => {
    test('POST /train/create-train - successful train creation', async () => {
      authMiddleware.authenticateToken.mockImplementation((req, res, next) => next());
      
      Train.findOne.mockResolvedValue(null);
      Train.prototype.save.mockResolvedValue({ 
        trainNumber: 'TR001', 
        _id: 'mockId' 
      });

      const response = await request(app)
        .post('/train/create-train')
        .send({
          trainNumber: 'TR001',
          name: 'Express Train'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'train created successfully');
    });
  });
});