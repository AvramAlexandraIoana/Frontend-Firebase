// withLayout.tsx
import React from 'react';
import Layout from '../Layout/Layout';

// Decorator (HOC - Higher Order Component)
const withLayout = <P extends {}>(WrappedComponent: React.ComponentType<P>) => (props: P) => (
  <Layout>
    <WrappedComponent {...props} />
  </Layout>
);

export default withLayout;
