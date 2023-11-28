import React, {useState, useEffect} from 'react';

function EllipsisText(text, maxLength) {
    const [ellipsisedText, setEllipsisedText] = useState(text);
    const [showMoreText, setShowMoreText] = useState(false);

    useEffect(() => {
        if (text.length > maxLength) {
            setEllipsisedText(text.slice(0, maxLength) + '...');
            setShowMoreText(true);
        } else {
            setEllipsisedText(text);
            setShowMoreText(false);
        }
    }, [text, maxLength]);

    return {ellipsisedText, showMoreText};
}

export default EllipsisText;
