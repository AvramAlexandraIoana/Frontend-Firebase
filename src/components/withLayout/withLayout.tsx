// withLayout.tsx
import React from 'react';
import Layout from '../Layout/Layout';

// Decorator (HOC - Higher Order Component)
// Description: The Decorator pattern is used to enhance the Register component by wrapping it with a higher-order component (HOC) called withLayout.
// This HOC adds a common layout (Layout component) around the Register component, providing consistent styling or functionality to multiple components without modifying their code directly.
const withLayout = <P extends {}>(WrappedComponent: React.ComponentType<P>) => (props: P) => (
  <Layout>
    <WrappedComponent {...props} />
  </Layout>
);

export default withLayout;
