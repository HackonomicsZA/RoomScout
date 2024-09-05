const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.get('/scrape', async (req, res) => {
    const urlToScrape = 'https://respublica.co.za/residence/yale-village/';
    
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

        let resultString = '';
        if (roomTypes.length && tagsWithPrices.length) {
            resultString = 'Room Types with Prices:\n';
            for (let i = 0; i < Math.min(roomTypes.length, tagsWithPrices.length); i++) {
                resultString += `${roomTypes[i]}: ${tagsWithPrices[i]}\n`;
            }
        } else {
            resultString = "Not enough data to match room types with prices.";
        }

        res.send(resultString);
    } catch (error) {
        res.status(500).send(`Failed to retrieve the webpage. Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
