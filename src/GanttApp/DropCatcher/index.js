import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { ItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';

const layerStyles = {
  cursor: 'move',
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  overflow: 'auto'
}

class DropCatcher extends Component {
  render() {
    const { connectDropTarget } = this.props

    return connectDropTarget(
      <div style={layerStyles}>
        {this.props.children}
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
    // If user is dragging item ONLY over DropCatcher and not over a nested component,
    // then remove the dragged item, so we return delegation of rendering to DragLayer.
    if (monitor.isOver({ shallow: true })) {
      props.renderDraggedItem(null)
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

export default DropTarget(ItemTypes.TASK, spec, collect)(DropCatcher);