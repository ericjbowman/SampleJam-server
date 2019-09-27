const express = require('express')
const OneShot = require('../models/oneShot')
const multer = require('multer')
const router = express.Router()
const multerOneShot = multer({ dest: 'tempFiles/' })
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const { s3Upload, createParams, promiseReadFile } = require('../../lib/promiseS3OneShot.js')

router.post('/oneShots', multerOneShot.single('file'), (req, res, next) => {
  promiseReadFile(req.file)
    .then(createParams)
    .then(s3Upload)
    .then(s3Response => OneShot.create({ url: s3Response.Location, title: req.body.title }))
    .then(oneShot => {
      res.status(201).json({ oneShot: oneShot.toObject() })
    })
    .then(console.log)
    .catch(next)
  // req.body.oneShot.owner = req.user.id
  // OneShot.create(req.body.oneShot)
  //   // respond to succesful `create` with status 201 and JSON of new "oneShot"
  //   .then(oneShot => {
  //     res.status(201).json({ oneShot: oneShot.toObject() })
  //   })
  //   // if an error occurs, pass it off to our error handler
  //   // the error handler needs the error message and the `res` object so that it
  //   // can send an error message back to the client
  //   .catch(next)
})

router.get('/oneShots', (req, res, next) => {
  OneShot.find()
    .then(oneShots => {
      // `oneShots` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return oneShots.map(oneShot => oneShot.toObject())
    })
    // respond with status 200 and JSON of the oneShots
    .then(oneShots => res.status(200).json({ oneShots: oneShots }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.delete('/oneShots/:id', (req, res, next) => {
  OneShot.findById(req.params.id)
    .then(handle404)
    .then(oneShot => {
      // throw an error if current user doesn't own `oneShot`
      // requireOwnership(req, oneShot)
      // delete the oneShot ONLY IF the above didn't throw
      oneShot.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
