const mongoose = require('mongoose');

const restDaySchema = mongoose.Schema(
  {
    dispOrder: {
      type: Number
    },
    kubun: {
      type: Number
    },
    year: {
      type: Number
    },
    month: {
      type: Number
    },
    day: {
      type: Number
    },
    n_th: {
      type: Number
    },
    day_of_the_week: {
      type: Number
    },
    biko: {
      type: String
    }
  },
  { timestamps: true }
);

const RestDay = mongoose.model('RestDay', restDaySchema);

module.exports = { RestDay };
