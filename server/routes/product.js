/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');
const { User } = require('../models/User');
const { auth } = require('../middleware/auth');

const multer = require('multer');
const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});

const filePath = 'uploads/product';

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});


const upload = multer({ storage: storage }).array('files', 10);

router.post('/uploadImages', (req, res) => {
  //upload image
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    const fileList = req.files.map((file, index) => {
      return {
        'path': file.path, 
        'filename': file.filename
      };
    });
    return res.status(200).send({
      success: true,
      fileList
    });
  });
});

router.post('/thumbnail', async (req, res) => {
  try {
    const filePathList = await Promise.all(req.body.fileList.map(file => {
      return new Promise((resolve, reject) => {
        gm(file.path)
        .thumb(300, 240, `${filePath}/thumbnails/thumbnail_${file.filename}`, function (err) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(file);
            resolve({
              'image': file.path,
              'thumbnail': `${filePath}/thumbnails/thumbnail_${file.filename}`
            });
          }
        });
      });
    }));
    return res.status(200).json({
      success: true,
      filePathList
    })
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
});

router.post('/deleteImage', (req, res) => {
  try {
    //delte image
    fs.unlinkSync(req.body.image.image);
    //delete thumbnail
    fs.unlinkSync(req.body.image.thumbnail);
    return res.status(200).send({
      success: true
    });
  } catch (err) {
    return res.json({
      success: false,
      err
    });
  }
});

router.post('/uploadProduct', (req, res) => {
  const product = new Product(req.body);
  product.save((err) => {
    if (err)
      return res.json({
        success: false,
        err
      });
    return res.status(200).send({
      success: true
    });
  });
});

router.post('/products', (req, res) => {

  let order = req.body.order ?  req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};

  for(let key in req.body.filters) {
    if(req.body.filters[key].length > 0) {
      if(key === 'price') {
        findArgs[key] = {
          //Greater than equal
          $gte: req.body.filters[key][0],
          //Less than equal
          $lte: req.body.filters[key][1]
        }
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if(term) {
    Product.find(findArgs)
      .find({$text: {
                      $search: term
                    }})
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, productList) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({
          success: true,
          productList
        })
      });
  } else {
    Product.find(findArgs)
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, productList) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({
          success: true,
          productList
        })
      });
  }
});

router.get('/products_by_id', (req, res) => {
  //get product info by id from mongo db.
  let type = req.query.type;
  let productIds = req.query.id;

  if(type === 'array') {
    //id=12312313,535252,74745464 =>
    //productIds = [12312313,535252,74745464]
    let ids = req.query.id.split(',');
    productIds = ids.map(item => item);
  }
  Product.find({_id: {$in: productIds}})
    .populate('writer')
    .exec((err, product) => {
      if (err) return res.status(400).json({
        success: false,
        err
      });
      return res.status(200).json({
        success: true,
        product
      });
    });
});

router.post('/addToCart', auth, (req, res) => {

  //get user info
  User.findOne({_id: req.user._id}, (err, userInfo) => {
    let duplicate = false;
    userInfo.cart.forEach(item => {
      if(item.id === req.body.productId) {
        duplicate = true;
      }    
    });

    // exist product
    if(duplicate) {
      User.findOneAndUpdate(
        {_id: req.user._id, 'cart.id': req.body.productId},
        {$inc: {'cart.$.quantity': 1}},
        {new: true},
        (err, userInfo) => {
          if (err) return res.status(200).json({
            success: false, err
          });
          return res.status(200).json({
            success: true, cart: userInfo.cart
          });
        }
      )
    } 
    // not exist product
    else {
      User.findOneAndUpdate(
        {_id: req.user._id},
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              data: Date.now()
            }
          }
        },
        {new: true},
        (err, userInfo) => {
          if (err) return res.status(400).json({
            success: false, err
          });
          return res.status(200).json({
            success: true, cart: userInfo.cart
          })
        }
      )
    }
  });
});

router.get('/removeFromCart', auth, (req, res) => {
  User.findOneAndUpdate(
    {_id: req.user._id},
    {
      $pull: {
        'cart': {'id': req.query.id}
      }
    },
    {new: true},
    (err, userInfo) => {
      let cart = userInfo.cart;
      let array = cart.map(item => {
        return item.id
      })

      Product.find({_id: {$in: array}})
        .populate('writer')
        .exec((err, productInfo) => {
          return res.status(200).json({
            productInfo,
            cart
          });
        });
    }
  )
});

module.exports = router;
