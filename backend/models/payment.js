const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  seats: [{
    row: {
      type: String,
      required: true
    },
    col: {
      type: Number,
      required: true
    }
  }],
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['GOOGLE_PAY', 'online-banking'],
    required: true
  },
  email: {
    type: String,
    required: true
  },
  // 电子钱包特有字段
  ewalletDetails: {
    provider: String,
    phoneNumber: String
  },
  // 信用卡特有字段
  creditCardDetails: {
    cardNumber: String,
    cardHolder: String
  },
  // 网上银行特有字段
  onlineBankingDetails: {
    bank: String
  },
  // 支付数据
  paymentData: {
    type: Object
  },
  // 通用字段
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: function() {
      const malaysiaTime = new Date();
      malaysiaTime.setHours(malaysiaTime.getHours() + 8);
      return malaysiaTime;
    }
  }
});

module.exports = mongoose.model('Payment', paymentSchema); 