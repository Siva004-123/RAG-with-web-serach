import React, { useState, useEffect } from 'react';
import './URLStreamDisplay.css'; // Create a CSS file for this component

function URLStreamDisplay() {
  const [currentURL, setCurrentURL] = useState('');
  const [allURLs, setAllURLs] = useState([]);
  const [showAllURLs, setShowAllURLs] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/sse_event'); // Adjust URL if needed

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.url) {
          setCurrentURL(data.url);
          setAllURLs((prevURLs) => [...prevURLs, data.url]);
        }
      } catch (error) {
        console.error('Error parsing SSE event data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const toggleShowAllURLs = () => {
    setShowAllURLs(!showAllURLs);
  };

  return (
    <div className="url-stream-container">
      <div className="current-url">
        {currentURL ? `Current URL: ${currentURL}` : 'No URL received yet.'}
      </div>
      <button onClick={toggleShowAllURLs} className="dropdown-button">
        {showAllURLs ? 'Hide All URLs' : 'Show All URLs'}
      </button>
      {showAllURLs && (
        <div className="all-urls-list">
          <h3>All Accessed URLs:</h3>
          <ul>
            {allURLs.map((url, index) => (
              <li key={index}>{url}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default URLStreamDisplay;