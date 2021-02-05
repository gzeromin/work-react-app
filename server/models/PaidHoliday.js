const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { User } = require('./User');

const paidHolidayObj = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  year: {
    type: Number
  },
  thisYearTotal: {
    type: Number,
    default: 0
  },
  lastYearRemaining: {
    type: Number,
    default: 0
  }
};

for (var i = 1; i < 13; i++) {
  paidHolidayObj[i] = {
    type: Schema.Types.ObjectId,
    ref: 'WorkSheet'
  };
}
const paidHolidaySchema = mongoose.Schema(paidHolidayObj, { timestamps: true });

const PaidHoliday = mongoose.model('PaidHoliday', paidHolidaySchema);

module.exports = { PaidHoliday };
