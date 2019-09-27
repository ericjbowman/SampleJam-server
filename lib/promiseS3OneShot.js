require('dotenv').config()

const AWS = require('aws-sdk')

const s3 = new AWS.S3()

const fs = require('fs')

// const mime = require('mime')

// const filePath = './IMG_3921.JPG'

// const mimeType = mime.getType(filePath)

const promiseReadFile = function (file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve([data, file])
    })
  })
}

const createParams = function (dataAndFile) {
  console.log(`========data and file==========`, dataAndFile)
  return {
    ACL: 'public-read',
    Bucket: process.env.BUCKET_NAME,
    // Bucket: 'bowmansbucket',
    Key: Math.random().toString().split('.')[1],
    // Key: 'new-oneShot',
    ContentType: dataAndFile[1].mimetype,
    Body: dataAndFile[0]
  }
}

const s3Upload = function (params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
      console.log(`=============S3 Upload data==============`, data)
    })
  })
}

module.exports = {
  promiseReadFile,
  createParams,
  s3Upload
}
