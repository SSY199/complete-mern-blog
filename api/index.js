import express from 'express';

const app = express();

app.listen(5353, () => {
  console.log('Server is running on port 5353');
});