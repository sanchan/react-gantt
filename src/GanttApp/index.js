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
      }
    })),
    items: _.flatten(_.times(300, r => (
      _.times(30, t => ({
        id: r + t + 1,
        rowId: r + 1,
        data: {
          start: moment(),
          end: moment().add(2, 'hour')
          // start: 32,
          // end: 96
        }
      }))
    ))),



    stepDuration: moment.duration(15, 'minutes')
  }

  componentDidMount() {
      // window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
      // window.removeEventListener('scroll', this.handleScroll)
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
        dragItem: dragItemComponent, // TODO Rename dragItem -> previewItem ?
        dropItemData: dropData,
      });
    }
  }


  render() {
    const { rows, items, stepDuration, dragItem } = this.state;

    console.log('rows 1', rows)

    return (
      <div>
        <DropCatcher renderDraggedItem={this.handleRenderDraggedItem}>
          <Gantt rows={rows} items={items} stepDuration={stepDuration}/>
          <TrashCan renderDraggedItem={this.handleRenderDraggedItem} />
        </DropCatcher>

        {dragItem &&
        <CustomDragLayer dragItem={dragItem} />
        }
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(GanttApp)
