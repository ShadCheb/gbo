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
      groupId: '',
      topicId: '',

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
          if (data.result) {
            this.props.handlerChangesData({
              review: data.result.reviews,
              reviewVk: data.result.review_vk
            }, true);
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

    return dateFormat;
  }

  getReviewVk = () => {
    let groupId = document.querySelector('#a-review__group').value;
    let topicId = document.querySelector('#a-review__token').value;
    let id = (this.props.data.reviewVk)
      ? this.props.data.reviewVk.id
      : null;

    if (!groupId || !topicId) {
      this.error('Введите данные группы и обсуждения');

      return;
    }

    // Запись группы и токена
    fetch('/admin/review_vk', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': this.props.csrf
      },
      body: JSON.stringify({
        id,
        groupId,
        topicId,
        cityListId: this.props.data.cityListId
      })
    });

    // Загрузить отзывы с группы ВК
    fetch('/admin/review/vk', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': this.props.csrf
      },
      body: JSON.stringify({
        groupId,
        topicId,
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
              profile: profiles[item.from_id] || {}
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
        this.error('Данные группы введены не верно');
        // if (e.error)
        //   this.props.handlerChangesData(e.error);
      })
	}

  addReview = (review) => {
    review['city_list_id'] = this.props.data.cityListId;

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
    let {reviewListVk, infoGroup} = this.state;
    let reviewListDb = this.props.data.review || [];
    let reviewVk = this.props.data.reviewVk;
    let reviewGroup = (reviewVk)
      ? reviewVk.id_group : null;
    let reviewToken = (reviewVk) 
      ? reviewVk.id_token : null;

    return (
      <section className="a-section__review">
        { infoGroup && getInfoGroup(infoGroup)}
        <div className="a-row">
          <div className="a-col__1"><p>id группы (147953602):</p></div>
          <div className="a-col__2">
            <Input placeholder="id группы" 
              id="a-review__group"
              value={reviewGroup} 
            />
          </div>
        </div>
        <div className="a-row">
          <div className="a-col__1"><p>id топик (37109092):</p></div>
          <div className="a-col__2">
            <Input placeholder="id топик" 
              id="a-review__token"
              value={reviewToken} 
            />
          </div>
        </div>
        <div className="a-row">На сайте будут отображаться последние 5 отзывов!</div>
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
            <div className="review__container">
            {
              reviewListVk && reviewListVk.map(review => {
                return (
                  <div className="review__row" key={review.id_com}>
                    <article className="review__block">
                      <div className="review__img">
                        <img src={review.profile && review.profile.avatar || ''} />
                      </div>
                      <div className="review__text">
                        <p className="review__text__caption">{review.profile && review.profile.name || '-'}</p>
                        <p className="review__text__p">{review.text}</p>
                        <p className="review__text__date">{review.date}</p>
                      </div>
                    </article>
                    <Button 
                      type="primary"
                      onClick={this.addReview.bind(this, review)}
                      icon={<PlusOutlined />}
                    />
                  </div>
                )
              })
            }
            </div>
          </div>
        </div>
        <div className="a-row a-row--start">
          <div className="a-col__1"><p>Отзывы в базе данных:</p></div>
          <div className="a-col__2">
            {
              reviewListDb.map((review, idx) => {
                return (
                  <article className="review__block" key={idx}>
                    <div className="review__img">
                      <img src={review.avatar || ''} />
                    </div>
                    <div className="review__text">
                      <p className="review__text__caption">{review.name}</p>
                      <p className="review__text__p">{review.review}</p>
                      <p className="review__text__date">{review.date}</p>
                    </div>
                  </article>
                )
              })
            }
          </div>
        </div>
      </section>
    );
  }
}

export default Review;