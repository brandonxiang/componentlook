//@ts-nocheck
import React, { Component } from 'react';
import Head from './head.tsx';
import Foot from './foot.tsx';

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
