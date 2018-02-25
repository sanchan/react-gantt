import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { ItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';

const layerStyles = {
  backgroundColor: 'red'
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
    if (monitor.isOver({ shallow: true })) {
      // console.log('wololooooo')
      props.renderDraggedItem(null)
    } else {
      // console.log('------')
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