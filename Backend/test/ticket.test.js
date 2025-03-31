const ticketService = require('../src/service/movies/ticket');
const Ticket = require('../src/model/movies/ticket');

jest.mock('../src/model/movies/ticket');

jest.mock('../src/service/movies/ticket', () => ({
  bookTicket: jest.fn(),
  cancelTicket: jest.fn(),
}));

describe('Ticket Service Tests', () => {
  const mockTicketData = {
    seatId: '123',
    userId: 'user123',
    status: 'Booked',
  };

  let mockTicket = {};

  mockTicket = {
    ...mockTicketData,
    save: jest.fn().mockResolvedValue(mockTicket),
    cancel: jest.fn().mockResolvedValue({ ...mockTicketData, status: 'Cancelled' }),
  };

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('should successfully book a ticket', async () => {
    Ticket.findOne.mockResolvedValue(mockTicket);
    ticketService.bookTicket.mockResolvedValue(mockTicket); 

    const result = await ticketService.bookTicket(mockTicketData.seatId, mockTicketData.userId);

    expect(result).toEqual(mockTicket);
    expect(Ticket.findOne).toHaveBeenCalledWith({ seatId: '123' }); 
    expect(mockTicket.save).toHaveBeenCalled();
  });

  test('should throw error if ticket is already booked', async () => {
    Ticket.findOne.mockResolvedValue(null);
    ticketService.bookTicket.mockRejectedValue(new Error('Ticket is not available or already booked')); 

    await expect(ticketService.bookTicket('123', 'user123')).rejects.toThrow('Ticket is not available or already booked');
  });

  test('should successfully cancel a booked ticket', async () => {
    Ticket.findOne.mockResolvedValue(mockTicket);

    const result = await ticketService.cancelTicket('123', 'user123');

    expect(result.status).toBe('Cancelled');
    expect(mockTicket.cancel).toHaveBeenCalled();
    expect(Ticket.findOne).toHaveBeenCalledWith({ seatId: '123' });
  });

  test('should throw error if trying to cancel a non-booked ticket', async () => {
    Ticket.findOne.mockResolvedValue(null);
    ticketService.cancelTicket.mockRejectedValue(new Error('Ticket not found or not booked'));

    await expect(ticketService.cancelTicket('123', 'user123')).rejects.toThrow('Ticket not found or not booked');
  });
});
