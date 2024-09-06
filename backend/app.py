from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route('/api/scrape', methods=['GET'])
def scrape():
    # URL parameter from the query string
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'No URL provided.'}), 400

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract booking fee
        booking_fee = soup.find('strong', class_='')
        booking_fee_text = booking_fee.get_text(strip=True) if booking_fee else 'Booking fee not found.'

        # Extract room titles and prices
        room_titles = soup.find_all('p', class_='room_title')
        price_tags = soup.find_all('p', class_='price')
        
        room_details = []
        if len(room_titles) == len(price_tags):
            for room_title, price_tag in zip(room_titles, price_tags):
                room_details.append({
                    'room': room_title.get_text(strip=True),
                    'price': price_tag.get_text(strip=True)
                })
        else:
            return jsonify({'error': 'Mismatch between number of room titles and prices.'}), 500

        # Extract URLs from <a> tags with a class that includes 'galimg'
        links = soup.find_all('a', class_=lambda x: x and 'galimg' in x)
        urls = []
        for link in links[:10]:  # Limit to the first 10 links
            href = link.get('href')
            data_bg = link.get('data-bg')
            if href:
                urls.append(href)
            elif not href and not data_bg:
                urls.append('No href or data-bg attribute found in this tag.')

        # Return JSON response including the provided URL
        return jsonify({
            'provided_url': url,
            'booking_fee': booking_fee_text,
            'room_details': room_details,
            'urls': urls
        })

    except requests.RequestException as e:
        return jsonify({'error': f'Failed to retrieve the page: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
