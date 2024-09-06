const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.get('/scrape', async (req, res) => {
    const urlToScrape = req.query.url; // Make sure the backend dynamically scrapes the URL provided
    try {
        const { data } = await axios.get(urlToScrape);
        const $ = cheerio.load(data);

        const pricePattern = /\bprice\b|\bcost\b|\bamount\b/i;
        const tagsWithPrices = [];
        $('*').each((index, element) => {
            const classAttr = $(element).attr('class') || '';
            if (pricePattern.test(classAttr)) {
                const text = $(element).text().trim();
                if (text) {
                    tagsWithPrices.push(text);
                }
            }
        });

        const roomTypes = [];
        ['h3', 'p'].forEach(tagName => {
            $(tagName).each((index, element) => {
                const classAttr = $(element).attr('class') || '';
                if (/\btitle\b/i.test(classAttr)) {
                    const text = $(element).text().trim();
                    if (text) {
                        roomTypes.push(text);
                    }
                }
            });
        });

        // Prepare a structured JSON response
        const roomDetails = roomTypes.map((roomType, index) => ({
            room: roomType,
            price: tagsWithPrices[index] || 'N/A'
        }));

        const responseJson = {
            provided_url: urlToScrape,
            booking_fee: tagsWithPrices[0] || 'N/A', // Assume first price is booking fee if present
            room_details: roomDetails,
            urls: [] // Add logic to extract any image URLs if needed
        };

        res.json(responseJson); // Return JSON object
    } catch (error) {
        res.status(500).send(`Failed to retrieve the webpage. Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
