import { S3, config } from 'aws-sdk';

const { GetObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: process.env.AWS_DEFAULT_REGION,
});

config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

const client = new S3Client(); // Pass in opts to S3 if necessary

export const getObject = (Bucket, Key) => {
  return new Promise(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({ Bucket, Key });

    try {
      const response = await client.send(getObjectCommand);

      let responseDataChunks = [];

      response.Body.once('error', (err) => reject(err));

      response.Body.on('data', (chunk) => responseDataChunks.push(chunk));

      response.Body.once('end', () => resolve(responseDataChunks.join('')));
    } catch (err) {
      // Handle the error or throw
      return reject(err);
    }
  });
};

export const createSignedLink = async (
  bucketName,
  key,
  UrlType,
  expiryTime = 50 * 10,
) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiryTime,
      // ContentType: contentType,
    };
    const signedURL = await s3.getSignedUrlPromise(UrlType, params);
    return signedURL;
  } catch (e) {
    throw new Error('Failed to create upload link');
  }
};

const deleteS3File = async (bucketName, key) => {
  try {
    let params = { Bucket: bucketName, Key: key };
    return await s3.deleteObject(params).promise();
  } catch (err) {
    throw new Error(err);
  }
};
