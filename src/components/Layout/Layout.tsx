
import React, { ReactNode } from 'react';
import backgroundImage from '../images/background-img.jpg';
import './Layout.css'; // Import the global styles

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children } : LayoutProps) => {
    return (
      <div className="app-container">
          {children}
      </div>
    );
  };
  
  export default Layout;