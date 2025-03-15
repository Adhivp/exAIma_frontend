// src/components/InternetSpeed.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InternetSpeed = ({ darkMode }) => {
  const [speed, setSpeed] = useState(null);
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    const checkSpeed = async () => {
      const startTime = new Date().getTime();
      try {
        console.log('Starting speed test with 10MB file...');
        // First attempt with 10MB file
        let response = await fetch('https://speed.cloudflare.com/__down?bytes=10000000', {
          cache: 'no-store',
          mode: 'cors',
        });

        if (!response.ok) {
          console.log('10MB file failed, trying 1MB file...', response.status);
          // Fallback to 1MB file if 10MB fails
          response = await fetch('https://speed.cloudflare.com/__down?bytes=1000000', {
            cache: 'no-store',
            mode: 'cors',
          });
          if (!response.ok) {
            throw new Error('Both file sizes failed');
          }
        }

        console.log('Response received, checking Content-Length...');
        const fileSizeBytes = parseInt(response.headers.get('Content-Length'), 10);
        if (isNaN(fileSizeBytes) || fileSizeBytes === 0) {
          throw new Error('Invalid Content-Length');
        }
        const fileSizeMB = fileSizeBytes / (1024 * 1024); // Convert to MB

        console.log(`File size: ${fileSizeMB} MB`);
        // Read the entire response body to measure download time
        const blob = await response.blob();
        const endTime = new Date().getTime();

        const duration = (endTime - startTime) / 1000; // Duration in seconds
        console.log(`Download duration: ${duration} seconds`);
        if (duration === 0) {
          throw new Error('Duration is zero, cannot calculate speed');
        }

        // Calculate speed in Mbps (Megabits per second)
        const speedMbps = (fileSizeMB * 8) / duration;
        console.log(`Calculated speed: ${speedMbps} Mbps`);

        setSpeed(speedMbps.toFixed(1));
        if (speedMbps < 1) {
          setStatus('Weak');
        } else if (speedMbps < 5) {
          setStatus('Moderate');
        } else {
          setStatus('Good');
        }
      } catch (error) {
        console.error('Speed test error:', error.message);
        setSpeed(0);
        setStatus('No Connection');
      }
    };

    checkSpeed();
    const interval = setInterval(checkSpeed, 60000); // Run every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'Weak':
      case 'No Connection':
        return 'red';
      case 'Moderate':
        return 'yellow';
      case 'Good':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-56 h-36 p-4 rounded-2xl shadow-lg overflow-hidden border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-100'
      } flex flex-col items-center justify-center`}
      whileHover={{
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="h-2 w-full bg-gradient-to-r from-green-400 to-green-600 mb-3" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-8 w-8 text-${getStatusColor()}-500 mb-2`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
        />
      </svg>
      <p className={`text-base font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Internet Speed
      </p>
      <p className={`text-sm font-semibold text-${getStatusColor()}-500 mt-1`}>
        {speed !== null ? `${speed} Mbps` : 'Measuring...'} - {status}
      </p>
    </motion.div>
  );
};

export default InternetSpeed;