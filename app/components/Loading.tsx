'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolleyball, faBasketball, faFrog } from '@fortawesome/free-solid-svg-icons';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setVisible(false), 500); // Give some time for the fade-out animation
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    visible && (
      <div
        className={`fa-3x fixed inset-0 flex items-center justify-center bg-slate-800 bg-opacity-100 z-50 transition-opacity duration-500 ${
          isLoading ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <FontAwesomeIcon
          icon={faVolleyball}
          className="fa-bounce mr-3"
          style={{
            '--fa-bounce-height': `-${random(30, 150)}px`,
            '--fa-animation-duration': '1s',
          }}
        />
        <FontAwesomeIcon
          icon={faFrog}
          className="fa-bounce mr-3"
          color="lightgreen"
          style={{
            '--fa-bounce-start-scale-x': '1',
            '--fa-bounce-start-scale-y': '1',
            '--fa-bounce-jump-scale-x': '1',
            '--fa-bounce-jump-scale-y': '1',
            '--fa-bounce-land-scale-x': '1.2',
            '--fa-bounce-land-scale-y': '0.8',
            '--fa-bounce-height': `-${random(50, 160)}px`,
            '--fa-animation-duration': '1s',
          }}
        />
        <FontAwesomeIcon
          icon={faBasketball}
          className="fa-bounce mr-3"
          color="orange"
          style={{
            '--fa-bounce-land-scale-x': '1.2',
            '--fa-bounce-land-scale-y': '0.8',
            '--fa-bounce-rebound': '5px',
            '--fa-bounce-height': `-${random(10, 180)}px`,
            '--fa-animation-duration': '1s',
          }}
        />
      </div>
    )
  );
};

export default Loading;
