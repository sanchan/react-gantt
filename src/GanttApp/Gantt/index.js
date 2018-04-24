import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as moment from 'moment';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import List from 'react-virtualized/dist/commonjs/List';
import Row from './Row';
import { ItemTypes } from '../constants';


/**
 * TODO
 * - Create decorator for components that receive 'renderDraggedItem'
 */
export default class Gantt extends Component {
  // NOTE Right now we are using the state (I'm too lazy to config redux :P), eventually we will move to redux
  static propTypes = {
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
    xOffset: 0
  }

  componentDidMount() {
      // this.Gantt.addEventListener('wheel', this.handleScroll)
      // this.Gantt.scrollLeft = 1000
  }

  componentWillUnmount() {
      // this.Gantt.removeEventListener('wheel', this.handleScroll)
  }

  // NOTE There is a bug in Chrome +59 where SOMETIMES the event.preventDefault() fails
  // and the browser goes back to the previous page...
  // https://stackoverflow.com/questions/44899193/cant-prevent-navigation-gesture-in-latest-chrome-version-59-on-mac
  handleScroll(event) {
    console.log('scroll', event.deltaX, event.deltaY)

    if(event.deltaX) {
      event.preventDefault()
      event.stopPropagation()
      return false

      // window.event.preventDefault()
      // window.event.stopPropagation()
      // event.returnValue = false;
      // return event
    }



  }

  handleDrop = ({ item, target }) => {
    if (!target) {
      return;
    }

    console.log({ item, target })
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
    if (!_.isEqual(dragItemComponent, this.state.dragItem)) {
      this.setState({
        dragItem: dragItemComponent,
        dropItemData: dropData,
      });
    }
  }

  renderRow = ({ key, index, isScrolling, isVisible, style }) => {
    const { rows, items } = this.props;
    const row = rows[index]
    const rowItems = _.filter(items, { rowId: row.id })

    return (
      <div key={index} style={style}>
        <Row row={row} items={rowItems} onDrop={this.handleDrop} renderDraggedItem={this.handleRenderDraggedItem} />
      </div>
    )
  }

  _getRowHeight({index}) {
    return 40
  }

  render() {
    const { rows } = this.props;

    console.log('rows', rows)

    return (
      <div
        ref={ref => this.Gantt = ref}
        style={{ width: '100%', overflow: 'scroll' }}
        onWheel={this.handleScroll}
      >
        <List
          ref={ref => this.List = ref}
          height={800}
          overscanRowCount={10}
          // noRowsRenderer={this._noRowsRenderer}
          rowCount={rows.length}
          rowHeight={this._getRowHeight}
          rowRenderer={this.renderRow}
          width={8000}
        />
      </div>
    );
  }
}
