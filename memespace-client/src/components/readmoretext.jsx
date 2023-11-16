import React, { useState } from 'react';

function ReadMoreText({ text, maxLength = 100 }) {
  const [showFullText, setShowFullText] = useState(false);
  const shouldTruncate = text.length > maxLength;

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  const viewMoreStyle = {
    color: 'blue', 
    cursor: 'pointer',
  }

  return (
    <div>
        {showFullText ? text : text.slice(0, maxLength)}

        {shouldTruncate && !showFullText && <span style={{padding: 0}}>... </span>}
        {shouldTruncate && showFullText && <span style={{padding: 0}}>{' '}</span>}

        {shouldTruncate && (
        <a onClick={toggleText} style={viewMoreStyle}>
            {showFullText ? 'Show less' : 'Show More'}
        </a>
        )}
    </div>
  );
}

export default ReadMoreText;