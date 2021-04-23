import React, { Component } from 'react';
import CPU from '../cpu';
import Memory from '../memory';
import Screen from '../screen';
import ROM from '../ROM';
import './debugger.scss';

const dec2hex = (i) => {
  let result = "00";
  if      (i >= 0    && i <= 15)    { result = "0" + i.toString(16); }
  else if (i >= 16   && i <= 255)   { result = ""  + i.toString(16); }
  return result
}

const randomHexValue = () => Math.floor(Math.random() * 255);

const nbspPad = (string, pad = 2) => string.padStart(pad, " ").replace(/ /g, "\u00a0");

const ControlButton = props => (
  <button onClick={props.onClick} className={props.active ? 'active' : null} disabled={props.disabled}>
    { props.label }
  </button>
);

const ValueList = props => (
  Object.keys(props.items).map(item => (
    <li key={item} className='monospace value-list-item'>
      {nbspPad(item)} - {props.hex ? dec2hex(props.items[item]) : props.items[item]}
    </li>
  ))
);

export default class Debugger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cycles: 0,
      clock: {
        running: false,
        interval: null,
        rate: 5,
      },
    };

    this.memory = new Memory(0xf);
    this.cpu = new CPU(this.memory);
    this.memory.bulkWrite(ROM);
    this.screen = null;
    this.videoBuffer = [];
  }

  componentDidMount() {
    this.screen = new Screen(document.getElementById('screen'));
    this.screen.drawBuffer();

    for (let i = 0; i < 92160; i += 4) {
      // Percentage in the x direction, times 255
      let x = (i % 400) / 400 * 255;
      // Percentage in the y direction, times 255
      let y = Math.ceil(i / 400) / 100 * 255;

      // Modify pixel data
      this.videoBuffer[i] = x;           // R value
      this.videoBuffer[i + 1] = y;       // G value
      this.videoBuffer[i + 2] = 255 - x; // B value
      this.videoBuffer[i + 3] = 255;     // A value
    }

    // setInterval(() => {
    //   this.generateRandomVideoBuffer();
    //   this.screen.fillBuffer(this.videoBuffer);
    //   window.requestAnimationFrame(this.screen.drawBuffer.bind(this.screen));
    // }, 1);
  }


  stepClock() {
    this.cpu.handleClockStep();
    this.setState({
      cycles: this.state.cycles + 1
    });
    this.forceUpdate();
  }


  changeClockRate(rate) {
    this.setState({
      clock: {
        ...this.state.clock,
        rate,
      }
    })
  }

  resetCpu() {
    this.setState({cycles: 0})
    this.cpu.reset();
    this.forceUpdate();
  }

  toggleClock(rate) {
    if(!this.state.clock.running) {
      const interval = setInterval(() => {
        this.stepClock();
      }, 1000/this.state.clock.rate);
      this.setState({
        clock: {
          ...this.state.clock,
          interval,
          running: true
        }
      });
    }
    else {
      clearInterval(this.state.clock.interval);
      this.setState({
        clock: {
          ...this.state.clock,
          running: false
        }
      });
    }
  }

  generateRandomVideoBuffer(bufferLength = 92160) {
    for (let i = 0; i < bufferLength; i += 4) {
      // Modify pixel data
      this.videoBuffer[i + 0] = randomHexValue();        // R value
      this.videoBuffer[i + 1] = randomHexValue();        // G value
      this.videoBuffer[i + 2] = randomHexValue();  // B value
      this.videoBuffer[i + 3] = randomHexValue();      // A value
    }
  }

  renderMemoryContents(pc, start, length) {
    let currentCol = 0;
    const renderContent = [];
    const row = [];
    let currentAddress = 0;
    const endAddress = this.memory.getMemorySize() < length - start ? this.memory.getMemorySize() : start + length;
    for(let address=start; address<endAddress; address++) {
      if(currentCol < 8) {
        row.push(this.memory.readByte(address));
        currentCol++;
      }
      else {
        renderContent.push(
          <tr key={address}>
            {
              row.map((rowValue, index) => {
                currentAddress++;
                return (
                  <td key={currentAddress} className='monospace'>
                    <span className={pc === currentAddress ? 'active' : null}>
                      {dec2hex(rowValue).toUpperCase()}
                    </span>
                  </td>
                );
              })
            }
          </tr>
        );
        currentCol=0;
        row.length=0;
      }
    }

    return renderContent;
  }

  render() {
    return (
      <div>
        <div className='header'>
          <h1>Gameboy Debugger</h1>
        </div>

        <div className='debugger'>
          <div className='controls'>
            <div className='control-section'>
              <ControlButton onClick={() => this.resetCpu()} label="Reset" />
            </div>

            <div className='control-section'>
              <ControlButton
                onClick={() => this.stepClock()}
                label="Single Step"
                disabled={this.state.clock.running}
              />
            </div>

            <div className='control-section'>
              <ControlButton
                onClick={() => this.toggleClock()}
                label={this.state.clock.running ? 'Stop Clock' : 'Start Clock'}
                active={this.state.clock.running}
              />
              <div className='slider'>
                <input disabled={this.state.clock.running} type="range" min="1" max="50" value={this.state.clock.rate} className="slider" onChange={(e) => this.changeClockRate(e.target.value)} />
                <span>{this.state.clock.rate}hz</span>
              </div>
              <p>Total cycles - {this.state.cycles}</p>
            </div>
          </div>

          <div className='cpuStateWrapper'>
            <div>
              <h3>CPU</h3>
              <ul>
                <ValueList items={{t: this.cpu.getT(), m: this.cpu.getM()}} />
              </ul>
            </div>

            <div>
              <h3>Registers</h3>
              <ul>
                <ValueList items={this.cpu.getRegisterState()} hex />
              </ul>
            </div>

            <div>
              <h3>Memory</h3>
              <table><tbody>{this.renderMemoryContents(this.cpu.getPC(), 0x0000, 0x00ff)}</tbody></table>
            </div>

            <div>
              <canvas id='screen' className='screen' height={144} width={160} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
