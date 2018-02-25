import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import CustomDragLayer from './CustomDragLayer';
import DropCatcher from './DropCatcher';
import Row from './Row';
import { ItemTypes } from './constants';

class Gantt extends Component {
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
      id: 1,
      rowId: 1,
      pos: 50
    },/* {
      rowId: 2,
      pos: 0
    }, {
      rowId: 3,
      pos: 0
    }, {
      rowId: 4,
      pos: 0
    }*/]
  }

  handleDrop = ({ item, target }) => {
    if (!target) {
      return;
    }

    const newItems = _.map(this.state.items, (i) => (
      item.id === i.id ? { ...i, rowId: target.id} : i
    ))

    this.setState({
      items: newItems
    })
  }

  renderRow = (row, idx) => {
    const { items } = this.state;
    const rowItems = _.filter(items, { rowId: row.id });

    return (
      <Row key={idx} row={row} items={rowItems} onDrop={this.handleDrop} renderDraggedItem={this.handleRenderDraggedItem} />
    )
  }

  handleRenderDraggedItem = (dragItemComponent) => {
    if (!_.isEqual(dragItemComponent, this.state.dragItem)) {
      this.setState({
        dragItem: dragItemComponent
      });
    }
  }

  render() {
    const { rows, dragItem } = this.state;

    // console.log('dragItem', dragItem)

    return (
      <div>
        <DropCatcher renderDraggedItem={this.handleRenderDraggedItem}>
          {_.map(rows, this.renderRow)}
          <CustomDragLayer snapToGrid={false} dragItem={dragItem} />
        </DropCatcher>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Gantt)
