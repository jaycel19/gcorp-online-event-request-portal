import React from 'react';
import '../css/HamburgerIcon.css';

function HamburgerIcon(props) {
  return (
    <button className='HamburgerIcon' onClick={()=> props.setSideNavOpen(true)} style={{
      backgroundColor: 'transparent',
      border: 'none', 
      display: 'none',
      cursor: 'pointer'
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={props.width} height={props.height}>
        <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
      </svg>
    </button>
  );
}

export default HamburgerIcon;