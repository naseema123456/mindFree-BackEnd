import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path'

interface CustomRequest extends Request {
    file: any; // Adjust the type according to your needs
  }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage });

export default upload;
