import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { ItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';
import DragItem from '../DragItem';
import DragItemPreview from '../DragItemPreview';
import snapToGrid from '../snapToGrid'
import styles from './styles.css';

class Row extends Component {
  static propTypes = {
    row: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    onDrop: PropTypes.func.isRequired,

    // From DropTarget
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    itemType: PropTypes.string.isRequired,
  };

  /**
   * We must make transformation using:
   * - item.data.start: The item's start value/timestamp;
   * - item.data.end: The item's end value/timestamp;
   * - Row.start: The row's start value/timestamp.
   * - Row.end: The row's end value/timestamp.
   */
  stylesForItem = (item) => {
    return {
      left: item.data.start,
      width: item.data.end - item.data.start
    }
  }

  renderItem = (item, idx) => (
    <DragItem key={idx} item={item} onDrop={this.props.onDrop} style={this.stylesForItem(item)} />
  )

  render() {
    const { items, connectDropTarget, isOver, canDrop, itemType, children } = this.props;

    return connectDropTarget(
      <div className={cx("row", itemType && !canDrop && 'cant-drop', itemType && isOver && 'is-over')}>
        {_.map(items, this.renderItem)}
      </div>
    );
  }
}

const snapToRow = (sourceOffset, componentClientReact, row) => {
  const snappedX = Math.round(sourceOffset.x / row.data.step) * row.data.step

  // This is were the potential new position of the item,
  // we need next to 'snap' this value to the closest step
  const currentValue = {
    x: sourceOffset.x - componentClientReact.x,
    y: sourceOffset.y - componentClientReact.y,
  }

  return {
    x: (Math.round(currentValue.x / row.data.step) * row.data.step) + componentClientReact.x,
    y: componentClientReact.y
  }
}

let prevX, prevY
const spec = {
  canDrop(props) {
    // Check permissions
    return true;
  },

  /**
   * This returns the object will be passed to DragSource.spec.endDrag through
   * monitor.getDropResult()
   */
  drop(props, monitor, component) {
    const { onDrop } = props

    return props.row
  },

  hover(props, monitor, component) {
    // // The exact mouse coordinates relative to the 'viewport' when the drag starts
    // const initialClientOffset = monitor.getInitialClientOffset()

    // // The coordinates (0,0) relative to the 'viewport' of the drag source when the drag starts
    // const initialSourceClientOffset = monitor.getInitialSourceClientOffset()

    // // The inner coordinates of the drag event
    // const sourceOriginOffset = {
    //   x: initialClientOffset.x - initialSourceClientOffset.x,
    //   y: initialClientOffset.y - initialSourceClientOffset.y
    // }

    // The exact mouse coordinates relative to the 'viewport'
    const clientOffset = monitor.getClientOffset()

    const componentClientReact = ReactDOM.findDOMNode(component).getBoundingClientRect()

    const { x, y } = snapToRow(clientOffset, componentClientReact, props.row)

    if (x === prevX && y === prevY) {
      return;
    }

    prevX = x
    prevY = y

    props.renderDraggedItem(<DragItemPreview x={x} y={y}>🤩</DragItemPreview>)
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

export default DropTarget(ItemTypes.TASK, spec, collect)(Row);