import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Popconfirm, message } from 'antd';
import { FormOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import ModalAddWork from './ModalAddWork';

class Work extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleAddWork: false,
      openWorkData: {}
    }
  }

  error = (msg) => {
    message.error(msg);
  };

  componentDidMount = () => {
    if (!this.props.data.work) {
      this.props.setLoading(true);

      fetch('/admin/work/get', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'X-XSRF-TOKEN': this.props.csrf
        },
        body: JSON.stringify({cityId: this.props.data.cityListId})
      })
        .then(res => res.json())
        .then(data => {
          this.props.setLoading(false);

          if (data.result) {
            data.result.map(work => {
              work.established = (work.established)
                ? work.established.split(',')
                : [];
              work.additionally = (work.additionally) 
                ? work.additionally.split(',')
                : [];
              work.gallery = (work.gallery) 
                ? work.gallery.split(',')
                : [];
            });
          }

          this.props.handlerChangesData({work: data.result}, true);
        })
        .catch(e => {
          this.props.setLoading(false);

          if (e.error)
            this.error(e.error);
        });
    }
  }

  deleteWork = (work) => {
    let id = work.id;
    this.props.setLoading(true);

    fetch('/admin/work/' + id, {
      method: 'delete',
      headers: {
        'X-XSRF-TOKEN': this.props.csrf
      }
    })
      .then(() => {
        let work = this.props.data.work.slice();

        this.props.setLoading(false);
        work = work.filter(a => a.id !== id);
        this.props.handlerChangesData({work});
      })
      .catch(e => {
        this.props.setLoading(false);

        if (e.error)
          this.props.handlerChangesData(e.error);
      })
  }


  openModalAddWork = (work, idx) => {
    let openWork = {};

    if (!work) {
      openWork = {
        cityListId: this.props.data.cityListId
      }
    } else {
      openWork = Object.assign({}, work);
      openWork['idx'] = idx;
    }

    if (openWork.avatar) {
      openWork['avatarFileList'] = [{
        uid: '-1',
        name: openWork.avatar,
        status: 'done',
        url: openWork.avatar,
      }]; 
    }

    if (openWork.gallery) {
      openWork['galleryFileList'] = openWork.gallery.map((img, idx) => ({
        uid: (idx - 1).toString(),
        name: img,
        status: 'done',
        url: img,
      }));
    }

    this.setState(() => {
      return ({
        openWorkData: openWork,
        visibleAddWork: true
      });
    });
  }

  closeModalAddWork = () => {
    this.setState({visibleAddWork: false});
  }

  changeValue = (obj) => {
    let openWorkData = this.state.openWorkData;

    for(let key in obj) {
      Object.assign(openWorkData, {[key]: obj[key]})
    }
    this.setState(openWorkData);
  }

  render() {
    let works = this.props.data.work;

    return (
      <section>
        <div>
          {
            works && works.map((work, idx) => (
              <div className="a-row a-row--border" key={idx}>
                <div className="a-col__1"><p>Работа {idx + 1}:</p></div>
                <div className="a-col__2">
                  <div className="a-card__work__hedaer">
                    <div className="a-card__work__img">
                      <img src={'/images/' + work.avatar} />
                    </div>
                    <div className="a-card__employee__text">
                      <p className="text__p--blue">{work.name}</p>
                    </div>
                  </div>
                  <div className="a-card__work__body">
                    <div className="a-card__block">
                      <h3 className="a-card__caption">Установлено газовое оборудование:</h3>
                      { 
                        (work.established) ?
                          (<ul className="a-card__ul">
                          {
                            work.established.map((item, i) => (
                              <li key={'item-' + i}>{ item }</li>
                            ))
                          }
                          </ul>)
                        : (<p>Нет информации</p>)
                      }
                    </div>
                    <div className="a-card__block">
                      <h3 className="a-card__caption">Дополнительно:</h3>
                      { 
                        (work.additionally) ?
                          (<ul>
                          {
                            work.additionally.map((item, i) => (
                              <li key={'item-' + i}>{ item }</li>
                            ))
                          }
                          </ul>)
                        : ('Нет информации')
                      }
                    </div>
                    <div className="a-card__block">
                      <h3 className="a-card__caption">Галерея:</h3>
                      {
                        (work.gallery) ?
                          (<div className="a-card__gallery"> 
                            {
                              work.gallery.map((img, idx) => (
                                <img src={'/images/' + img} key={'img' + idx} />
                              ))
                            }
                          </div>)
                        : ('Нет информации')
                      }
                    </div>
                  </div>
                </div>
                <Button 
                   type="primary"
                   onClick={this.openModalAddWork.bind(this, work, idx)}
                   icon={<FormOutlined />}
                 />
                 <Popconfirm title="Удалить?" 
                   icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                   okText="Да" 
                   cancelText="Нет"
                   onConfirm={this.deleteWork.bind(this, work)}
                 >
                   <Button 
                     type="primary"
                     icon={<DeleteOutlined />}
                   />
                 </Popconfirm>
              </div>
            ))
          }
        </div>

        <div className="a-btn">
          <Button 
            type="primary"
            onClick={this.openModalAddWork.bind(this, null)}
          >Добавить работу</Button>
        </div>

        <ModalAddWork 
          visibleAddWork={this.state.visibleAddWork}
          data={this.state.openWorkData}
          csrf={this.props.csrf}
          cancelAddWork={this.closeModalAddWork}
          handlerChangesData={this.props.handlerChangesData}
          changeValue={this.changeValue}
          setLoading={this.props.setLoading}
        />
      </section>
    );
  }
}

export default Work;