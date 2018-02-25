import React, { Component } from 'react';
import cx from 'classnames';
import { ItemTypes } from '../constants';
// import { DragSource } from 'react-dnd';
import styles from './styles.css';

export default class DragItemPreview extends Component {
  render() {
    const { x, y } = this.props;

    console.log('DragItemPreview')

    return (
      <div>
        XXXXXX
      </div>
    );
  }
}

// function collect(connect, monitor) {
//   return {
//     connectDragPreview: connect.dragPreview(),
//     // isDragging: monitor.isDragging()
//   }
// }

//  DragSource(ItemTypes.TASK, {}, collect)(DragItemPreview);
