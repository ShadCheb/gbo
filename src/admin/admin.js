import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ModalAddCity from './components/ModalAddCity';
import General from './components/General';
import Address from './components/Address';
import Social from './components/Social';
import Time from './components/Time';
import Phone from './components/Phone';
import Employee from './components/Employee';
import Equipment from './components/Equipment';
import Review from './components/Review';
import Work from './components/Work';

import { 
  Spin,
  Button, 
  Radio,
  message 
} from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';

const container = document.getElementById('page-admin');
const csrf = container.dataset.csrf;
let cityList = container.dataset.city_list;
const typeList = [
  {
    brief: 'general',
    name: 'Основные'
  },
  {
    brief: 'address',
    name: 'Адрес'
  },
  {
    brief: 'social',
    name: 'Соц. Сети'
  },
  {
    brief: 'time',
    name: 'Время работы'
  },
  {
    brief: 'phone',
    name: 'Телефон'
  },
  {
    brief: 'employee',
    name: 'Сотрудники'
  },
  {
    brief: 'equipment',
    name: 'Оборудование'
  },
  {
    brief: 'review',
    name: 'Отзывы'
  },
  {
    brief: 'work',
    name: 'Работы (блог)'
  },
];

cityList = JSON.parse(cityList);


function BodyList({component, csrf, data, handlerChangesData, setLoading}) {
  switch(component) {
    case typeList[0].brief: // 'general'
      let {name2, email} = data.city || {name2: null, email: null};
      let dataGeneralFormat = [
        {name: 'name', value: data.name},
        {name: 'brief', value: data.brief},
        {name: 'name2', value: name2},
        {name: 'email', value: email},
      ];
      let dataGeneral = {
        id:     data.id,
        data:   dataGeneralFormat
      };

      return (
        <General 
          csrf={csrf}
          data={dataGeneral}
          handlerChangesData={handlerChangesData}
        />
      );
    case typeList[1].brief: // 'address'
      let dataAddress = {
        id: data.id,
        addresses: data.addresses,
        city: data.name
      };

      return (
        <Address 
          csrf={csrf}
          data={dataAddress}
          handlerChangesData={handlerChangesData}
        />
      );
    case typeList[2].brief: // 'social'
      let social = data.social || {};
      let dataSocialFormat = [
        {name: 'vk', value: social.vk},
        {name: 'instagram', value: social.instagram},
        {name: 'youtube', value: social.youtube}
      ];
      let dataSocial = {
        id: data.id,
        socialId: social.id,
        data: dataSocialFormat
      };

      return (
        <Social 
          csrf={csrf}
          data={dataSocial}
          handlerChangesData={handlerChangesData}
        />
      );
    case typeList[3].brief: // 'time'
      let timeId = (data.time) 
        ? data.time.id 
        : null;
      let dataTime = data.time || {};

      dataTime['id'] = data.id;
      dataTime['timeId'] = timeId;

      return (<Time 
        csrf={csrf}
        data={dataTime}
        handlerChangesData={handlerChangesData}
      />);
    case typeList[4].brief: // 'phone'
      let phone = data.phone || {};
      let phoneId = phone.id;
      let dataPhoneFormat = [
        {name: 'kod', value: phone.kod},
        {name: 'number', value: phone.number},
        {name: 'link', value: phone.link}
      ];
      let dataPhone = {
        id: data.id,
        phoneId: phoneId,
        data: dataPhoneFormat
      }

      return (<Phone 
        csrf={csrf}
        data={dataPhone}
        handlerChangesData={handlerChangesData}
      />);
    case typeList[5].brief: // 'employee'
      let dataEmployee = {};
      
      dataEmployee['cityListId'] = data.id;

      if (!data.employee) {      
        fetch('/admin/employee/get', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-XSRF-TOKEN': csrf
          },
          body: JSON.stringify({cityId: data.id})
        })
          .then(res => res.json())
          .then(data => {
            if (data.result) {
              handlerChangesData({employee: data.result}, true);
              dataEmployee['employee'] = data.result;
            }
          })
          .catch(e => {
            if (e.error)
              this.error(e.error);
          });
      } else {
        dataEmployee['employee'] = data.employee;
      }
    
      return (<Employee 
        csrf={csrf}
        data={dataEmployee}
        handlerChangesData={handlerChangesData}
      />);
    case typeList[6].brief: // 'equipment'
      let dataEquipment = {};
    
      dataEquipment['cityListId'] = data.id;

      if (!data.equipment) {
        fetch('/admin/equipment/get', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-XSRF-TOKEN': csrf
          },
          body: JSON.stringify({cityId: data.id})
        })
          .then(res => res.json())
          .then(data => {
            if (data.result) {
              data.result = data.result.map(item => {
                item.cylinder = item.cylinder.split(','); // Строку в массив
  
                return item;
              });
              handlerChangesData({equipment: data.result}, true);
              dataEquipment['equipment'] = data.result;
            }
          })
          .catch(e => {
            if (e.error)
              this.error(e.error);
          });
      } else {
        dataEquipment['equipment'] = data.equipment;
      }

      return (<Equipment
        csrf={csrf}
        data={dataEquipment}
        handlerChangesData={handlerChangesData}
      />);

    case typeList[7].brief: // 'review'
      let dataReview = {};
    
      dataReview['reviewListVk'] = data.reviewListVk;
      dataReview['infoGroup'] = data.infoGroup;

      if (!data.review) {
        fetch('/admin/review/get', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-XSRF-TOKEN': csrf
          },
          body: JSON.stringify({cityId: data.id})
        })
          .then(res => res.json())
          .then(data => {
            if (data.result) {
              handlerChangesData({
                review: data.result.reviews || [],
                reviewVk: data.result.review_vk
              }, true);
              dataReview['review'] = data.result.reviews;
              dataReview['reviewVk'] = data.result.review_vk;
            }
          })
          .catch(e => {
            if (e.error)
              this.error(e.error);
          });
      } else {
        dataReview['review'] = data.review;
        dataReview['reviewVk'] = data.reviewVk;
      }

      return (<Review
        csrf={csrf}
        data={dataReview}
        handlerChangesData={handlerChangesData}
      />);

    case typeList[8].brief: // 'work'
      let dataWork = {};

      dataWork['cityListId'] = data.id;

      if (!data.work) {  
        fetch('/admin/work/get', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-XSRF-TOKEN': csrf
          },
          body: JSON.stringify({cityId: data.id})
        })
          .then(res => res.json())
          .then(data => {  
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
  
            handlerChangesData({work: data.result}, true);
            dataWork['work'] = data.result;
          })
          .catch(e => {  
            if (e.error)
              this.error(e.error);
          });
      } else {
        dataWork['work'] = data.work;
      }

      return (<Work
        csrf={csrf}
        data={dataWork}
        handlerChangesData={handlerChangesData}
        setLoading={setLoading}
      />);

    default:
      return (<p>Ошибка при загрузке компонента</p>);
  }
}

function Body({data, typeList, type, activateType, handlerChangesData, setLoading}) {
  if (data)
    return (
      <div className="a-body">
        <div className="a-body__left">
          {
            typeList.map((t, idx) => (
              <Button block 
                key={idx}
                type={type == t.brief ? 'primary' : ''}
                onClick={activateType.bind(this, t.brief)}
              >{t.name}</Button>
            ))
          }
        </div>
        <div className="a-body__right">
          <BodyList 
            component={type}
            csrf={csrf}
            data={data}
            handlerChangesData={handlerChangesData}
            setLoading={setLoading}
          />
        </div>
      </div>
    )
  else 
    return (
      <div className="a-body">
        <p>Нет данных для отображения</p>
      </div>
    )
}


class Admin extends Component {
  state = {
    loading: false, // загрузка

    csrf, // csrf для отправки post запроса на сервер
    change: false, // Были ли изменения

    data: null, // Данные выбранного города
    city: null, // Выбранный город
    type: typeList[0].brief, // Активный тип данных ('general')

    typeList, // Список типов данных
    cityList, // Список городов

    visibleAddCity: false // Модальное окно добавления Города
  }

  componentDidMount = () => {
    let cityList = this.state.cityList;

    if (cityList[0]) {
      this.getCity(cityList[0].brief);
      this.setState({city: cityList[0].brief});
    }
  }

  // Уведомления
  error = (msg) => {
    message.error(msg);
  };
  success = (msg) => {
    message.success(msg);
  };

  getCity = (city) => {
    fetch('/admin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': this.state.csrf
      },
      body: JSON.stringify({city})
    })
      .then(res => res.json())
      .then(data => {
        this.setState({data});
      })
      .catch(e => {
        if (e.error)
          this.error(e.error);
      })
  }
  addCity = (city) => {
    fetch('/admin/city', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': csrf
      },
      body: JSON.stringify(city)
    })
      .then(res => res.json())
      .then(({result}) => {
        this.setState({visibleAddCity: false});
        this.getCity(city.brief);
        this.success('Город успешно добавлен');
        this.setState({cityList: result});
      })
      .catch(e => {
        if (e.error) {
          this.error('Произошла ошибка. Попробуйте позже');
        }
      })
  }
  selectCity = (city) => {
    if (city.target && city.target.value) {
      this.getCity(city.target.value);
      this.setState({city: city.target.value});
    }
  }
  setModalAddCity(value) {
    this.setState({visibleAddCity: value});
  }

  // Общий обработчик изменений
  // первый параметр объект обновленных данных(ключ значение), второй - нужно ли показывать уведомление
  // :todo Нужно переделать на текст сообщения 
  handlerChangesData = (values, notmessage) => {
    if (values.error) {
      this.error('Произошла ошибка. Попробуйте позже');

      return;
    }

    let data = this.state.data;

    if (!notmessage)
      this.success('Изменения успешно проведены');

    for(let key in values) {
      data[key] = values[key];
    }
    this.setState({data});
  }

  activateType = (value) => {
    this.setState({type: value});
  }

  setLoading = (value) => {
    this.setState({loading: value});
  }

  render() {
    return (
      <div>
        <Spin spinning={this.state.loading}>
          <div className="a-container">
            <div className="a-logo">
              <div>
                <h1 className="a-logo__name">Газовед</h1>
                <p className="a-logo__text">панель администратора</p>
                <a className="a-logo__link" href="/" />
              </div>
            </div>
            <div className="a-header">
              <p className="a-header__p">{(this.state.data) ? 'Выберите город:' : 'Добавьте город:'}</p>
              {
                <Radio.Group value={this.state.city} onChange={this.selectCity}>
                  {this.state.cityList.map((city, idx) => (
                    <Radio.Button
                      key={idx}
                      value={city.brief}
                  >{city.name}</Radio.Button>
                  ))}
                </Radio.Group>
              }

              <Button
                type="primary"
                shape="round"
                className="a-header__add-btn"
                onClick={() => {
                  this.setModalAddCity(true);
                }}
              >
                <PlusOutlined twoToneColor="#1890ff"/>
              </Button>
              <ModalAddCity
                visibleAddCity={this.state.visibleAddCity}
                addCity={this.addCity}
                cancelAddCity={() => {
                  this.setModalAddCity(false);
                }}
              />
            </div>
            <Body 
              data={this.state.data}
              typeList={this.state.typeList}
              type={this.state.type}
              activateType={this.activateType}
              handlerChangesData={this.handlerChangesData}
              setLoading={this.setLoading}
            />
          </div>
        </Spin>
      </div>
    )
  };
}

ReactDOM.render(<Admin/>, container);
