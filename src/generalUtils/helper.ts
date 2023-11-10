import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
const _ = require("lodash");

export const deleteObjProps = (object: Object, props: Array<string>) => {
  for (let prop of props) {
    delete object[prop];
  }
};

export const toYYYYMMDD = (date: Date) => {
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();
  return [date.getFullYear(), mm > 9 ? mm : '0' + mm, dd > 9 ? dd : '0' + dd].join('-');
}

export const convertDollarsToCents = (amount: number): number => {
  return Math.round(amount * 100);
};

export const updateObjProps = (src: object, dest: object) => {
  Object.keys(dest).forEach((obj) => {
    if (src[obj])
      src[obj] = dest[obj] ? dest[obj] : src[obj];
  });
};

// multer upload options (csv) - don't save file to disk
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

export const newLineToSpace = async function* (source) {
  for await (const chunk of source) {
    yield _.mapValues(chunk, (value) =>
      typeof value === 'string' ? value.replace(/\n/g, ' ') : value,
    );
  }
};
