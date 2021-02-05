/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const { PaidHoliday } = require('../models/PaidHoliday');
const async = require('async');


router.get('/paidHolidayList', (req, res) => {
  var populateStr1 = 'userId 0';
  for (var i = 1; i < 12; i++) {
    populateStr1 = populateStr1 + ' ' + i;
  }
  var populateStr2 = '1';
  for (var i = 2; i < 32; i++) {
    populateStr2 = populateStr2 + ' ' + i;
  }
  PaidHoliday.find(
    { year: req.query.year },
    (err, result) => {
    if (err) return res.json({ success: false, err });
    return res.json({ success: true, result });
  })
  .populate({
    path: populateStr1
  });
});

module.exports = router;
