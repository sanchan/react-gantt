import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import _ from 'lodash';
import './App.css';

const springConfig = {stiffness: 300, damping: 50};

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const ROW_HEIGHT = 30

class App extends Component {

  state = {
    data: [
      [],
      [{ id: 123, name: 'Mr who', x: 100, y: 30}],
    ],
    dataItem: {
      row: 0,
      col: 0,
    },
    activeRowIdx: 0,
    originPageX: 0,
    originPageY: 0,
    originItemPos: {
      left: 0,
      top: 0,
    },
    pageX: 0,
    pageY: 0,
    itemPos: {
      left: 0,
      top: 0,
    },
    isPressed: false,
  };

  componentDidMount() {
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);

  };

  handleTouchStart = () => {
  }

  handleMouseDown = (rowIdx, colIdx, pressX, pressY, { target, pageX, pageY }) => {
    const { hoveredRowIdx } = this.state;

    const rect = target.getBoundingClientRect();

    this.setState({
      dataItem: {
        row: rowIdx,
        col: colIdx,
      },
      activeRowIdx: rowIdx,
      originPageX: pageX,
      originPageY: pageY,
      originItemPos: rect,
      pageX: pageX,
      pageY: pageY,
      itemPos: rect,
      isPressed: true,
    });
  };

  handleMouseMove = ({ pageX, pageY }) => {
    const { isPressed } = this.state;

    // const xCoordinate = clientX - rect.left;
    // const yCoordinate = clientY - rect.top;

    if (isPressed) {
      this.setState({
        pageX: pageX,
        pageY: pageY,
      });
    }
  };

  handleMouseUp = ({ pageX, pageY }) => {
    const { dataItem, activeRowIdx, originPageY } = this.state;

    const data = [...this.state.data];
    data[dataItem.row][dataItem.col].y = pageY - (pageY % ROW_HEIGHT)

    // x: pageX - originPageX,
    // y: activeRowIdx * ROW_HEIGHT

    this.setState({
      data,
      isPressed: false
    })
  }

  handleMouseEnterRow = (rowIdx, e) => {
    const { isPressed } = this.state;

    if (isPressed) {
      this.setState({
        activeRowIdx: rowIdx
      });
    }
  };

  render() {
    // const style = originalPosOfLastPressed === i && isPressed
    // ? {
    //     scale: spring(1.1, springConfig),
    //     shadow: spring(16, springConfig),
    //     y: mouseY,
    //   }
    // : {
    //     scale: spring(1, springConfig),
    //     shadow: spring(1, springConfig),
    //     y: spring(order.indexOf(i) * 100, springConfig),
    //   };
    const { data, x, y, pageX, pageY, originPageX, originPageY, activeRowIdx, isPressed } = this.state;

    return (
      <div className="App">
        {_.map(data, (row, rowIdx) => (
          <div className="gantt-row" key={rowIdx}>
            {_.map(row, (col, colIdx) => {
              const style = {
                scale: spring(1, springConfig),
                shadow: spring(1, springConfig),
                x: pageX - originPageX,
                y: activeRowIdx * ROW_HEIGHT
              }

              return (
                <Motion style={style} key={colIdx}>
                  {({scale, shadow, x, y}) =>
                    <div
                      className="gantt-task"
                      onMouseDown={this.handleMouseDown.bind(null, rowIdx, colIdx, x, y)}
                      style={{
                        boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                        top: `${col.y}px`,
                        left: `${col.x}px`,
                        transform: `translate3d(${x}px, 0, 0) scale(${scale})`,
                        WebkitTransform: `translate3d(${x}px, 0, 0) scale(${scale})`,
                      }}>
                      X: {x} <br/>
                      Y: {y}
                    </div>
                  }
                </Motion>
              )
            })}
          </div>
        ))}
      </div>
    );
  }
}

export default App;
