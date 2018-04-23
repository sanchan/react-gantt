import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import CustomDragLayer from './CustomDragLayer';
import DropCatcher from './DropCatcher';
import TrashCan from './TrashCan';
import Row from './Row';
import { ItemTypes } from './constants';


/**
 * TODO
 * - Create decorator for components that receive 'renderDraggedItem'
 */
class Gantt extends Component {
  // NOTE Right now we are using the state (I'm too lazy to config redux :P), eventually we will move to redux
  static propTypes = {
    rows: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      data: PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
      })
    })).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      rowId: PropTypes.number.isRequired,
      data: PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
      })
    })).isRequired
  };

  state = {
    rows: _.times(100, t => ({
      id: t + 1,
      data: {
        start: 0,
        end: 3000,
        step: 32, // The sticky gap value
      }
    })),
    items: [{
      id: 1,
      rowId: 1,
      data: {
        start: 32,
        end: 96
      }
    }]
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

  handleRenderDraggedItem = (dragItemComponent) => {
    if (!_.isEqual(dragItemComponent, this.state.dragItem)) {
      this.setState({
        dragItem: dragItemComponent
      });
    }
  }

  renderRow = (row, idx) => {
    const { items } = this.state;
    const rowItems = _.filter(items, { rowId: row.id });

    return (
      <Row key={idx} row={row} items={rowItems} onDrop={this.handleDrop} renderDraggedItem={this.handleRenderDraggedItem} />
    )
  }

  render() {
    const { rows, dragItem } = this.state;

    return (
      <div>
        <DropCatcher renderDraggedItem={this.handleRenderDraggedItem}>
          {_.map(rows, this.renderRow)}
          <TrashCan renderDraggedItem={this.handleRenderDraggedItem} />
        </DropCatcher>

        <CustomDragLayer dragItem={dragItem} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Gantt)
