
import React, { useState, useEffect } from 'react';

const tickerMessages = [
  "Marriage counseling sessions available online",
  "Book a free 15-minute consultation today",
  "New legal resources added every week",
  "Join our relationship wellness webinar",
  "Specialized divorce prevention guidance"
];

const NewsTicker = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % tickerMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="news-ticker overflow-hidden whitespace-nowrap text-white/90 bg-gradient-to-r from-vibrantPurple/80 to-peacefulBlue/80 backdrop-blur-sm px-4 py-1 rounded-full text-sm">
      <div className="animate-marquee inline-block">
        {tickerMessages[currentMessageIndex]}
      </div>
    </div>
  );
};

export default NewsTicker;
