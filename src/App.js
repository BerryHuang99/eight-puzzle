import React, { Component } from 'react';
import './App.css';
import Box from './Box'
import Axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props);
    this.input = this.input.bind(this);
    this.create = this.create.bind(this);
    this.run = this.run.bind(this);
    
    this.state = {
      num: undefined,
      in: undefined,
      alarm: '',
      disappear: true,
      creation: [],
      result: []
    }
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img className="logo" src="/logo.png"/>
          <h1>Eight Puzzle</h1>
        </header>

          <div className="clearfix"></div>

          <div className="input-num">
            <input className="number" type="text" onChange={this.input} placeholder="box size X" value={this.state.in}/>
            &times;
            <input className="number" type="text" onChange={this.input} placeholder="box size Y" value={this.state.in}/>
            <button onClick={this.create}>Create</button>
            <div className="alarm">{this.state.alarm}</div>
          </div>

          <div className={'box ' + (this.state.disappear && 'disappear')}>
            <Box num={this.state.num} items={this.state.creation}/>
            <button onClick={this.run}>Run</button>
          </div>

      </div>
    );
  };
  input(event) {
    this.setState({in: event.target.value})
  };
  create() {
    this.state.creation = [];

    if (this.state.in == undefined) {
      this.state.alarm = 'Can\'t be empty !';
      this.state.disappear = true;
    } else if (typeof this.state.in == 'number') {
      this.state.alarm = 'Only Number !';
      this.state.disappear = true;
    } else if (this.state.in < 3) {
      this.state.alarm = 'Your input must be more than 2 !';
      this.state.disappear = true;
    } else if (this.state.in % 2 == 0) {
      this.state.alarm = 'Your input must be odd !';
      this.state.disappear = true;
    } else if (this.state.in % 1 != 0) {
      this.state.alarm = 'Only integer !';
      this.state.disappear = true;
    } else {
      this.state.alarm = '';
      
      let n = Math.pow(this.state.in, 2);

      for (let i = 0; i < n; i++) {
        this.state.creation.push(i);
      }
      
      for (let i = 0; i < n / 2; i++) {
        let j = 0, k = 0, l = 0;
        j = Number.parseInt(Math.random() * n);
        while ((k = Number.parseInt(Math.random() * n)) == j);
        
        l = this.state.creation[j];
        this.state.creation[j] = this.state.creation[k];
        this.state.creation[k] = l;
      }

      this.state.disappear = false;
      this.state.num = this.state.in;
    }

    this.setState(this.state);
  };
  run() {
    // send the created matrix
    Axios.post('http://118.202.12.72:8080/NPuzzle/ProblemResult', {
      n: this.state.num, // the matrix is n * n
      matrix: this.state.creation
    }, {
      headers: {'Access-Control-Allow-Orign': '*'}
    }).then(res => {
      if (res.status == 200) {

        this.state.result = res.data.result;

        // check if it's solvable
        if (this.state.result.length == 0) {
          alert('Unsolvable !');
        } else {

          // run
          let time = this.state.result.length;
          let i = 0;
          let change = setInterval(() => {
            this.state.creation = this.state.result[i];
            i++;
            this.setState(this.state.creation);
            if (i === time) {
              clearInterval(change);
            }
          }, 500);
        }

      } else {
        alert(res.status);
      }
    }).catch(err => {
      alert(err);
    })
  }
}

export default App;
