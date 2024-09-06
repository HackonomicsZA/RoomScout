import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Filter.css';

function Filter() {
  const [data, setData] = useState(null);
  const [url, setUrl] = useState('https://campusafrica.co.za/residences/80-jorissen/');
  const [searchTerm, setSearchTerm] = useState('');

  const urls = [
    'https://campusafrica.co.za/residences/80-jorissen/',
    'https://campusafrica.co.za/residences/rennie-house-apartments/',
    'https://campusafrica.co.za/residences/49-jorissen/',
    'https://campusafrica.co.za/residences/braamlofts/',
    'https://campusafrica.co.za/residences/wynton-joy/',
    'https://campusafrica.co.za/residences/dunvista-mansions/',
    'https://campusafrica.co.za/residences/126-siemert/',
    'https://campusafrica.co.za/residences/ymca/',
    'https://campusafrica.co.za/residences/49-jorissen/'
  ];

  const handleSearch = () => {
    const foundUrl = urls.find(url => url.includes(searchTerm.toLowerCase()));
    if (foundUrl) {
      setUrl(foundUrl);
      fetchData(foundUrl);
    } else {
      alert('Please select a residence');
    }
  };

  const fetchData = (urlToFetch) => {
    axios.get('http://127.0.0.1:5000/api/scrape', { params: { url: urlToFetch } })
      .then(response => setData(response.data))
      .catch(error => {
        console.error('Error fetching data:', error);
        alert('Error fetching data!');
      });
  };

  return (
    <main className="App">
      <header className='header'>
        <select id="select-search-bar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}>
          <option>Search for a name</option> 
          <option>80-jorissen</option>
          <option>rennie-house-apartments</option>
          <option>49-jorissen</option>
          <option>braamlofts</option>
          <option>wynton-joy</option>
          <option>dunvista-mansions</option>
          <option>126-siemert</option>
          <option>ymca</option>
          <option>49-jorissen</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </header>
      <section className='lowerPart'>
        <div>
          {data ? (
            <div>
              <section className='building details'>
                <section className='build'>
                  <h2>For application visit:</h2>
                  <p>
                    <a href={data.provided_url} target="_blank" rel="noopener noreferrer">
                      {data.provided_url}
                    </a>
                  </p>
                </section>
                <section className='build'>
                  <h2>Booking Fee:</h2>
                  <p>{data.booking_fee}</p>
                </section>
              </section>

              <section className='rooms'>
                <h2 class="h2-Room-details">Room Details:</h2>
                {data.room_details.map((item, index) => (
                  <div className='room' key={index}>
                    <p className='typeroom'>Room: {item.room}</p>
                    <p>Price: {item.price}</p>
                  </div> 
                ))}
              </section>

              {/* Slideshow for images */}
              <section className='images'>
                <h2 class="h2-images">Images:</h2>
                <ImageSlideshow urls={data.urls} />
              </section>
            </div>
          ) : (
            <p>No data fetched yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function ImageSlideshow({ urls }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Automatically change the image every 3 seconds when slideshow is playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === urls.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // 3-second interval

      return () => clearInterval(interval);
    }
  }, [isPlaying, urls.length]);

  // Handle next/previous image manually
  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? urls.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex === urls.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {urls.length > 0 && (
        <div>
          {/* Display current image */}
          <img
            src={urls[currentIndex]}
            alt={`Image ${currentIndex}`}
            style={{ maxWidth: '400px', height: 'auto', borderRadius: '8px' }}
          />
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        {/* Controls for navigation and slideshow */}
        <button class="previous-button" onClick={handlePrevious} style={buttonStyle}>
          Previous
        </button>
        <button class="next-button"onClick={handleNext} style={buttonStyle}>
          Next
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} style={buttonStyle}>
          {isPlaying ? 'Stop' : 'Start'} Slideshow
        </button>
      </div>
    </div>
  );
}

// Button styling
const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  fontSize: '16px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#1e90ff',
  color: 'white',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

export default Filter;