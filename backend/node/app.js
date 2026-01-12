import express from 'express';
import cors from 'cors';
import  {downloadDicomFile } from './dicom-downloader.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ message: 'The server is running' });
});

app.post('/api/dicom-metadata', async (req, res) => {
  // To be implemented by candidate
  res.status(501).json({ error: 'Not implemented' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 