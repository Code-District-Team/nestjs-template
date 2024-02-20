import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
const _ = require("lodash");


/**
 * Removes specified properties from an object.
 * It takes an object and an array of property names as arguments.
 * The function iterates through the array and deletes each property from the object.
 */
export const deleteObjProps = (object: Object, props: Array<string>) => {
  for (let prop of props) {
    delete object[prop];
  }
};

/**
 * Converts a Date object into a string formatted as 'YYYY-MM-DD'.
 * It handles month and day values less than 10 by prefixing them with a '0' 
 * to ensure a consistent two-digit format. The function assembles the date components 
 * into the desired format and returns the resulting string.
 */
export const toYYYYMMDD = (date: Date) => {
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();
  return [date.getFullYear(), mm > 9 ? mm : '0' + mm, dd > 9 ? dd : '0' + dd].join('-');
}

/**
 * A simple utility function that converts a dollar amount to cents.
 * It multiplies the input amount by 100 and rounds it to the nearest whole number,
 * effectively converting dollars to cents.
 */
export const convertDollarsToCents = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * A utility function to update properties of a source object (`src`) with values from a destination object (`dest`).
 * It iterates over the keys of the destination object. 
 * If a property exists in the source object, it updates the source property with the destination value, 
 * unless the destination value is falsy, in which case the source value is retained.
 */
export const updateObjProps = (src: object, dest: object) => {
  Object.keys(dest).forEach((obj) => {
    if (src[obj])
      src[obj] = dest[obj] ? dest[obj] : src[obj];
  });
};

// multer upload options (csv) - don't save file to disk
/**
 * Configuration object for Multer, specifically tailored for CSV file uploads.
 * It sets a file size limit to 100MB and restricts uploads to only CSV file format.
 * If an uploaded file is not a CSV, it rejects the file and throws an HTTP exception.
 * The storage configuration uses disk storage with the destination path set to './public'.
 * It includes logic to automatically create the destination folder if it doesn't exist.
 * The filename is uniquely generated using uuid, keeping the original file extension.
 */
export const multerOptionsCSV = {
  // Enable file size limits (100 MB)
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(csv)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = './public';
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};

/**
 * Configuration object for Multer, defining options for file uploads.
 * It sets a file size limit to 5MB and filters uploads to allow only specific image formats (jpg, jpeg, png, gif).
 * If an uploaded file doesn't match the allowed types, it throws an HTTP exception.
 * The storage configuration uses disk storage with a specified destination path './public'.
 * It includes logic to create the destination folder if it doesn't exist.
 * The filename is set to a unique identifier using uuid, retaining the original file extension.
 */

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = './public';
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};


/**
 * An asynchronous generator function that processes a stream of data, replacing new line characters with spaces.
 * For each chunk of data received from the source stream, it iterates over each value.
 * If a value is a string, it replaces all occurrences of the newline character ('\n') with a space.
 * Other types of values are passed through unchanged. The modified chunk is then yielded for further processing.
 */
export const newLineToSpace = async function* (source) {
  for await (const chunk of source) {
    yield _.mapValues(chunk, (value) =>
      typeof value === 'string' ? value.replace(/\n/g, ' ') : value,
    );
  }
};
