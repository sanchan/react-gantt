import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { ItemTypes } from '../../constants';
import { DropTarget } from 'react-dnd';
import DragItem from '../DragItem';
import DragItemPreview from '../../DragItemPreview';
// import AsyncChild from 'react-async-child';
import AsyncChild from './AsyncChild';
import RowDropTarget from './RowDropTarget';
import styles from './styles.css';


let t0, t1

export default class Row extends Component {
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
    children: []
  }

  componentDidMount() {
    const { items } = this.props;
  }



  shouldComponentUpdate(nextProps, nextState) {
    // return false
    // console.log('nextProps.itemType', nextProps.itemType)
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

    return {
      left: 0 + xOffset,
      width: this.itemWidth(item)
    }
  }

  renderItem = (item, idx) => (
    <DragItem
      key={idx}
      item={item}
      enableEvents={this.props.row.data.items.length - 1 === idx}
      onBeginDrag={this.props.onBeginDrag}
      onDrop={this.props.onDrop}
      style={this.stylesForItem(item)}
    />
  )

  renderItems = () => {
    const { row } = this.props;

    return new Promise(resolve => resolve(<div>{_.map(row.data.items, this.renderItem)}</div>))
  }

  render() {
    const { row, connectDropTarget, isOver, canDrop, itemType, width, children } = this.props;

    // console.log('Row.render', row)
    window.PERFORMANCE.Row++

    // { async () => await this.renderItems }

    return (
      <div className={cx("row", itemType && !canDrop && 'cant-drop')}>
        <RowDropTarget {...this.props} />
        {_.map(row.data.items, this.renderItem)}
      </div>
    );
  }
}