/**
 * File Description: PinTask component
 * Updated Date: 01/08/2024
 * Contributors: Samuel
 * Version: 1.0
 */

import React, { useEffect, useState } from 'react';

/**
 * PinTask component for toggling the pin state of a task.
 *
 * @param {boolean} isPinned - initial pin state of the task
 * @param {function} onPinChange - callback function to handle pin state change
 * @param {string} size - size of the icon (px)
 * @returns {JSX.Element} - PinTask element JSX object
 */
const TaskPin = ({ isPinned, onPinChange, size='25' }) => {
  const [pinned, setPinned] = useState(isPinned);
  // change pin when database changed
  useEffect(() => {
    setPinned(isPinned)
  }, [isPinned]);

  const handlePinClick = (e) => {
    e.stopPropagation();
    const newPinState = !pinned;
    setPinned(newPinState);
    if (onPinChange) {
      onPinChange(newPinState);
    }
  };

  const pinEmptyIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="clickable"
      width={size}
      height={size}
      fill="var(--navy)"
      style={{ minWidth: size+'px', minHeight: size+'px' }}
      viewBox="0 0 16 16"
      onClick={handlePinClick}
    >
      <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282"/>
    </svg>
  );

  const pinFilledIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="clickable"
      width={size}
      height={size}
      fill="var(--navy)"
      style={{ minWidth: size+'px', minHeight: size+'px' }}
      viewBox="0 0 16 16"
      onClick={handlePinClick}
    >
      <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354"/>
    </svg>
  );

  return pinned ? pinFilledIcon : pinEmptyIcon;
};

export default TaskPin;
