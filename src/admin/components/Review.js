import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const MONTHS = [
  'янв',
  'фев',
  'марта',
  'апр',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'окт',
  'ноября',
  'дек'
 ];

function getInfoGroup(infoGroup) {
  return (
    <div className="a-row">
      <div className="a-col__1"><p>Отзывы с группы:</p></div>
      <div className="a-col__2" id="a-timer__from">
        <div className="review__group">
          <img src={infoGroup.photo_50} />
          <div>
            <p>
              <a href={'https://vk.com/' + infoGroup.screen_name} target="_blank">
                {infoGroup.name}
              </a>
            </p>
            <p>Комментариев в группе: {infoGroup.count}</p>
          </div>
        </div>
      </div>
    </div>);
}



class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewListVk: [],
      reviewListDb: [],
      groupId: '147953602',
      topicId: '37109092',

      infoGroup: null
    }
  }

  componentDidMount = () => {
    if (!this.props.data.review) {
      fetch('/admin/review/get', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'X-XSRF-TOKEN': this.props.csrf
        },
        body: JSON.stringify({cityId: this.props.data.cityListId})
      })
        .then(res => res.json())
        .then(data => {
          console.log('data', data);
          if (data.result) {
            this.props.handlerChangesData({review: data.result}, true);
          }
        })
        .catch(e => {
          if (e.error)
            this.error(e.error);
        });
    }
  }

  // Уведомления
  error = (msg) => {
    message.error(msg);
  };

  validationDate = (date) => {
    let dateFormat = new Date(date * 1000);
    let minutes = String(dateFormat.getMinutes());
    let hours = String(dateFormat.getHours());

    if (minutes.length < 2)
      minutes += '0';
    if (hours.length < 2)
      hours += '0';

    dateFormat = dateFormat.getDate() + ' ' + MONTHS[dateFormat.getMonth()] + ' ' + dateFormat.getFullYear() + ' в ' + hours + ':' + minutes;

    return date;
  }

  getReviewVk = () => {
    fetch('/admin/review_vk', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': this.props.csrf
      },
      body: JSON.stringify({
        groupId: this.state.groupId,
        topicId: this.state.topicId,
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.result && data.result.response) {
          let response = data.result.response;
          let profiles = {};
          let filteredData = [];

          response.profiles.map(profile => {
            profiles[profile.id] = {
              name: profile.first_name + ' ' + profile.last_name,
              avatar: profile.photo_100
            };
          });

          response.items.map(item => {
            filteredData.push({
              id_com: item.id,
              text: item.text,
              date: this.validationDate(item.date),
              profile: profiles[item.from_id]
            });
          });

          this.setState({
            reviewListVk: filteredData,
            infoGroup: response.groups[0]
          });
        }
        else 
          this.setState({
            reviewListVk: [],
            infoGroup: null
          });
      })
      .catch(e => {
        if (e.error)
          this.props.handlerChangesData(e.error);
      })
	}

  addReview = (review) => {
    fetch('/admin/review', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': this.props.csrf
      },
      body: JSON.stringify(review)
    })
      .then(res => res.json())
      .then(data => {
        if (data.result)
          this.props.handlerChangesData({review: data.result});
      })
      .catch(e => {
        if (e.error)
          this.props.handlerChangesData(e.error);
      })
  }


  render() {
    let {reviewListVk, reviewListDb, infoGroup} = this.state;

    return (
      <section className="a-section__review">
        { infoGroup && getInfoGroup(infoGroup)}
        <div className="a-row">
          <div className="a-col__1"><p>id группы (147953602):</p></div>
          <div className="a-col__2" id="a-timer__from">
            <Input placeholder="id группы" defaultValue={this.state.groupId} />
          </div>
        </div>
        <div className="a-row">
          <div className="a-col__1"><p>id топик (37109092):</p></div>
          <div className="a-col__2" id="a-timer__from">
            <Input placeholder="id топик" defaultValue={this.state.topicId} />
          </div>
        </div>
        <div className="a-row">
          <div className="a-col__1"></div>
          <div className="a-col__2">
            <Button 
              type="primary"
              onClick={this.getReviewVk.bind(this)}
            >Загрузить отзывы</Button>
          </div>
        </div>
        <div className="a-row a-row--start">
          <div className="a-col__1"><p>Отзывы с группы:</p></div>
          <div className="a-col__2">
            {
              reviewListVk && reviewListVk.map(reviw => {
                return (
                  <article className="review__block" key={reviw.id_com}>
                    <div className="review__img">
                      <img src={reviw.profile.avatar} />
                    </div>
                    <div className="review__text">
                      <p className="review__text__caption">{reviw.profile.name}</p>
                      <p className="review__text__p">{reviw.text}</p>
                      <p className="review__text__date">{reviw.date}</p>
                    </div>
                    <Button 
                      type="primary"
                      onClick={this.addReview.bind(this, reviw)}
                      icon={<PlusOutlined />}
                    />
                  </article>
                )
              })
            }
          </div>
        </div>
        <div className="a-row">
          <div className="a-col__1"><p>Отзывы в базе данных:</p></div>
          <div className="a-col__2">
            {
              reviewListDb.map((reviw, idx) => {
                return (
                  <article className="review__block" key={idx}>
                    <div className="review__img">
                      <img src="https://sun9-16.userapi.com/c855016/v855016226/1cf2fe/ro_GQypuZ48.jpg?ava=1" />
                    </div>
                    <div className="review__text">
                      <p className="review__text__caption">Лёня Власов</p>
                      <p className="review__text__p">Быстро сделали очередное то, качество на высшем уровне, хорошее отношение к клиентам, быстро и качественно работают. Дальнейших успехов</p>
                      <p className="review__text__date">27 марта 2020 в 18:36</p>
                    </div>
                  </article>
                )
              })
            }
          </div>
        </div>
        {/* <div className="a-row">
          <div className="a-col__1"></div>
          <div className="a-col__2"><Button type="primary" onClick={this.onSave}>Сохранить</Button></div>
        </div> */}
      </section>
    );
  }
}

export default Review;