import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Input, Button, message, Popconfirm } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';


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

    this.props.setLoading(true);

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
          let group = response.groups[0] || {};

          group['count'] = response.count;

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

          this.props.setLoading(false);
          this.props.handlerChangesData({
            reviewListVk: filteredData,
            infoGroup: group
          }, true);
        }
        else 
          this.props.handlerChangesData({
            reviewListVk: [],
            infoGroup: null
          }, true);
          this.props.setLoading(false);
      })
      .catch(e => {
        this.error('Данные группы введены не верно');
        this.props.setLoading(false);
      })
	}

  addReview = (review) => {
    review['city_list_id'] = this.props.data.cityListId;

    this.props.setLoading(true);

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
        this.props.setLoading(false);

        if (data.result)
          this.props.handlerChangesData({review: data.result});
      })
      .catch(e => {
        this.props.setLoading(false);

        if (e.error)
          this.props.handlerChangesData(e.error);
      })
  }

  deleteReview = (review) => {
    let id = review.id;

    if (!id)
      return;

    this.props.setLoading(true);

    fetch('/admin/review/' + id, {
      method: 'delete',
      headers: {
        'X-XSRF-TOKEN': this.props.csrf
      }
    })
      .then(() => {
        let review = this.props.data.review.slice();

        review = review.filter(a => a.id !== id);
        this.props.handlerChangesData({review});
        this.props.setLoading(false);
      })
      .catch(e => {
        this.props.setLoading(false);
        
        if (e.error)
          this.props.handlerChangesData(e.error);
      })
  }

  onChange(type, e) {
    let reviewVk = this.props.data.reviewVk || {};
    let value = e.target.value;

    reviewVk[type] = value;

    this.props.handlerChangesData({reviewVk}, true);
  }


  render() {
    let {reviewListVk, infoGroup} = this.props.data;
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
              onChange={this.onChange.bind(this, 'id_group')}
            />
          </div>
        </div>
        <div className="a-row">
          <div className="a-col__1"><p>id топик (37109092):</p></div>
          <div className="a-col__2">
            <Input placeholder="id топик" 
              id="a-review__token"
              value={reviewToken} 
              onChange={this.onChange.bind(this, 'id_token')}
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
              reviewListDb && reviewListDb.map((review, idx) => {
                return (
                  <div className="review__list" key={idx}>
                    <article className="review__block">
                      <div className="review__img">
                        <img src={review.avatar || ''} />
                      </div>
                      <div className="review__text">
                        <p className="review__text__caption">{review.name}</p>
                        <p className="review__text__p">{review.review}</p>
                        <p className="review__text__date">{review.date}</p>
                      </div>
                    </article>
                    <Popconfirm title="Удалить?" 
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      okText="Да" 
                      cancelText="Нет"
                      onConfirm={this.deleteReview.bind(this, review)}
                    >
                      <Button 
                        type="primary"
                        icon={<DeleteOutlined />}
                      />
                    </Popconfirm>
                  </div>
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