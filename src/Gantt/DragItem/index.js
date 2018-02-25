import React, { Component } from 'react';
import cx from 'classnames';
import { ItemTypes } from '../constants';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend'
import styles from './styles.css';

class DragItem extends Component {
  componentDidMount() {
		// Use empty image as a drag preview so browsers don't draw it
		// and we can draw whatever we want on the custom drag layer instead.
		this.props.connectDragPreview(getEmptyImage(), {
			// IE fallback: specify that we'd rather screenshot the node
			// when it already knows it's being dragged so we can hide it with CSS.
			// captureDraggingState: true,
		})
  }

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
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

export default DragSource(ItemTypes.TASK, spec, collect)(DragItem);