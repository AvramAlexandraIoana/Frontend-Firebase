// Description: 
// The Layout component provides a common layout structure for other components.
// It serves as a higher-order component (HOC) that can be applied to different parts of the application.

import React, { ReactNode } from 'react';
import backgroundImage from '../images/background-img.jpg';
import './Layout.css'; // Import the global styles

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
      <div className="app-container">
          {children}
      </div>
    );
};

export default Layout;