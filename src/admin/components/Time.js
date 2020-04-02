import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TimePicker } from 'antd';
import moment from 'moment';

import { Button, message } from 'antd';


class Time extends Component {
  constructor(props) {
    super(props);

    this.state = {
      from: null,
      before: null,
      timeStrings: ['', ''],
      format: 'HH:mm'
    }
  }

  // Уведомления
  error = (msg) => {
    message.error(msg);
  };

  onSave = () => {
    let from = document.querySelector('#a-timer__from input').value;
    let before = document.querySelector('#a-timer__before input').value;

    if (!from || !before) {
      this.error('Заполнены не все поля');

      return;
    }

    let timeStrings = this.state.timeStrings;
    let values = {
      id: this.props.data.id,
      timeId: this.props.data.timeId,
      from,
      before,
    };

    fetch('/admin/time', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': this.props.csrf
      },
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(data => {
        if (data.result)
          this.props.handlerChangesData({time: data.result});
      })
      .catch(e => {
        if (e.error)
          this.props.handlerChangesData(e.error);
      })
  }

  onChangeFrom = (time, timeString) => {
    let timeStrings = this.state.timeStrings;

    timeStrings[0] = timeString;

    this.setState({
      from: time,
      timeStrings
    });
  }
  onChangeBefore = (time, timeString) => {
    let timeStrings = this.state.timeStrings;

    timeStrings[1] = timeString;

    this.setState({
      before: time,
      timeStrings
    });
  }

  render() {
    let from = this.props.data.from;
    let before = this.props.data.before;

    return (
      <section className="a-section__timer">
        <div className="a-row">
          <div className="a-col__1"><p>С:</p></div>
          <div className="a-col__2" id="a-timer__from">
            <TimePicker 
              defaultValue={from && moment(from, this.state.format)}
              format={this.state.format}
              minuteStep={10}
              onChange={this.onChangeFrom}
              placeholder="Начало"
            />
          </div>
        </div>
        <div className="a-row">
          <div className="a-col__1"><p>До:</p></div>
          <div className="a-col__2" id="a-timer__before">
            {/* 'HH:mm:ss' */}
            <TimePicker 
              defaultValue={before && moment(before, this.state.format)}
              format={this.state.format}
              minuteStep={10}
              onChange={this.onChangeBefore}
              placeholder="Окончание"
            />
          </div>
        </div>
        <div className="a-row">
          <div className="a-col__1"></div>
          <div className="a-col__2"><Button type="primary" onClick={this.onSave}>Сохранить</Button></div>
        </div>
      </section>
    );
  }
}

export default Time;