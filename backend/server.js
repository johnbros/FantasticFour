import express from 'express';

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  // req: request object (contains information about the incoming request)
  // res: response object (used to send a response back to the client)
  res.send('Hello World from Express!'); // Send a simple text response
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});

