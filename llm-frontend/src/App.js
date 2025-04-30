import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  // This function will add the URLs to the latest user message
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/sse_event');

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.url) {
          // Add the URL to the latest user message
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastMessageIndex = updatedMessages.length - 1;
            if (lastMessageIndex >= 0 && updatedMessages[lastMessageIndex].sender === 'user') {
              updatedMessages[lastMessageIndex].urls = [...(updatedMessages[lastMessageIndex].urls || []), parsed.url];
            }
            return updatedMessages;
          });
        }
      } catch (err) {
        console.error("Invalid SSE JSON:", event.data);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  async function handleClick() {
    if (inputValue.trim() === '') return;

    const userText = inputValue;
    setInputValue('');

    // Add user message
    setMessages((prev) => [
      ...prev,
      { text: userText, sender: 'user', urls: [], showDropdown: false } // Add showDropdown flag for individual messages
    ]);

    const response = await fetch('http://localhost:5000/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: userText }),
    });

    const { response: botReply } = await response.json();

    // Add bot reply message
    setMessages((prev) => [
      ...prev,
      { text: botReply, sender: 'bot' }
    ]);
  }

  // Handle dropdown toggle for each user message
  const toggleDropdown = (index) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[index].showDropdown = !updatedMessages[index].showDropdown;
      return updatedMessages;
    });
  };

  return (
    <div className="App">
      <aside className="side">
        <div className="side-newchat_button">
          <span>+</span> New Chat
        </div>
      </aside>

      <section className="chat_area_section">
        <div className="message_container">
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.sender === 'user' && (
                <div className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              )}

              {/* Display URLs specific to this user message */}
              {msg.urls && msg.urls.length > 0 && msg.sender === 'user' && (
                <div className="message bot url-wrapper">
                  <div>
                    <strong>Searched urls:</strong>{' '}
                    {msg.urls.map((url, urlIndex) => (
                      <a key={urlIndex} href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    ))}
                  </div>

                  {msg.urls.length > 1 && (
                    <>
                      <button
                        className="dropdown-btn"
                        onClick={() => toggleDropdown(index)}
                      >
                        {msg.showDropdown ? 'Hide History' : 'Show History'}
                      </button>

                      {msg.showDropdown && (
                        <div className="url-history">
                          {msg.urls.map((url, urlIndex) => (
                            <a
                              key={urlIndex}
                              href={url}
                              className="fading-url"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {url}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {msg.sender === 'bot' && (
                <div className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="input_container">
          <input
            className="chat_area"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleClick}>Send</button>
        </div>
      </section>
    </div>
  );
}

export default App;
