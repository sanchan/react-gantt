import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { ItemTypes } from '../../constants';
import { DropTarget } from 'react-dnd';
import DragItem from '../DragItem';
import { DragItem as ItemPreview } from '../DragItem';
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

  _item_offset_TEST = -80

  state = {
    items: []
  }

  componentDidMount() {
    const { items } = this.props;
    setTimeout(() => {
      this.setState({
        items: this.renderItems()
      })
    })
  }



  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.itemType ? this.props.isOver !== nextProps.isOver : true
  // }

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
    // NOTE THIS IS FOR TEST ONLY
    this._item_offset_TEST += 80

    return {
      left: this._item_offset_TEST,
      width: this.itemWidth(item)
    }
  }

  renderItem = (item, idx) => (
    <DragItem
      key={idx}
      item={item}
      disableEvents={this.props.isDragging}
      renderDraggedItem={this.props.renderDraggedItem}
      onBeginDrag={this.props.onBeginDrag}
      onDrop={this.props.onDrop}
      style={this.stylesForItem(item)}
    />
  )

  renderItems = () => {
    const { row } = this.props;

    return _.map(row.data.items, this.renderItem)
    // return new Promise(resolve => resolve(<div>{_.map(row.data.items, this.renderItem)}</div>))
  }

  renderPreviewItem = (item, idx) => (
    <ItemPreview
      key={idx}
      item={item}
      disableEvents={this.props.isDragging}
      onBeginDrag={this.props.onBeginDrag}
      onDrop={this.props.onDrop}
      style={this.stylesForItem(item)}
      isPreview={true}
    />
  )

  renderPreviewItems = () => {
    const { row } = this.props;

    const items = _.map(row.data.items, this.renderPreviewItem)
    this._item_offset_TEST = -80

    return items
  }

  render() {
    const { row, width, children } = this.props;

    // console.log('Row.render')
    window.PERFORMANCE.Row++

    // { async () => await this.renderItems }

    return (
      <div className={cx("row")}>
        <RowDropTarget {...this.props} />
        {/*this.renderItems()*/}
        {this.state.items.length ?
        this.state.items
        :
        this.renderPreviewItems()
        }
      </div>
    );
  }
}