import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { AddressInfo } from 'net';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const app = express();
config();

// server configurations

// Some legacy browsers hang on 204 status code
app.use(cors({ optionsSuccessStatus: 200 }));
app.use('/public', express.static(process.cwd() + '/src/public'));
app.use(bodyParser.text());
app.use(bodyParser.json());

// global setting for safety timeouts to handle possible
// wrong callbacks that will never be called
const TIMEOUT = 10000;

// middleware

/**
 * Middleware function to log request information
 */
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.path} -${req.ip}`);
  next();
});

// routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

/**
 * POST to /api/fileanalyse with binary file
 */
app.post(
  '/api/fileanalyse',
  upload.single('upfile'),
  (req: Request, res: Response) => {
    console.log('req.file: ', req.file);
    console.log('req.body: ', req.body);
    const file = req.file;
    const response = {
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
    };
    return res.json(response);

    /*
     * Example response structure
     * {
     *   name: "testing.txt",
     *   type: "text/plain",
     *   size: 52,
     * }
     */
  },
);

const listener = app.listen(process.env.PORT || 3000, () => {
  const { port } = listener.address() as AddressInfo;
  console.log('Your app is listening on port ' + port);
});
