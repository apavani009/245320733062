const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url || [];
  const uniqueNumbers = new Set();

  try {
    const requests = urls.map(async (url) => {
      try {
        const response = await axios.get(url);
        const data = response.data.numbers || [];
        data.forEach((number) => uniqueNumbers.add(number));
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error.message);
      }
    });

    await Promise.all(requests);
    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);

    res.json({ numbers: sortedNumbers });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});