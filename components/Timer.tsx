"use client"

import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp }) => {
  const [time, setTime] = useState(initialTime);


  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      onTimeUp();
    }

    return () => {
      clearInterval(interval);
    };
  }, [time, onTimeUp]);


  return <div>{time} seconds</div>;
};

export default Timer;