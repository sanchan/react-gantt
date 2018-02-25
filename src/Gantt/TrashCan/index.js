import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
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

    const layerStyles = {
      backgroundColor: '#ccc',
      minWidth: '80px',
      height: '40px',
      position: 'absolute',
      left: mousePosition.x,
      top: mousePosition.y,
    }

    if (monitor.isOver({ shallow: true })) {
      props.renderDraggedItem(<div style={layerStyles}>Delete ⚔️</div>)
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    // canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

export default DropTarget(ItemTypes.TASK, spec, collect)(TrashCan);