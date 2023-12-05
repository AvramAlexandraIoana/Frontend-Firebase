import React from 'react';
import Layout from '../../components/Layout/Layout';

const withLayout = (WrappedComponent: React.ComponentType) => {
  return class extends React.Component {
    render() {
      return (
        <Layout>
          <WrappedComponent {...this.props} />
        </Layout>
      );
    }
  };
};

export default withLayout;
