import React from 'react';
import 'antd/dist/antd.css';
import { PropTypes } from 'prop-types';
import Head from 'next/head';
import wrapper from '../store/configureStore';

// eslint-disable-next-line react/prop-types
function LocalRentalKing({ Component }) {
  return (
    <>
      <Head>
        <meate charSet="utf-8" />
        <title>우리동네 렌탈대장</title>
      </Head>
      <Component />
    </>
  );
}

LocalRentalKing.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(LocalRentalKing);
