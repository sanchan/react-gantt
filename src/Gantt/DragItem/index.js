import React, { Component } from 'react';
import cx from 'classnames';
import { ItemTypes } from '../constants';
import { DragSource } from 'react-dnd';
import styles from './styles.css';

class DragItem extends Component {
  render() {
    const { connectDragSource, isDragging } = this.props;

    if (isDragging) {
      return null;
    }

    return connectDragSource(
      <div className={cx('drag-item')}>
        ♘ x {isDragging && 'wiiii'}
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

export default DragSource(ItemTypes.TASK, spec, collect)(DragItem);