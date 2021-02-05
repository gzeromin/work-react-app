const mongoose = require('mongoose');

const workSheetDaySchema = mongoose.Schema(
  {
    startTime: {
      type: String
    },
    endTime: {
      type: String
    },
    late: {
      type: Number
    },
    annual: {
      type: Number
    },
    half: {
      type: Number
    },
    etc: {
      type: Number
    },
    attendance: {
      type: Number
    },
    biko: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const WorkSheetDay = mongoose.model('WorkSheetDay', workSheetDaySchema);

module.exports = { WorkSheetDay };
