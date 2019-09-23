
const express = require('express')
const Upload = require('../models/upload')
const multer = require('multer')
const router = express.Router()
const multerUpload = multer({ dest: 'tempFiles/' })
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const { s3Upload, createParams, promiseReadFile } = require('../../lib/promiseS3Upload.js')

router.post('/uploads', multerUpload.single('file'), (req, res, next) => {
  promiseReadFile(req.file)
    .then(createParams)
    .then(s3Upload)
    .then(s3Response => Upload.create({ url: s3Response.Location, title: req.body.title }))
    .then(upload => {
      res.status(201).json({ upload: upload.toObject() })
    })
    .then(console.log)
    .catch(next)
  // req.body.upload.owner = req.user.id
  // Upload.create(req.body.upload)
  //   // respond to succesful `create` with status 201 and JSON of new "upload"
  //   .then(upload => {
  //     res.status(201).json({ upload: upload.toObject() })
  //   })
  //   // if an error occurs, pass it off to our error handler
  //   // the error handler needs the error message and the `res` object so that it
  //   // can send an error message back to the client
  //   .catch(next)
})

router.get('/uploads', (req, res, next) => {
  Upload.find()
    .then(uploads => {
      // `uploads` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return uploads.map(upload => upload.toObject())
    })
    // respond with status 200 and JSON of the uploads
    .then(uploads => res.status(200).json({ uploads: uploads }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.delete('/uploads/:id', (req, res, next) => {
  Upload.findById(req.params.id)
    .then(handle404)
    .then(upload => {
      // throw an error if current user doesn't own `upload`
      // requireOwnership(req, upload)
      // delete the upload ONLY IF the above didn't throw
      upload.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
