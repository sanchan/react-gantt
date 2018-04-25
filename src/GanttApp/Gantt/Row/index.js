import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { ItemTypes } from '../../constants';
import { DropTarget } from 'react-dnd';
import DragItem from '../DragItem';
import DragItemPreview from '../../DragItemPreview';
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

    // From Gantt
    centerPixels: PropTypes.number.isRequired,
    centerValue: PropTypes.number.isRequired,
  };

  state = {
  }

  shouldComponentUpdate(nextProps, nextState) {
    // return false
    return nextProps.itemType ? this.props.isOver !== nextProps.isOver : true
  }

  itemWidth = (item) => {
    const { stepDuration } = this.props
    return (item.data.end.unix() - item.data.start.unix()) / stepDuration.asMilliseconds()
  }

  /**
   * We must make transformation using:
   * - item.data.start: The item's start value/timestamp;
   * - item.data.end: The item's end value/timestamp;
   * - Row.start: The row's start value/timestamp.
   * - Row.end: The row's end value/timestamp.
   */
  stylesForItem = (item) => {
    const { xOffset } = this.props

    // console.log('xOffset',xOffset)

    return {
      left: 0 + xOffset,
      width: this.itemWidth(item)
    }
  }

  renderItem = (item, idx) => (
    <DragItem
      key={idx}
      item={item}
      onDrop={this.props.onDrop}
      style={this.stylesForItem(item)}
    />
  )

  render() {
    const { items, connectDropTarget, isOver, canDrop, itemType, width, children } = this.props;

    return connectDropTarget(
      <div className={cx("row", itemType && !canDrop && 'cant-drop', itemType && isOver && 'is-over')} style={{ width }}>
        {_.map(items, this.renderItem)}
      </div>
    );
  }
}

const snapToRow = (sourceOffset, componentClientReact, row, stepDuration) => {
  const snappedX = Math.round(sourceOffset.x / row.data.step) * row.data.step

  // This is were the potential new position of the item,
  // we need next to 'snap' this value to the closest step
  const currentValue = {
    x: sourceOffset.x - componentClientReact.x,
    y: sourceOffset.y - componentClientReact.y,
  }

  console.log(currentValue.x, stepDuration.asMilliseconds(), componentClientReact.x)
  // console.log((Math.round(currentValue.x / stepDuration.asMilliseconds()) * stepDuration.asMilliseconds()) + componentClientReact.x)

  return {
    x: (Math.round(currentValue.x / stepDuration.asMilliseconds()) * stepDuration.asMilliseconds()) + componentClientReact.x,
    // x: 0,
    y: componentClientReact.y
  }
}

const getDropData = (x, y, componentClientReact) => {
  return {
    start: x - componentClientReact.x,
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
    // The exact mouse coordinates relative to the 'viewport' when the drag starts
    const initialClientOffset = monitor.getInitialClientOffset()

    // The initial coordinates (0,0) relatives to the 'viewport' of the DragSource
    const initialSourceClientOffset = monitor.getInitialSourceClientOffset()

    // The inner coordinates (x,y) relatives to the (0,0) of the DragSource
    const sourceOriginOffset = {
      x: initialClientOffset.x - initialSourceClientOffset.x,
      y: initialClientOffset.y - initialSourceClientOffset.y
    }

    // The mouse coordinates (x,y) relatives to the 'viewport'
    const clientOffset = monitor.getClientOffset()

    // We need to offset negatively the clientOffset substracting the sourceOriginOffset
    // so the top-left corner of the DragSource is snapped correctly
    const sourceOffset = {
      x: clientOffset.x - sourceOriginOffset.x,
      y: clientOffset.y - sourceOriginOffset.y
    }

    const componentClientReact = ReactDOM.findDOMNode(component).getBoundingClientRect()

    const { x, y } = snapToRow(sourceOffset, componentClientReact, props.row, props.stepDuration)


    // We do this check to avoid unnecessary renders of <DragItemPreview>
    if (x === prevX && y === prevY) {
      return;
    }



    prevX = x
    prevY = y

    console.log({ x, y })

    props.renderDraggedItem(<DragItemPreview x={x} y={y}>🤩</DragItemPreview>, getDropData(x, y, componentClientReact))
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