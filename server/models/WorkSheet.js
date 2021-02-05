const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { PaidHoliday } = require('./PaidHoliday');

const workSheetObj = {
  year: {
    type: Number
  },
  month: {
    type: Number
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  diligence: {
    type: Number
  },
  submit: {
    type: Boolean,
    default: false
  },
  approval: {
    type: Boolean,
    default: false
  },
  confirm: {
    type: Boolean,
    default: false
  }
};

for (var i = 1; i < 32; i++) {
  workSheetObj[i] = {
    type: Schema.Types.ObjectId,
    ref: 'WorkSheetDay'
  };
}

const workSheetSchema = mongoose.Schema(workSheetObj, { timestamps: true });

workSheetSchema.post(['save', 'findOneAndUpdate'], function (doc, next) {
  updatePaidHoliday(doc, next);
});

const updatePaidHoliday = (doc, next) => {
  PaidHoliday.findOne({
    userId: doc.writer,
    year: doc.year
  }).exec((err, result) => {
    if (err) return next(err);
    const obj = {
      userId: doc.writer,
      year: doc.year,
      diligence: doc.diligence
    };
    obj[doc.month] = doc._id;
    if (result) {
      PaidHoliday.findOneAndUpdate(
        { userId: doc.writer, year: doc.year },
        obj,
        (updateErr, updateResult) => {
          if (updateErr) {
            return next({ success: false, err: updateErr });
          }
          return next({ success: true, result: doc });
        }
      );
    } else {
      const paidHoliday = new PaidHoliday(obj);
      paidHoliday.save((saveErr, saveResult) => {
        if (saveErr) {
          return next({ success: false, err: saveErr });
        }
        return next({ success: true, result: doc });
      });
    }
  });
};

const WorkSheet = mongoose.model('WorkSheet', workSheetSchema);

module.exports = { WorkSheet };
