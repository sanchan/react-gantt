import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

export default class Row extends Component {
  static propTypes = {
    black: PropTypes.bool
  };

  render() {
    const { black } = this.props;
    const fill = black ? 'black' : 'white';

    return <div className="row" />;
  }
}