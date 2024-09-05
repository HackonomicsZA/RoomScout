const express = require('express');
const { google } = require('googleapis');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3001;

// Replace with your API key and Custom Search Engine ID
const API_KEY = 'AIzaSyD8ib9D7jh-j1aAwsXjgW-x6bcrM2Gs0lg';
const CX = '7307bc163b1e24fdf';

app.use(express.json());

const scrapePage = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract the first heading (h1, h2, etc.) and image URLs
        const headings = [];
        const images = [];

        // Extract headings
        $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
            headings.push($(elem).text().trim());
        });

        // Extract images (limit to first two)
        $('img').each((i, elem) => {
            if (i < 2) {
                images.push($(elem).attr('src'));
            }
        });

        return { headings, images };
    } catch (error) {
        console.error('Error scraping page:', error);
        return { headings: [], images: [] };
    }
};

app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    const customsearch = google.customsearch('v1');

    try {
        const response = await customsearch.cse.list({
            auth: API_KEY,
            cx: CX,
            q: query
        });

        const results = response.data.items || [];

        // Scrape additional details for each result
        const detailedResults = await Promise.all(results.slice(0, 10).map(async (result, index) => {
            const { headings, images } = await scrapePage(result.link);
            return {
                index: index + 1,
                link: result.link,
                headings,
                images
            };
        }));

        res.json(detailedResults);
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).send('Error performing search');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
