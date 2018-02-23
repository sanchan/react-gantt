import React, { Component } from 'react';
import { ItemTypes } from '../constants';
import { DragSource } from 'react-dnd';
import styles from './styles.css';

class DragItem extends Component {
  render() {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div
        className="drag-item"
        style={{
          opacity: isDragging ? 0.5 : 1,
          fontSize: 25,
          fontWeight: 'bold',
          cursor: 'move'
        }}
      >
        ♘
      </div>
    );

  }
}

const spec = {
  beginDrag(props) {
    return props.item;
  },

  endDrag(props, monitor) {
    const { onDrop } = props
		const item = monitor.getItem()
    const target = monitor.getDropResult()

    onDrop({ item, target })
	}
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

export default DragSource(ItemTypes.TASK, spec, collect)(DragItem)