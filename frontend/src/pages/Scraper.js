import React, { useState } from 'react';
import axios from 'axios';

const ScraperComponent = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const scrapePricesAndRooms = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://localhost:5000/scrape');
            setResult(response.data);
        } catch (error) {
            setError(`Failed to retrieve the data. Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={scrapePricesAndRooms} disabled={loading}>
                {loading ? 'Loading...' : 'Scrape Data'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <pre>{result}</pre>
        </div>
    );
};

export default ScraperComponent;
