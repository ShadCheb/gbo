import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ModalAddCity from './components/ModalAddCity';
import General from './components/General';
import Address from './components/Address';
import Social from './components/Social';
import Time from './components/Time';
import Phone from './components/Phone';
import Employee from './components/Employee';

import { 
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
  }
];

cityList = JSON.parse(cityList);


function BodyList({component, csrf, data, handlerChangesData}) {
  switch(component) {
    case typeList[0].brief: // 'general'
      let {name2, email} = data.city || {name2: null, email: null};
      let dataGeneral = {
        id:     data.id,
        name:   data.name,
        brief:  data.brief,
        name2,
        email
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
      let socialId = (data.social) 
        ? data.social.id 
        : null;
      let dataSocial = data.social || {};

      dataSocial['id'] = data.id;
      dataSocial['socialId'] = socialId;

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
      let phoneId = (data.phone) 
        ? data.phone.id 
        : null;
      let dataPhone = data.phone || {};

      dataPhone['id'] = data.id;
      dataPhone['phoneId'] = phoneId;

      return (<Phone 
        csrf={csrf}
        data={dataPhone}
        handlerChangesData={handlerChangesData}
      />);
    case typeList[5].brief: // 'employee'
      let dataEmployee = data.employee || {employee: null};
    
      dataEmployee['cityListId'] = data.id;
    
      return (<Employee 
        csrf={csrf}
        data={dataEmployee}
        handlerChangesData={handlerChangesData}
      />);

    default:
      return (<p>Ошибка при загрузке компонента</p>);
  }
}

function Body({data, typeList, type, activateType, handlerChangesData}) {
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
    if (city.target && city.target.value)
      this.getCity(city.target.value);
  }
  setModalAddCity(value) {
    this.setState({visibleAddCity: value});
  }

  // Общий обработчик изменений
  handlerChangesData = (values) => {
    console.log('?', values);
    if (values.error) {
      this.error('Произошла ошибка. Попробуйте позже');

      return;
    }

    let data = this.state.data;

    this.success('Изменения успешно проведены');
    for(let key in values) {
      data[key] = values[key];
    }
    console.log('!', data);
    this.setState({data});
  }

  activateType = (value) => {
    this.setState({type: value})
  }

  render() {
    let headerText = (this.state.data) 
      ? 'Выберите город:'
      : 'Добавьте город:';

    return (
      <div>
        <div className="a-container">
          <div className="a-header">
            <p className="a-header__p">{headerText}</p>
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
          />
        </div>
      </div>
    )
  };
}

ReactDOM.render(<Admin/>, container);
