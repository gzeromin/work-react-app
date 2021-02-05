const express = require('express');
const router = express.Router();
const { WorkSheet } = require('../models/WorkSheet');
const { WorkSheetDay } = require('../models/WorkSheetDay');
const async = require('async');

router.get('/getWorkSheet', (req, res) => {
  let writer = req.query.writer;
  let year = req.query.year;
  let month = req.query.month;
  var populateStr = 'writer 1';
  for (var i = 2; i < 32; i++) {
    populateStr = populateStr + ' ' + i;
  }

  return fetchWorkSheet(writer, year, month, populateStr)
    .then((result) => {
      return res.json({ success: true, result });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

const fetchWorkSheet = (writer, year, month, populateStr = null) => {
  if (populateStr) {
    return new Promise((resolve, reject) => {
      WorkSheet.findOne({
        writer,
        year,
        month
      })
        .populate(populateStr)
        .exec((err, result) => {
          if (err) return reject(err);
          return resolve(result);
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      WorkSheet.findOne({
        writer,
        year,
        month
      }).exec((err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }
};

router.post('/save', (req, res) => {
  let workSheetObj = {
    year: req.body.year,
    month: req.body.month,
    writer: req.body.writer,
    diligence: req.body.diligence
  };
  async.eachSeries(
    [...Array(31).keys()],
    (index, callback) => {
      const workSheetDayObj = req.body[`${index + 1}`];
      if (workSheetDayObj._id) {
        WorkSheetDay.findByIdAndUpdate(
          { _id: workSheetDayObj._id },
          workSheetDayObj,
          (updateErr, updateResult) => {
            if (updateErr) return res.json({ success: false, err: updateErr });
            workSheetObj[index + 1] = updateResult._id;
            callback();
          }
        );
      } else {
        const workSheetDay = new WorkSheetDay(workSheetDayObj);
        workSheetDay.save((saveErr, saveResult) => {
          if (saveErr) return res.json({ success: false, err: saveErr });
          workSheetObj[index + 1] = saveResult._id;
          callback();
        });
      }
    },
    (err, result) => {
      if (err) return res.json({ success: false, err });
      fetchWorkSheet(req.body.writer, req.body.year, req.body.month)
        .then((fetchResult) => {
          if (fetchResult) {
            // update
            WorkSheet.findOneAndUpdate(
              {
                year: req.body.year,
                month: req.body.month,
                writer: req.body.writer
              },
              workSheetObj,
              { new: true },
              (updateResult) => {
                if (!updateResult.success) {
                  return res.json({ success: false, err: updateResult.err });
                }
                return res.json({
                  success: true,
                  result: updateResult.result
                });
              }
            );
          } else {
            // save
            const workSheet = new WorkSheet(workSheetObj);
            workSheet.save((saveResult) => {
              if (!saveResult.success) {
                return res.json({ success: false, err: saveResult.err });
              }
              return res.json({
                success: true,
                result: saveResult.result
              });
            });
          }
        })
        .catch((fetchErr) => {
          console.log(fetchErr);
          return res.json({ success: false, err: fetchErr });
        });
    }
  );
});

router.post('/workflow', (req, res) => {
  const updateObj = {};
  updateObj[req.body.target] = req.body.action;
  WorkSheet.findByIdAndUpdate(
    { _id: req.body.workSheetId },
    { $set: updateObj },
    (result) => {
      return res.json(result);
    }
  );
});

module.exports = router;
