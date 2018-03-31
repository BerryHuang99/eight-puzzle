import React, { Component } from 'react';
import './Box.css';

class Box extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
      }
    };
    render() {
      let str = [];
      for (let i = 0; i < this.props.items.length; i++) {
        if (this.props.items[i] == 0) {
          str.push(<div className="box-item box-item-0">&nbsp;</div>);
        } else {
          str.push(<div className="box-item">{this.props.items[i]}</div>);
        }

        if ((i + 1) % this.props.num == 0) {
            str.push(<br/>);
        }
      };
      return (
        <div className="Box">
          {str}
        </div>
        
      );
    };
  }
  
  export default Box;
