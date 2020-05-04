import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TimePicker } from 'antd';
import moment from 'moment';

import { Button, message } from 'antd';


class Time extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // from: null,
      // before: null,
      // timeStrings: ['', ''],
      format: 'HH:mm'
    }
  }

  // Уведомления
  error = (msg) => {
    message.error(msg);
  };

  onSave = () => {
    let {from, before} = this.props.data;

    if (!from || !before) {
      this.error('Заполнены не все поля');

      return;
    }

    this.props.setLoading(true);

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
        this.props.setLoading(false);

        if (data.result)
          this.props.handlerChangesData({time: data.result});
      })
      .catch(e => {
        this.props.setLoading(false);
        
        if (e.error)
          this.props.handlerChangesData(e.error);
      })
  }

  onChangeFrom = (time, timeString) => {
    let timeData = this.props.data;

    this.props.handlerChangesData({time: {
      id: timeData.timeId || null,
      from: timeString,
      before: timeData.before,
      cityListId: timeData.id
    }}, true);
  }
  onChangeBefore = (time, timeString) => {
    let timeData = this.props.data;

    this.props.handlerChangesData({time: {
      id: timeData.timeId || null,
      from: timeData.from,
      before: timeString,
      cityListId: timeData.id
    }}, true);
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
              value={from && moment(from, this.state.format) || ''}
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
            <TimePicker 
              value={before && moment(before, this.state.format) || ''}
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