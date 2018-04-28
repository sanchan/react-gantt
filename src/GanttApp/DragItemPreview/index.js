import React, { Component, PureComponent } from 'react';
import cx from 'classnames';
import { ItemTypes } from '../constants';
// import { DragSource } from 'react-dnd';
import styles from './styles.css';

export default class DragItemPreview extends Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return false
  //   // return this.props.isOver !== nextProps.isOver
  // }

  render() {
    const { x, y, children } = this.props;

    // console.log('DragItemPreview.redern')
    window.PERFORMANCE.DragItemPreview++

    const transform = `translate(${x}px, ${y}px)`
    const style =  {
      transform,
      WebkitTransform: transform,
      backgroundColor: 'red'
    }

    const style2 = { top: y, left: x, backgroundColor: 'red' }

    return (
      <div className={cx('drag-item-preview')} style={style}>
        {children || "😮"}
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
