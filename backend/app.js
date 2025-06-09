const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Organizer = require('./models/organizer');
const Event = require('./models/event');
const Ticket = require('./models/ticket');
const Payment = require('./models/payment');
const Waitlist = require('./models/waitlist');
const { sendCredentialsEmail, sendETicketEmail, verifyEmailExists, sendWaitlistEmail } = require('./utils/email');

const app = express();

// 启用 CORS
app.use(cors());

// 解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 连接到 MongoDB
mongoose.connect('mongodb+srv://joezheng:kY563vCpmXqcVXr0@cluster0.8wj0f47.mongodb.net/node-angular?retryWrites=true&w=majority')
.then(() => {
  console.log('Connected to database!');
})
.catch((error) => {
  console.log('Connection failed!', error);
});

// 增加请求大小限制
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

// 添加根路由
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Event Management System API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            auth: '/api/login',
            organizers: '/api/organizers',
            events: '/api/events',
            tickets: '/api/events/:eventId/tickets',
            payments: '/api/payments'
        }
    });
});

// 添加组织者注册路由
app.post('/api/register-organizer', async (req, res, next) => {
    try {
        const { username, password } = await sendCredentialsEmail({
            name: req.body.name,
            email: req.body.email
        });

        const organizer = new Organizer({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            organization: req.body.organization,
            username: username,
            password: password
        });

        console.log('New organizer registration:', organizer);

        const createdOrganizer = await organizer.save();
        res.status(201).json({
            message: 'Organizer registered successfully!',
            organizer: createdOrganizer
        });
    } catch (error) {
        console.log('Registration error:', error);
        res.status(500).json({
            message: 'Registration failed!'
        });
    }
});

// 获取所有组织者
app.get('/api/organizers', (req, res, next) => {
    Organizer.find()
        .then(documents => {
            res.status(200).json({
                message: 'Organizers fetched successfully!',
                organizers: documents
            });
        });
});

// 添加登录路由
app.post('/api/login', async (req, res, next) => {
    try {
        const organizer = await Organizer.findOne({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        if (!organizer) {
            return res.status(401).json({
                message: 'Invalid credentials!'
            });
        }

    res.status(200).json({
            message: 'Login successful!',
            user: {
                id: organizer._id,
                name: organizer.name,
                email: organizer.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Login failed!'
        });
    }
});

// 添加事件创建路由
app.post('/api/events', async (req, res) => {

    try {
        const event = new Event({
            name: req.body.name,
            date: req.body.date,
            time: req.body.time,
            description: req.body.description,
            image: req.body.image,
            organizerId: req.body.organizerId,
        });

        const createdEvent = await event.save();
        res.status(201).json({
            message: 'Event created successfully!',
            event: createdEvent
        });
    } catch (error) {
        console.error('Event creation error:', error);
        res.status(500).json({
            message: 'Creating event failed!'
        });
    }
});

// 获取所有事件
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().populate('organizerId', 'name email');
        res.status(200).json({
            message: 'Events fetched successfully!',
            events: events
        });
    } catch (error) {
        res.status(500).json({
            message: 'Fetching events failed!'
        });
    }
});

// 获取已发布的事件
app.get('/api/events/published', async (req, res) => {
    try {
        const events = await Event.find({ isPublished: true }).populate('organizerId', 'name email');
        res.status(200).json({
            message: 'Published events fetched successfully!',
            events: events
        });
    } catch (error) {
        console.error('Error fetching published events:', error);
        res.status(500).json({ message: 'Fetching published events failed!' });
    }
});

// 获取单个事件详情
app.get('/api/events/:eventId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId).populate('organizerId', 'name email');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Error fetching event' });
    }
});

// 获取特定组织者的事件
app.get('/api/events/organizer/:organizerId', async (req, res) => {
    try {
        const events = await Event.find({ organizerId: req.params.organizerId });
        res.status(200).json({
            message: 'Events fetched successfully!',
            events: events
        });
    } catch (error) {
        res.status(500).json({
            message: 'Fetching events failed!'
        });
    }
});

// 删除事件路由
app.delete('/api/events/:eventId', async (req, res) => {
    try {
        const result = await Event.deleteOne({ _id: req.params.eventId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Event deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Event not found!' });
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Deleting event failed!' });
    }
});

// 添加保存票价的路由
app.post('/api/events/:eventId/tickets', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { zonePrices } = req.body;

        // 检查event是否存在
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // 检查是否已经存在票价设置
        let ticket = await Ticket.findOne({ eventId });
        
        if (ticket) {
            // 如果存在，更新票价
            ticket.zonePrices = zonePrices;
            await ticket.save();
        } else {
            // 如果不存在，创建新的票价设置
            ticket = new Ticket({
                eventId,
                zonePrices
            });
            await ticket.save();
        }

        res.status(200).json({ message: 'Ticket prices saved successfully', ticket });
    } catch (error) {
        console.error('Error saving ticket prices:', error);
        res.status(500).json({ message: 'Error saving ticket prices' });
    }
});

// 获取特定活动的票价信息
app.get('/api/events/:eventId/tickets', async (req, res) => {
    try {
        const { eventId } = req.params;
        const ticket = await Ticket.findOne({ eventId });
        
        if (!ticket) {
            return res.status(404).json({ message: 'No ticket prices found for this event' });
        }
        
        res.status(200).json(ticket);
    } catch (error) {
        console.error('Error fetching ticket prices:', error);
        res.status(500).json({ message: 'Error fetching ticket prices' });
    }
});

// 发布事件路由
app.patch('/api/events/:eventId/publish', async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // 检查是否已设置票价
        const ticket = await Ticket.findOne({ eventId: req.params.eventId });
        if (!ticket || !ticket.zonePrices || ticket.zonePrices.length === 0) {
            return res.status(400).json({ message: 'Cannot publish event without setting ticket prices' });
        }

        event.isPublished = true;
        await event.save();

        res.status(200).json({ message: 'Event published successfully', event });
    } catch (error) {
        console.error('Error publishing event:', error);
        res.status(500).json({ message: 'Error publishing event' });
    }
});

// 更新事件信息
app.patch('/api/events/:eventId', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.eventId,
            { entryRules: req.body.entryRules },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event' });
    }
});

// 更新座位状态的函数
async function updateSeatsStatus(eventName, seats) {
  try {
    // 查找对应的活动
    const event = await Event.findOne({ name: eventName });
    if (!event) {
      throw new Error('Event not found');
    }

    // 更新座位状态
    if (Array.isArray(seats)) {
      let updatedSeats = false;
      for (const seat of seats) {
        const seatNumber = `${seat.row}${seat.col}`;
        const seatIndex = event.seats.findIndex(s => s.number === seatNumber);
        if (seatIndex !== -1) {
          event.seats[seatIndex].status = 'occupied';
          updatedSeats = true;
        } else {
          console.log(`Seat ${seatNumber} not found in event`);
        }
      }

      if (updatedSeats) {
        // 保存更新后的活动
        const updatedEvent = await event.save();
        console.log('Seats status updated successfully');
        return updatedEvent;
      } else {
        throw new Error('No seats were updated');
      }
    } else {
      console.error('Invalid seats data format');
      throw new Error('Invalid seats data format');
    }
  } catch (error) {
    console.error('Error updating seats status:', error);
    throw error;
  }
}

// 处理在线银行支付
app.post('/api/payments/online-banking', async (req, res) => {
    try {
        console.log('Received payment data:', req.body);
        
        // 验证邮箱是否存在
        const isEmailValid = await verifyEmailExists(req.body.email);
        if (!isEmailValid) {
          return res.status(400).json({
            message: 'Invalid email address: The email address does not exist',
            error: 'EMAIL_INVALID'
          });
        }

        // 检查座位是否已被预订
        const existingPayment = await Payment.findOne({
            eventId: req.body.eventId,
            'seats': {
                $elemMatch: {
                    $or: req.body.seats.map(seat => ({
                        row: seat.row,
                        col: seat.col
                    }))
                }
            }
        });

        if (existingPayment) {
            return res.status(400).json({
                message: `Seats ${req.body.seats.map(seat => seat.row + seat.col).join(', ')} are not available`,
                error: 'SEATS_UNAVAILABLE'
            });
        }

        // 创建马来西亚时间 (UTC+8)
        const malaysiaTime = new Date();
        malaysiaTime.setHours(malaysiaTime.getHours() + 8);

        const payment = new Payment({
            eventId: req.body.eventId,
            eventName: req.body.eventName,
            seats: req.body.seats,
            amount: req.body.amount,
            paymentMethod: 'online-banking',
            email: req.body.email,
            onlineBankingDetails: {
                bank: req.body.selectedBank
            },
            createdAt: malaysiaTime
        });

        const savedPayment = await payment.save();
        console.log('Payment saved successfully:', savedPayment);

        // 发送电子票邮件
        const ticketId = await sendETicketEmail({
            email: req.body.email,
            eventName: req.body.eventName,
            seats: req.body.seats,
            amount: req.body.amount,
            paymentMethod: 'Online Banking'
        });

        res.status(201).json({
            message: 'Payment processed successfully',
            payment: savedPayment,
            ticketId: ticketId
        });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({
            message: 'Payment processing failed',
            error: error.message
        });
    }
});

// 获取活动座位状态
app.get('/api/events/:eventName/seats', async (req, res) => {
  try {
    const event = await Event.findOne({ name: req.params.eventName });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ seats: event.seats });
  } catch (error) {
    console.error('Error fetching seats status:', error);
    res.status(500).json({ message: 'Error fetching seats status' });
  }
});

// 获取座位状态
app.get('/api/events/:eventId/seats/status', async (req, res) => {
    try {
        const { eventId } = req.params;
        
        // 查找所有与该活动相关的支付记录
        const payments = await Payment.find({ eventId });
        
        // 收集所有已预订的座位
        const bookedSeats = [];
        for (const payment of payments) {
            if (payment.seats && Array.isArray(payment.seats)) {
                for (const seat of payment.seats) {
                    bookedSeats.push({
                        row: seat.row,
                        col: seat.col,
                        isBooked: true
                    });
                }
            }
        }
        
        console.log('Found booked seats for event', eventId, ':', bookedSeats);
        res.status(200).json(bookedSeats);
    } catch (error) {
        console.error('Error fetching seat status:', error);
        res.status(500).json({ 
            message: 'Error fetching seat status',
            error: error.message 
        });
    }
});

// 检查座位可用性
app.post('/api/events/:eventId/seats/check', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { seats } = req.body;
        
        // 查找这些座位是否已被预订
        const payments = await Payment.find({
            eventId,
            'seats': {
                $elemMatch: {
                    $or: seats.map(seat => ({
                        row: seat.row,
                        col: seat.col
                    }))
                }
            }
        });
        
        const available = payments.length === 0;
        res.status(200).json({ available });
    } catch (error) {
        console.error('Error checking seat availability:', error);
        res.status(500).json({ message: 'Error checking seat availability' });
    }
});

// Replace the general analytics route in app.js with this fixed version
app.get('/api/analytics/:period', async (req, res) => {
  try {
    const period = req.params.period;
    
    // Get all published events regardless of date
    const events = await Event.find({
      isPublished: true
    });
    
    // Get all payments for these events
    const eventIds = events.map(event => event._id);
    const payments = await Payment.find({
      eventId: { $in: eventIds }
    });
    
    // Calculate total tickets sold and revenue
    let ticketsSold = 0;
    let revenue = 0;

    payments.forEach(payment => {
      if (payment.seats && Array.isArray(payment.seats)) {
        ticketsSold += payment.seats.length;
      }
      if (payment.amount) {
        revenue += payment.amount;
      }
    });

    // Get all tickets information
    const tickets = await Ticket.find({
      eventId: { $in: eventIds }
    });

    // Calculate seat occupancy
    let totalSeats = 0;
    let occupiedSeats = 0;

    events.forEach(event => {
      if (event.seats && event.seats.length > 0) {
        totalSeats += event.seats.length;
      } else {
        // Use ticket zones to estimate
        const eventTicket = tickets.find(t => t.eventId.toString() === event._id.toString());
        if (eventTicket && eventTicket.zonePrices) {
          const seatsPerZone = 50; // Adjust as needed
          totalSeats += eventTicket.zonePrices.length * seatsPerZone;
        } else {
          // Default estimate
          totalSeats += 100;
        }
      }
    });

    // Calculate occupied seats
    payments.forEach(payment => {
      if (payment.seats && Array.isArray(payment.seats)) {
        occupiedSeats += payment.seats.length;
      }
    });

    // Calculate occupancy rate
    const seatOccupancy = totalSeats > 0 ? Number((occupiedSeats / totalSeats * 100).toFixed(2)) : 0;

    console.log('Analytics calculation:', {
      period,
      eventsCount: events.length,
      totalSeats,
      occupiedSeats,
      seatOccupancy,
      ticketsSold,
      revenue
    });

    res.status(200).json({
      ticketsSold,
      revenue,
      seatOccupancy
    });
  } catch (error) {
    console.error('Analytics calculation error:', error);
    res.status(500).json({
      message: 'Failed to calculate analytics',
      error: error.message
    });
  }
});

// Replace the organizer-specific analytics route in app.js
app.get('/api/analytics/:period/:organizerId', async (req, res) => {
  try {
    const period = req.params.period;
    const organizerId = req.params.organizerId;
    
    console.log(`Analytics request - organizerId: ${organizerId}, period: ${period}`);
    
    // Get events created by this organizer
    const organizerEvents = await Event.find({
      organizerId: organizerId,
      isPublished: true
    });
    
    console.log(`Found ${organizerEvents.length} events for organizer ${organizerId}`);
    
    if (organizerEvents.length === 0) {
      // Return zeroes if no events found
      return res.status(200).json({
        ticketsSold: 0,
        revenue: 0, 
        seatOccupancy: 0,
        message: "You haven't created any events yet"
      });
    }
    
    let startDate = new Date();
    let endDate = new Date();
    let periodName = "";
    
    // Set date range based on period
    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        periodName = "today";
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7);
        periodName = "this week";
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 1);
        periodName = "this month";
        break;
      default:
        // Use a default period
        startDate.setMonth(startDate.getMonth() - 1);
        periodName = "the last month";
        console.log(`Invalid period '${period}', defaulting to monthly`);
    }

    // Get event IDs to filter payments
    const eventIds = organizerEvents.map(event => event._id);

    // Get payments for these events within the selected period
    const periodPayments = await Payment.find({
      eventId: { $in: eventIds },
      createdAt: { $gte: startDate, $lte: endDate }
    });
    
    // Get all payments for these events (for occupancy calculation)
    const allPayments = await Payment.find({
      eventId: { $in: eventIds }
    });
    
    console.log(`Found ${periodPayments.length} payments in the selected period for organizer's events`);
    console.log(`Found ${allPayments.length} total payments for organizer's events`);

    // If no payments in the selected period, return a message
    if (periodPayments.length === 0) {
      return res.status(200).json({
        ticketsSold: 0,
        revenue: 0,
        seatOccupancy: 0,
        message: `No ticket sales activity ${periodName}`
      });
    }

    // Calculate ticket sales and revenue for the period
    let ticketsSold = 0;
    let revenue = 0;

    periodPayments.forEach(payment => {
      if (payment.seats && Array.isArray(payment.seats)) {
        ticketsSold += payment.seats.length;
      }
      if (payment.amount) {
        revenue += payment.amount;
      }
    });

    // Get tickets for the organizer's events
    const tickets = await Ticket.find({
      eventId: { $in: eventIds }
    });
    
    // Calculate seat occupancy based on all payments (not just the period)
    let totalSeats = 0;
    let occupiedSeats = 0;

    organizerEvents.forEach(event => {
      // Default to a reasonable number if seats array is empty
      if (!event.seats || event.seats.length === 0) {
        // Use ticket zones instead
        const eventTicket = tickets.find(t => t.eventId.toString() === event._id.toString());
        if (eventTicket && eventTicket.zonePrices) {
          const seatsPerZone = 50; // Adjust as needed
          totalSeats += eventTicket.zonePrices.length * seatsPerZone;
        } else {
          // Default estimate
          totalSeats += 100;
        }
      } else {
        totalSeats += event.seats.length;
      }
    });

    // Calculate occupied seats
    allPayments.forEach(payment => {
      if (payment.seats && Array.isArray(payment.seats)) {
        occupiedSeats += payment.seats.length;
      }
    });

    // Calculate occupancy rate
    const seatOccupancy = totalSeats > 0 ? Number((occupiedSeats / totalSeats * 100).toFixed(2)) : 0;

    console.log('Organizer analytics calculation:', {
      organizerId,
      period,
      startDate,
      endDate,
      eventsCount: organizerEvents.length,
      totalSeats,
      occupiedSeats,
      seatOccupancy,
      ticketsSold,
      revenue
    });

    res.status(200).json({
      ticketsSold,
      revenue,
      seatOccupancy,
      period: periodName
    });
  } catch (error) {
    console.error('Organizer analytics calculation error:', error);
    res.status(500).json({
      message: 'Failed to calculate organizer analytics',
      error: error.message
    });
  }
});

// 管理员分析路由
app.get('/api/admin/events-analytics', async (req, res) => {
    try {
        // 获取所有活动
        const events = await Event.find();
        
        // 获取每个活动的支付信息
        const eventsAnalytics = await Promise.all(events.map(async (event) => {
            // 获取该活动的所有支付记录
            const payments = await Payment.find({ eventId: event._id });
            
            // 计算统计数据
            const totalSeats = event.seats ? event.seats.length : 0;
            const occupiedSeats = payments.reduce((total, payment) => {
                return total + (payment.seats ? payment.seats.length : 0);
            }, 0);
            const ticketsSold = occupiedSeats;
            const totalRevenue = payments.reduce((total, payment) => {
                return total + (payment.amount || 0);
            }, 0);
            const seatOccupancy = totalSeats > 0 ? Number((occupiedSeats / totalSeats * 100).toFixed(2)) : 0;

            // 获取组织者信息
            const organizer = await Organizer.findById(event.organizerId);
            
            return {
                _id: event._id,
                name: event.name,
                date: event.date,
                time: event.time,
                venue: event.venue,
                totalSeats,
                occupiedSeats,
                ticketsSold,
                totalRevenue,
                seatOccupancy,
                organizerName: organizer ? organizer.name : 'Unknown Organizer'
            };
        }));

        res.status(200).json(eventsAnalytics);
    } catch (error) {
        console.error('Error fetching events analytics:', error);
        res.status(500).json({
            message: 'Failed to fetch events analytics',
            error: error.message
        });
    }
});

// Waitlist Routes
app.post('/api/waitlist', async (req, res) => {
    try {
        // 验证邮箱是否存在
        const isEmailValid = await verifyEmailExists(req.body.email);
        if (!isEmailValid) {
            return res.status(400).json({
                message: 'Invalid email address: The email address does not exist',
                error: 'EMAIL_INVALID'
            });
        }

        const waitlist = new Waitlist({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email
        });
        const result = await waitlist.save();

        // 发送确认邮件
        try {
            await sendWaitlistEmail({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email
            });
        } catch (emailError) {
            console.error('Failed to send waitlist confirmation email:', emailError);
            // 即使邮件发送失败，我们也不删除等待列表记录
        }

        res.status(201).json({
            message: 'Successfully added to waitlist',
            data: result
        });
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        res.status(500).json({ 
            message: 'Failed to join waitlist',
            error: error.message 
        });
    }
});

app.delete('/api/waitlist/:id', async (req, res) => {
    try {
        await Waitlist.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Successfully removed from waitlist' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to leave waitlist' });
    }
});

app.get('/api/waitlist/check/:phone', async (req, res) => {
    try {
        const exists = await Waitlist.exists({ phone: req.params.phone });
        res.json(exists);
    } catch (error) {
        res.status(500).json({ message: 'Failed to check waitlist status' });
    }
});

app.get('/api/waitlist/count', async (req, res) => {
    try {
        const count = await Waitlist.countDocuments();
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get waitlist count' });
    }
});

// 支付处理路由
app.post('/api/payments', async (req, res) => {
  try {
    const { paymentData, eventId, eventName, amount, email, selectedSeats } = req.body;

    // 创建新的支付记录
    const payment = new Payment({
      eventId,
      eventName,
      amount,
      email,
      seats: selectedSeats || [],
      paymentMethod: 'GOOGLE_PAY',
      status: 'SUCCESS',
      paymentData: paymentData
    });

    // 保存支付记录
    const savedPayment = await payment.save();
    console.log('Payment saved:', savedPayment);

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      paymentId: savedPayment._id
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
});

// 导出 app
module.exports = app;

// 启动服务器
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});