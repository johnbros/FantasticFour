import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';


dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});

