import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import DragItemPreview from '../DragItemPreview';
import { ItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';

class TrashCan extends Component {
  render() {
    const { connectDropTarget } = this.props

    return connectDropTarget(
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px dashed #ccc',
          marginTop: 50,
          height: 100,
          width: 100
        }}
      >
        Trash can
      </div>
    )
  }
}

const spec = {
  canDrop(props) {
    // return false;
  },

  drop(props) {
    return null
  },

  hover(props, monitor, component) {
    const mousePosition = monitor.getClientOffset()

    if (props.isOver) {
      props.renderDraggedItem(<DragItemPreview x={mousePosition.x} y={mousePosition.y}>😵</DragItemPreview>)
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    // canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

export default DropTarget(ItemTypes.TASK, spec, collect)(TrashCan);