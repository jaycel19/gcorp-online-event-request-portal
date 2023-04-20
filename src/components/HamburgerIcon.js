import React from 'react';

function HamburgerIcon(props) {
  return (
    <button onClick={()=> props.setSideNavOpen(true)} style={{
      backgroundColor: 'transparent',
      border: 'none', 
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={props.width} height={props.height}>
        <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
      </svg>
    </button>
  );
}

export default HamburgerIcon;