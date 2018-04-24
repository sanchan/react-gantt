import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import List from 'react-virtualized/dist/commonjs/List'
import CustomDragLayer from './CustomDragLayer';
import DropCatcher from './DropCatcher';
import TrashCan from './TrashCan';
import Row from './Row';
import { ItemTypes } from './constants';


/**
 * TODO
 * - Create decorator for components that receive 'renderDraggedItem'
 */
class GanttApp extends Component {
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
    rows: _.times(300, t => ({
      id: t + 1,
      data: {
        start: 0,
        end: 3000,
        step: 32, // The sticky gap value
      }
    })),
    items: [{
      id: 1,
      rowId: 1,
      data: {
        start: 32,
        end: 96
      }
    }]
  }

  componentDidMount() {
      window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll(event) {
    console.log('scroll')
      // let scrollTop = event.srcElement.body.scrollTop,
      //     itemTranslate = Math.min(0, scrollTop/3 - 60);

      // this.setState({
      //   transform: itemTranslate
      // });
  }

  handleDrop = ({ item, target }) => {
    if (!target) {
      return;
    }

    console.log({ item, target })
    const { dropItemData } = this.state

    console.log('dropItemData', _.get(dropItemData, 'start', 'xxxx'))



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
    const { rows, items } = this.state;
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
    const { rows, dragItem } = this.state;

    return (
      <div>
        <DropCatcher renderDraggedItem={this.handleRenderDraggedItem}>
          <List
            ref={ref => this.List = ref}
            dragItem={dragItem}
            height={800}
            overscanRowCount={10}
            // noRowsRenderer={this._noRowsRenderer}
            rowCount={rows.length}
            rowHeight={this._getRowHeight}
            rowRenderer={this.renderRow}
            width={1000}
          />
          {
            // _.map(rows, this.renderRow)
          }
          <TrashCan renderDraggedItem={this.handleRenderDraggedItem} />
        </DropCatcher>

        <CustomDragLayer dragItem={dragItem} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Gantt)
