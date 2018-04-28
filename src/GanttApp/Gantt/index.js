import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as moment from 'moment';
import { DragDropContext } from 'react-dnd';
import List from 'react-virtualized/dist/commonjs/List';
import Row from './Row';
import CustomDragLayer from '../CustomDragLayer';
import { ItemTypes } from '../constants';


const GANTT_WIDTH = 10000000000

/**
 * TODO
 * - Create decorator for components that receive 'renderDraggedItem'
 * - Add preview for virtulized list
 */
export default class Gantt extends Component {
  // NOTE Right now we are using the state (I'm too lazy to config redux :P), eventually we will move to redux
  static propTypes = {
    // stepDuration:
    rows: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      data: PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
      })
    })).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      rowId: PropTypes.number.isRequired,
      data: PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
      })
    })).isRequired
  };

  state = {
    centerValue: moment(),
    centerPixels: 0, // NOTE Needed?
    xOffset: 0,
  }
  constructor(props) {
    super(props)
    this.handleRenderDraggedItem = _.throttle(this.handleRenderDraggedItem, 10)
  }

  componentDidMount() {
      // const { stepDuration } = this.props
      const centerPixels = this.Gantt.offsetWidth / 2

      this.setState({
        centerPixels
      })

      // this.Gantt.addEventListener('wheel', this.handleScroll)
      // this.Gantt.scrollTop = 0
      // this.List.scrollLeft = 1500
  }

  componentWillUnmount() {
      // this.Gantt.removeEventListener('wheel', this.handleScroll)
  }

  // NOTE There is a bug in Chrome +59 where SOMETIMES the event.preventDefault() fails
  // and the browser goes back to the previous page...
  // https://stackoverflow.com/questions/44899193/cant-prevent-navigation-gesture-in-latest-chrome-version-59-on-mac
  handleScroll = (event) => {

    if(event.deltaX) {
      event.preventDefault()
      event.stopPropagation()
      if (!event.deltaY) {
        this.setState({
          xOffset: this.state.xOffset + event.deltaX
        })
        this.List.forceUpdateGrid()
        return event.returnValue = false
      }

      // window.event.preventDefault()
      // window.event.stopPropagation()
      // event.returnValue = false;
      // return event
    }

    this.List.forceUpdateGrid()
    return event
  }

  handleBeginDrag = () => {
  }

  handleDrop = ({ item, target }) => {

    if (!target) {
      return;
    }

    const { dropItemData } = this.state

    const newItems = _.map(this.state.items, (i) => {
      const newStart = _.get(dropItemData, 'start', i.data.start);
      const newEnd = _.get(dropItemData, 'end', i.data.end) - Math.abs(newStart)

      return (
        item.id === i.id ? {
          ...i,
          rowId: target.id,
          data: {
            ...i.data,
            start: newStart,
            end: newEnd,
          }
        } : i
      )
    })

    this.setState({
      items: newItems
    }, () => {
      this.List.forceUpdateGrid()
    })
  }

  handleRenderDraggedItem = (dragItemComponent, dropData) => {
    setTimeout(() => {
      if (!_.isEqual(dragItemComponent, this.state.dragItem)) {
        this.setState({
          dragItem: dragItemComponent,
          dropItemData: dropData,
        });
      }
    })
  }

  renderRow = ({ key, index, isScrolling, isVisible, style }) => {
    const { rows, items, stepDuration } = this.props
    const { xOffset, centerPixels, centerValue } = this.state
    const row = rows[index]
    // const rowItems = _.filter(items, { rowId: row.id })

    // return <div key={index} style={{ ...style, width: GANTT_WIDTH }}>xxxx</div>

    return (
      <div key={index} style={{ ...style, width: GANTT_WIDTH }}>
        <Row
          stepDuration={stepDuration}
          row={row}
          onBeginDrag={this.handleBeginDrag}
          onDrop={this.handleDrop}
          renderDraggedItem={this.handleRenderDraggedItem}

          centerPixels={centerPixels}
          centerValue={centerValue}
        />
      </div>
    )
  }

  _getRowHeight({index}) {
    return 40
  }

  render() {
    const { rows } = this.props;
    const { dragItem } = this.state;

    // console.log('Gantt.render')
    window.PERFORMANCE.Gantt++

    return (
      <div
        ref={ref => this.Gantt = ref}
        style={{
          width: '100%',
          height: 1000,
          overflow: 'scroll',
          position: 'relative'
        }}
        // onWheel={this.handleScroll}
      >
        <List
          ref={ref => this.List = ref}
          height={1000}
          overscanRowCount={10}
          // noRowsRenderer={this._noRowsRenderer}
          rowCount={rows.length}
          rowHeight={this._getRowHeight}
          rowRenderer={this.renderRow}
          width={GANTT_WIDTH}
        />

        {dragItem &&
        <CustomDragLayer dragItem={dragItem} />
        }
      </div>
    );
  }
}
