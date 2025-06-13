import React from 'react';
import BulletPoint from './BulletPoint';

const BulletList = ({ 
  items, 
  textColor = 'text-sand/90',
  bulletColor = 'text-sand/60',
  isAnimated = false,
  className = '',
  spacing = 'space-y-2 sm:space-y-3'
}) => {
  return (
    <ul className={`${spacing} ${className}`}>
      {items.map((item, index) => (
        <li key={index}>
          <BulletPoint
            text={item}
            textColor={textColor}
            bulletColor={bulletColor}
            isAnimated={isAnimated}
            delay={index * 0.1}
          />
        </li>
      ))}
    </ul>
  );
};

export default BulletList; 