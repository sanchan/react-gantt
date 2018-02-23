import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Row from './Row';
import DragItem from './DragItem';

export default class Gantt extends Component {
  // NOTE Right now we are using the state (I'm too lazy to config redux :P), eventually we will move to redux
  static propTypes = {
    rows: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      rowId: PropTypes.number.isRequired,
      pos: PropTypes.number.isRequired,
    })).isRequired
  };

  state = {
    rows: [{
      id: 1
    }, {
      id: 2
    }, {
      id: 3
    }, {
      id: 4
    }],
    items: [{
      rowId: 1,
      pos: 0
    }, {
      rowId: 2,
      pos: 0
    }, {
      rowId: 3,
      pos: 0
    }, {
      rowId: 4,
      pos: 0
    }]
  }

  renderItem = (item) => (
    <DragItem />
  )

  renderRow = (row) => {
    const { items } = this.state;
    const rowItems = _.filter(items, { rowId: row.id });

    return (
      <Row>
        {_.map(rowItems, this.renderItem)}
      </Row>
    )
  }

  render() {
    const { rows } = this.state;

    return (
      <div>
        {_.map(rows, this.renderRow)}
      </div>
    );
  }
}