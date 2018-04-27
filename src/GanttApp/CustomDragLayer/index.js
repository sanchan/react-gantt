import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { DragLayer } from 'react-dnd'
import { ItemTypes } from '../constants'
import DragItemPreview from '../DragItemPreview'
import snapToGrid from '../snapToGrid'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

class CustomDragLayer extends Component {
  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    initialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    isDragging: PropTypes.bool.isRequired,
    snapToGrid: PropTypes.bool.isRequired,
  }

  renderItem(type, item) {
    console.log('ItemTypes.TASK', ItemTypes.TASK)
    switch (type) {
      case ItemTypes.TASK:
        return <DragItemPreview item={item} />
      default:
        return null
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (_.get(this.props, 'dragItem.x') === _.get(nextProps, 'dragItem.x') && _.get(this.props, 'dragItem.y') === _.get(nextProps, 'dragItem.y')) {
  //     console.log('false')
  //     return false
  //   }
  //   console.log('true')
  //   return true
  // }

  render() {
    const { item, itemType, isDragging, dragItem } = this.props

    if (!isDragging) {
      return null
    }

    console.log('CustomDragLayer', this.props)

    return (
      dragItem ||
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    )
  }
}

function getItemStyles(props) {
  const { initialOffset, currentOffset } = props
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  const { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
    backgroundColor: 'red'
  }
}

export default DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))(CustomDragLayer)