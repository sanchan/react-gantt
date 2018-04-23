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

  renderItem = (item, idx) => (
    <DragItem key={idx} item={item} onDrop={this.props.onDrop} />
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

const spec = {
  canDrop(props) {
    // Check permissions
    return true;
  },

  drop(props) {
    const { onDrop } = props

    return props.row
  },

  hover(props, monitor, component) {
    // The exact mouse coordinates relative to the 'viewport' when the drag starts
    const initialClientOffset = monitor.getInitialClientOffset()

    // The coordinates (0,0) relative to the 'viewport' of the drag source when the drag starts
    const initialSourceClientOffset = monitor.getInitialSourceClientOffset()

    // The exact mouse coordinates relative to the 'viewport'
    const clientOffset = monitor.getClientOffset()

    // The inner coordinates of the drag event
    const sourceOriginOffset = {
      x: initialClientOffset.x - initialSourceClientOffset.x,
      y: initialClientOffset.y - initialSourceClientOffset.y
    }

    const componentClientReact = ReactDOM.findDOMNode(component).getBoundingClientRect()

    const [ x ] = snapToGrid(clientOffset.x - sourceOriginOffset.x, 0)
    const { y } = componentClientReact

    props.renderDraggedItem(<DragItemPreview x={x} y={componentClientReact.y}>🤩</DragItemPreview>)
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