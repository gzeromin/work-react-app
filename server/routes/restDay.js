const express = require('express');
const router = express.Router();
const { RestDay } = require('../models/RestDay');

router.get('/getRestDays', (req, res) => {
  RestDay.find({ year: req.query.year })
    .sort({ dispOrder: 1 })
    .exec((err, result) => {
      if (err) return res.json({ success: false, err });
      return res.json({ success: true, result });
    });
});

router.post('/save', (req, res) => {
  const restDay = new RestDay(req.body);
  restDay.save((err, result) => {
    if (err) return res.json({ success: false, err });
    RestDay.updateMany(
      { dispOrder: { $gte: req.body.dispOrder } },
      { $inc: { dispOrder: 1 } },
      { new: true },
      (updateErr, updateResult) => {
        if (updateErr) {
          // save roll back
          RestDay.findByIdAndDelete(
            { _id: result._id },
            (deleteErr, deleteResult) => {
              if (deleteErr)
                return res.json({ success: false, err: deleteErr });
            }
          );
          return res.json({ success: true, err: updateErr });
        }
      }
    );
    return res.json({ success: true });
  });
});

router.post('/delete', (req, res) => {
  RestDay.deleteOne({ _id: req.body._id }, (err, result) => {
    if (err) return res.json({ success: false, err });
    RestDay.updateMany(
      { dispOrder: { $gt: result.dispOrder } },
      { $inc: { dispOrder: -1 } },
      (updateErr, updateResult) => {
        if (updateErr) {
          // delete roll back
          const restDay = new RestDay(result);
          restDay.save((saveErr, saveResult) => {
            if (saveErr) return res.json({ success: false, err: saveErr });
          });
          return res.json({ success: false, err: updateErr });
        }
      }
    );
    return res.json({ success: true });
  });
});

router.post('/update', (req, res) => {
  RestDay.findByIdAndUpdate({ _id: req.body._id }, req.body, {
    new: true
  }).exec((err, result) => {
    if (err) return res.json({ success: false, err });
    return res.json({ success: true, result });
  });
});

module.exports = router;
