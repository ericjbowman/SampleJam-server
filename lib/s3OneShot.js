require('dotenv').config()

const AWS = require('aws-sdk')

const s3 = new AWS.S3()

const fs = require('fs')

const mime = require('mime')

const filePath = './IMG_3921.JPG'

const mimeType = mime.getType(filePath)

fs.readFile(filePath, (err, data) => {
  if (err) {
    console.log(err)
    return
  }
  const params = {
    ACL: 'public-read',
    Bucket: process.env.BUCKET_NAME,
    Key: Math.random().toString().split('.')[1],
    // Key: 'image-oneShot',
    ContentType: mimeType,
    Body: data
  }
  console.log('==============MIME TYPE==============', mimeType)
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log(data)
    }
  })
})
