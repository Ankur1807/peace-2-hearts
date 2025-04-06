
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Define our typing messages
const typingPhrases = [
  "Support, Trust, and Care",
  "Before, During, and After Marriage"
];

const NewsTicker = () => {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Calculate typing/deleting speed (4 characters per second = 250ms per character)
  const typingSpeed = 250; // milliseconds per character

  useEffect(() => {
    // Toggle cursor blinking effect
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const currentPhrase = typingPhrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.substring(0, currentText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((currentPhraseIndex + 1) % typingPhrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex]);

  return (
    <Link to="/services" className="cursor-pointer block">
      <div className="news-ticker overflow-hidden text-white/90 bg-gradient-to-r from-vibrantPurple/80 to-peacefulBlue/80 backdrop-blur-sm px-4 py-2 rounded-full">
        <div className="flex justify-center items-center h-6">
          <span className="text-lg font-medium tracking-wide">
            {currentText}
            <span className={`inline-block w-2 h-5 ml-1 bg-white ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.2s' }}></span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NewsTicker;
