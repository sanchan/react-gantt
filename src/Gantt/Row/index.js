import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';
import styles from './styles.css';

class Row extends Component {
  static propTypes = {
    onDrop: PropTypes.func.isRequired,

    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    itemType: PropTypes.string.isRequired,
  };

  render() {
    const { connectDropTarget, isOver, canDrop, itemType, children } = this.props;

    return connectDropTarget(
      <div className={cx("row", itemType && !canDrop && 'cant-drop', itemType && isOver && 'is-over')}>
        {children}
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