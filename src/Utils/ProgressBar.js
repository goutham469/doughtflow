import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5'; // Import the close icon
import './ProgressBar.css';

export default function Notification({ message, color, duration = 3000, onClose }) {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(100); // Progress starts at 100%

    useEffect(() => {
        // Interval to update the progress bar
        const interval = setInterval(() => {
            setProgress((prev) => (prev > 0 ? prev - 100 / (duration / 100) : 0));
        }, 100);

        // Timeout to hide the notification after the given duration
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose(); // Call onClose callback when the notification disappears
        }, duration);

        // Cleanup intervals and timeout on unmount
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [duration, onClose]);

    if (!visible) return null; // Return null if the notification is no longer visible

    return (
        <div className="notification-popup" style={{ backgroundColor: color }}>
            <div className="notification-content">
                {message}
                <IoClose
                    className="close-icon"
                    onClick={() => {
                        setVisible(false);
                        if (onClose) onClose(); // Handle immediate close
                    }}
                />
            </div>
            <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: 'white' }} />
        </div>
    );
}


// const [notification, setNotification] = useState(null);

// {notification && (
//     <Notification 
//         message={notification.message} 
//         color={notification.color}
//         onClose={() => setNotification(null)} 
//     />
// )}

// setNotification({ message: 'Code copied to clipboard', color: 'green' });