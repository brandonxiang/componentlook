//@ts-nocheck
import React, { Component } from 'react';
import Head from './head.jsx';
import Foot from './foot.jsx';

export default class MyComponent extends Component {
  render() {
    return (
      <div>
        <Head />
        <div>Hello, World!</div>
        <Foot />
      </div>
    );
  }
}
