import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as moment from 'moment';
import List from 'react-virtualized/dist/commonjs/List'
import Gantt from './Gantt';
import CustomDragLayer from './CustomDragLayer';
import DropCatcher from './DropCatcher';
import TrashCan from './TrashCan';
import { ItemTypes } from './constants';
import './styles.css';


window.PERFORMANCE = {
  CustomDragLayer: 0,
  DragItemPreview: 0,
  Gantt: 0,
  Row: 0,
  RowHover: 0,
}

/*
class HTML5Modifiers extends HTML5Backend {
  handleTopDragEnter(e) {
    super.handleTopDragEnter(e);
    console.log('handleTopDragEnter')
    this.altKeyPressed = e.ctrlKey || e.metaKey;
  }
  handleTopDragOver(e) {
    super.handleTopDragOver(e);
    this.altKeyPressed = e.ctrlKey || e.metaKey;
  }
}

function createHTML5Backend(manager) {
  return new HTML5Modifiers(manager);
}
*/

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
        user: {
          id: t + 1,
          name: `User ${t + 1}`
        },
        items: _.times(80, i => ({
          id: i + 1,
          data: {
            start: moment(),
            end: moment().add(2, 'hour')
            // start: 32,
            // end: 96
          }
        }))
      }
    })),

    stepDuration: moment.duration(15, 'minutes')
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

  render() {
    const { rows, stepDuration, dragItem } = this.state;

    console.log('GanttApp.render')

    return (
      <div>
        <Gantt rows={rows} stepDuration={stepDuration}/>
      </div>
    );
  }
}

export default DragDropContext(HTML5Modifiers)(GanttApp)
