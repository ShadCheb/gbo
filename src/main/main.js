import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Loader from './components/Loader';
import Header from './components/Header';
import Nav from './components/Nav';
import Benefit from './components/Benefit';
import Question from './components/Question';
import Price from './components/Price';
import Employee from './components/Employee';
import Review from './components/Review';
import Map from './components/Map';
import ModalRecord from './components/ModalRecord';
import Footer from './components/Footer';

import '../../public/style/antd.css';
import '../../public/style/lightgallery.min.css';
import '../../public/style/map.css';
import '../../public/style/style.css';
import '../../public/style/main.css';


import { message } from 'antd';
import 'antd/es/message/style/css'; 
import lozad from 'lozad';
import { LightgalleryProvider, LightgalleryItem } from 'react-lightgallery';
import InputMask from 'react-input-mask';

const container = document.getElementById('page-main');
const csrf = container.dataset.csrf;
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);

const certificates1 = [
  'img/certificates/certif_1.jpg',
  'img/certificates/certif_2.jpg',
  'img/certificates/certif_3.jpg',
];
const certificates2 = [
  'img/certificates/certif_4_1.jpg',
  'img/certificates/certif_4_2.jpg',
];


const PhotoItem = ({image, group, id}) => {
  if (id === 0)
    return (
      <LightgalleryItem group={group} src={image}>
        <button className="btn-1 btn--blue">Просмотреть</button>
      </LightgalleryItem>
    );
  else
    return (
      <div>
        <LightgalleryItem group={group} src={image} />
      </div>
    ); 
};

class Main extends Component {
  state = {
    data: true,
    csrf,

    benefit: {
      consumption: 10,
      mileage: 30,
      petrolList: ['ai92', 'ai95'],
      petrol: 'ai92'
    },

    cityList, // Список городов
    infoCity, // информация про выбранный город

    certificates: [
      certificates1,
      certificates2
    ],

    modalRecord: {
      visible: false,
      title: 'Форма'
    },

    showMenu: false, // открытие меню

    map: null,
    elemMap: null,
    elemEmployee: null,
    loadMap: false, // загрузилась ли карта
    loadEmployee: false, // загрузились ли сотрудники

    loader: true
  };

  componentDidMount = () => {
    window.addEventListener('scroll', this.eventScrollToMap);

    let benefit = this.state.benefit;

    benefit.petrol = this.state.benefit.petrolList[0];
    this.setState({benefit});

    if (!this.state.cityList.length)
      this.setState({data: false});

    const observer = lozad();

    observer.observe();

    window.onload = () => {
      this.setState({loader: false});
    }
  }

  changeDatabenefit = (data) => {
    let benefit = this.state.benefit;

    for(let key in data) {
      benefit[key] = data[key];
    }
    this.setState({benefit});
  }

  openModalRecord = (e) => {
    let target = e.target;
    let title = target.closest('button').textContent;
    let modalRecord = {
      target,
      visible: true,
      title,
      page: 'Главная'
    };

    this.setState({modalRecord});
  }

  closeModalRecord = () => {
    let modalRecord = {
      visible: false,
      title: 'Форма'
    };
    this.setState({modalRecord});
  }

  /*Отправка сообщений*/
  error = (msg) => {
    message.error(msg);
  };
  
  success = (msg) => {
    message.success(msg);
  };

  // const generationMessage = (input) => {
  checkSend = (value, valid) => {
    const validArr = valid.split(',');
    let check = true;

    const checkFunctionList = (type, value) => {
      if (type == 'required') {
        return (value !== '')
          ? {result: false, message: 'Введены не все данные'}
          : {result: true}
        
      } else if (type == 'phone') {
        let phone = value.match(/\d/g);
        
        if (!phone) {
          return {result: false, message: 'Введите номер телефона'};
        } else if (phone.length < 6) {
          return {result: false, message: 'Введите номер телефона правильно'}
        } else {
          return {result: true};
        }
      } else if (type == 'check') {
        return (!value) 
          ? {result: false, message: 'Вы не дали согласия на обработку персональных данных'}
          : {result: true}
      } else {
        console.log('Не известный тип проверки');
        return {result: false, message: 'Произошла ошибка. Попробуйте позже'};
      }
    }

    validArr.map(type => {
      let {result, message} = checkFunctionList(type, value);

      if (message)
        this.error(message);
      if (!result)
        check = false;
    });

    return check;
  };

  send = (e) => {
    e.preventDefault();

    let target = e.target;
    let formSend = target.closest('form');
    let inputList = formSend.querySelectorAll('input');
    let dataSend = {};
    let check = true;

    target.disabled = true;

    for (let i = 0; i < inputList.length; i++) {
      let valid = inputList[i].dataset && inputList[i].dataset.valid;
      let value = (inputList[i].type == 'checkbox')
        ? inputList[i].checked
        : inputList[i].value;
      let result = (valid) 
        ? this.checkSend(value, valid) : true;

      if (!result)
        check = false;

      dataSend[inputList[i].name] = value;
    }
    dataSend['page'] = 'Главная';

    // Прошла ли валидация
    if (!check) {
      target.disabled = false;

      return;
    }

    // Дополнительные данные для отправки
    if (target && target.dataset) {
      if (target.dataset.type)
        dataSend['type'] = target.dataset.type;
      if (target.dataset.description)
        dataSend['description'] = target.dataset.description;
    }

    fetch('/mail', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': this.state.csrf
      },
      body: JSON.stringify(dataSend)
    })
      .then(res => res.json())
      .then(data => {
        target.disabled = false;

        if (data.success) {
          this.success(data.success);

          window.ym && ym(62691718,'reachGoal','ZAYVKA');
        }
      })
      .catch(e => {
        target.disabled = false;
        if (e.error)
          this.error(e.error);
      })
  }; 

  eventScrollToMap = () => {
    let map = this.state.elemMap;
    const h1 = 600;
    const h2 = -600;

    if (!map) {
      let elemMap = document.querySelector('#map');

      this.setState({elemMap});
      map = elemMap;
    }
    
    if (!this.state.loadMap) {
      let aPos = map.scrollTop + map.getBoundingClientRect().top;

      if (aPos < h1 && aPos > h2) { 
        window.ymaps && ymaps.ready(this.initMap);
        this.setState({loadMap: true});
        window.removeEventListener('scroll', this.eventScrollToMap);
      }
    }
  }

  /*
   * рендер карты
  */
  initMap = () => {
    let {infoCity} = this.state;

    if (!document.querySelector('#map') || !infoCity.addresses)
      return;

    let points = infoCity.addresses.map(address => (
      {
        coord: address.coords && JSON.parse(address.coords) || null,
        address: address.address
      }
    )).filter(address => {
      return (address.coord)
    });

    if (!points || !points.length)
      return;

    let map = new ymaps.Map('map', {
      center: points[0].coord,
      zoom: 17,
      controls: ['zoomControl']
    });

    points.forEach(function(p) {
      let polygonLayout = ymaps.templateLayoutFactory.createClass(
        `<div class="placemark__layout"><p>${p.address}</p></div>`
      );
      let placemark = new ymaps.Placemark(p.coord, {
        hintContent: p.address
      }, {
          iconLayout: polygonLayout,
          iconShape: {   
              type: 'Polygon',
              coordinates: [
                [[0,0],[-6,-15],[-16,-15],[-16,-30],[140,-30],[140,-15],[6,-15]]
              ]
          }
        }
      );

      map.geoObjects.add(placemark);
    });
    
    if (points.length > 1)
      map.setBounds(map.geoObjects.getBounds());

    this.setState({map});
  }

  selectCityToMap = (coord) => {
    this.state.map.setCenter(coord, 17);
  }

  // Открытие/закрытие меню
  toggleMenu = () => {
    this.setState(function(prevValue) {
      return ({showMenu: !prevValue.showMenu});
    });
  }

  render() {
    let {infoCity} = this.state;

    if (this.state.data)
      return (
        <div>
            {/* { this.state.loader && <Loader /> }  */}

            <main className="main" id="main">
              <div className="main__bcg-1" />
              <div className="main__bcg-2" />
              <div className="container">
                
                <Header 
                  cityList={this.state.cityList}
                  activeCity={infoCity}
                />
                <Nav 
                  page="isHome"
                  showMenu={this.state.showMenu}
                  social={infoCity.social}
                  closeMenu={this.toggleMenu}
                />

                <div className="main__body">
                  <p className="main__bcg">Gazoved</p>
                  <div className="main__text">
                    <h1 className="main__caption">
                      <span className="main__caption--first">Установка</span>
                      <span className="main__caption--last">и регистрация ГБО</span>
                    </h1>
                    {
                      (infoCity.city)
                        ? (
                            <div>
                              <h2 className="main__caption-under">в {infoCity.city.name2 || 'городе N'}<span></span></h2>
                            </div>
                          ) 
                        : ('')
                    }
                    <div className="main__btn">
                      <form className="main__btn__form">
                        <label className="form__input">
                          <InputMask mask="+7 (999) 999-99-999" data-valid="phone" 
                            type="text" name="phone" required />
                          <span>Телефон</span>
                        </label>
                        <input type="hidden" name="_csrf" value={this.state.csrf} />
                        <button 
                          data-type="Узнать цену установки ГБО"
                          className="btn-1" 
                          aria-label="Узнать цену"
                          onClick={this.send.bind(this)}
                          id="test"
                        >Узнать цену</button>
                      </form>
                    </div>
                  </div>
                  <div className="main__img">
                    <picture className="lozad" data-iesrc="/img/main-1.png" data-alt="Gazoved">
                      <source media="(min-width: 768px)" srcSet="/img/main-1.png" />
                      <source media="(min-width: 420px)" srcSet="/img/main-1-p.png" />
                      <source media="(min-width: 300px)" srcSet="/img/main-1-m.png" />
                    </picture>
                  </div>
                </div>
              </div>
            </main>

            <Benefit 
              data={this.state.benefit}
              csrf={this.state.csrf}
              changeData={this.changeDatabenefit}
              openModal={this.openModalRecord.bind(this)}
            />

            <section className="advantages">
              <div className="container">
                <div className="advantages__body">
                  <div className="advantages__img">
                    <div className="advantages__bcg">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <picture className="lozad" data-iesrc="/img/main-1.png" 
                      data-alt="Преимущества установки ГБО Gazoved">
                      <source media="(min-width: 768px)" srcSet="/img/advantages-1.png" />
                      <source media="(min-width: 300px)" srcSet="/img/advantages-1-m.png" />
                    </picture>
                  </div>
                  <div className="advantages__list">
                    <div className="advantages__item">
                      <div className="advantages__item__img lozad"
                        data-background-image-set="url('../img/icon-advantages/credit-card.png')"
                      ></div>
                      <div className="advantages__item__text">
                        <h2 className="caption__h2">Рассрочка без переплат</h2>
                        <p>Установка газового оборудования в рассрочку 
                          до 10 месяцев под 0 % годовых</p>
                      </div>
                    </div>
                    <div className="advantages__item">
                      <div className="advantages__item__img lozad"
                        data-background-image-set="url('../img/icon-advantages/terms-and-conditions.png')"
                      ></div>
                      <div className="advantages__item__text">
                        <h2 className="caption__h2">Регистрация</h2>
                        <p>Полный пакет документов в ГИБДД за 3 000 руб</p>
                      </div>
                    </div>
                    <div className="advantages__item">
                      <div className="advantages__item__img lozad"
                        data-background-image-set="url('../img/icon-advantages/cyber-security.png')"
                      ></div>
                      <div className="advantages__item__text">
                        <h2 className="caption__h2">Электронный мультиклапан</h2>
                        <p>Мультиклапан 5-ю степенями безопасности в любом комплекте</p>
                      </div>
                    </div>
                    <div className="advantages__item">
                      <div className="advantages__item__img lozad"
                        data-background-image-set="url('../img/icon-advantages/hepa-filter.png')"
                      ></div>
                      <div className="advantages__item__text">
                        <h2 className="caption__h2">Фильтр Ultra 360</h2>
                        <p>Используем фильтра против плохого газа</p>
                      </div>
                    </div>
                    <div className="advantages__item">
                      <div className="advantages__item__img lozad"
                        data-background-image-set="url('../img/icon-advantages/water.png')"
                      ></div>
                      <div className="advantages__item__text">
                        <h2 className="caption__h2">Неубиваемые форсунки</h2>
                        <p>Ставим самые надёжные форсунки</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="installment">
              <div className="container">
                <div className="installment__bcg bcg--2"></div>
                <div className="installment__body">
                  <div className="installment__header">
                    <h2 className="installment__caption">Вы можете установить <strong>ГБО в рассрочку</strong></h2>
                    <div className="installment__label">
                      <p>до <strong>10</strong> месяцев</p>
                      <p>под <strong>0 %</strong> годовых</p>
                    </div>
                  </div>
                  <ul className="installment__list">
                    <li>Рассрочка от компании: 50 % первоначальный взнос, 
                      оставшаяся сумма в течении 2 месяцев равными долями.</li>
                    <li>Рассрочка от банка: до 10 месяцев, без первоначального 
                      взноса, без переплат. В обоих случаях нужен только паспорт</li>
                  </ul>
                  <div className="installment__btn">
                    <button className="btn-1"
                      data-type="Консультация по рассрочке"
                      aria-label="Получить консультацию"
                      onClick={this.openModalRecord.bind(this)}
                    >Получить консультацию</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Оборудование */}
            {
              (infoCity.equipment && infoCity.equipment.length)
                ? (<Price 
                    equipment={infoCity.equipment}
                    openModal={this.openModalRecord.bind(this)}
                />) : ('')
            }

            <section className="certificates">
              <div className="container">
                <div className="caption__container">
                  <h2 className="caption__section">Сертификаты</h2>
                </div>
                <LightgalleryProvider>
                  <div className="certificates__body">
                    <div className="certificates__bcg bcg--2" />
                    <div className="certificates__text">
                      <h2 className="caption__h2">Сертифицированные мастера</h2>
                      <p className="text__p">	Более 1 000 установленных систем ГБО на автомобили 
                        в регионах: Чебоксары, Йошкар-Ола и Казань. Наши мастера прошли обучении 
                        в учебных центрах Digitronic, OMVL и в компании «мир газа». Обратитесь 
                        к нам, даже если у вас автомобиль редкой марки – в компании работают 
                        мастера с опытом от 5 лет, прошедшие курсы повешения квалификации!
                      </p>
                      <div className="certificates__btn">
                        { this.state.certificates && this.state.certificates[0].map((img, idx) => (
                          <PhotoItem 
                            image={img} 
                            group="group1" 
                            id={idx} 
                            key={idx}
                          />
                        )) }
                      </div>
                    </div>
                    <div className="certificates__img certificates__bcg--1">
                      <picture className="lozad" data-iesrc="/img/certificates-1.png" 
                        data-alt="Сертифицированные мастера">
                        <source media="(min-width: 768px)" srcSet="/img/certificates-1.png" />
                        <source media="(min-width: 300px)" srcSet="/img/certificates-1-m.png" />
                      </picture>
                    </div>
                  </div>
                  <div className="certificates__body">
                    <div className="certificates__img certificates__bcg--2">
                      <picture className="lozad" data-iesrc="/img/certificates-2.png" 
                        data-alt="Сертифицированный сервис ГБО Газовед">
                        <source media="(min-width: 768px)" srcSet="/img/certificates-2.png" />
                        <source media="(min-width: 300px)" srcSet="/img/certificates-2-m.png" />
                      </picture>
                    </div>
                    <div className="certificates__text">
                      <h2 className="caption__h2">Сертифицированный сервис</h2>
                      <p className="text__p">У нас сертифицированная станция по установке ГБО. Все 
                        документы, все экспертизы на газовое оборудование вы получаете в одном 
                        месте, у нас в автосервисе.
                      </p>
                      <p className="text__p">Наш центр установки ГБО - аккредитованный партнер 
                        "ГАЗПРОМ-газомоторное топливо" У нас вы можете официально установить газобаллонное 
                        оборудование пропан и метан, на легковые и грузовые автомобили и на разные типы 
                        двигателя и системы впрыска (на дизель, инжектор, моновпрыск, непосредственный 
                        прямой впрыск, распределенный впрыск, двигатели tsi, fsi и др.).
                      </p>
                      <p className="text__p">GAZOVED - официальный дилер ГБО BRC (БРС), LOVATO (ЛОВАТО), 
                        ZAVOLI (ЗАВОЛИ), DIGITRONIC (ДИДЖИТРОНИК), OMVL (ОМВЛ) в Чебоксарах, Йошкар-Оле 
                        и Казани. Посмотрите сертификаты и ознакомьтесь с отзывами тех, кто поставил газ 
                        в машину у нас.
                      </p>
                      <div className="certificates__btn">
                      { this.state.certificates[1].map((img, idx) => (
                          <PhotoItem 
                            image={img} 
                            group="group2" 
                            id={idx} 
                            key={idx}
                          />
                        )) }
                      </div>
                    </div>
                  </div>
                </LightgalleryProvider>
              </div>
            </section>

            {/* Сотрудники */}
            {
              (infoCity.employees && infoCity.employees.length) 
                ? (<Employee
                  employeeList={infoCity.employees}
                />) : ('')
            }

            {/* Вопросы */}
            <Question/>

            <section className="registration">
              <div className="container">
                <div className="caption__container">
                  <h2 className="caption__section"><strong>Регистрация</strong> ГБО</h2>
                </div>
                <div className="registration__body">
                  <div className="registration__col">
                    <article className="registration__block">
                      <div className="registration__block__num">1</div>
                      <h2 className="caption__h2">Заключаем договор</h2>
                      <p>Вы предоставляете документы на транспортное средство и собственника.</p>
                      <p>Физ. лица:</p>
                      <ul className="text__ul">
                        <li>свидетельство о регистрации ТС</li>
                        <li>паспорт транспортного средства (ПТС)</li>
                        <li>паспорт гражданина РФ</li>
                      </ul>
                      <p>Юр. лица:</p>
                      <ul className="text__ul">
                        <li>свидетельство о регистрации ТС</li>
                        <li>паспорт транспортного средства (ПТС)</li>
                        <li>копия свидетельства ОГРН</li>
                        <li>паспортные данные доверенного лица</li>
                      </ul>
                    </article>
                    <div className="registration__img">
                      <div className="registration__bcg">
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                      <picture className="lozad" data-iesrc="/img/registration-1.png" 
                        data-alt="Регистрация ГБО в Газовед">
                        <source media="(min-width: 768px)" srcSet="/img/registration-1.png" />
                        <source media="(min-width: 300px)" srcSet="/img/registration-1-m.png" />
                      </picture>
                    </div>
                  </div>
                  <div className="registration__col">
                    <article className="registration__block">
                      <div className="registration__block__num">2</div>
                      <h2 className="caption__h2">Подготовка</h2>
                      <p>Оформление предварительной экспертизы</p>
                    </article>
                    <article className="registration__block">
                      <div className="registration__block__num">3</div>
                      <h2 className="caption__h2">Заявление в ГИБДД</h2>
                      <p>Получение разрешения в ГИБДД на внесение изменений в конструкцию ТС</p>
                    </article>
                    <article className="registration__block">
                      <div className="registration__block__num">4</div>
                      <h2 className="caption__h2">Оформление</h2>
                      <p>Подготовка документов на оборудование и проведенные работы</p>
                    </article>
                    <article className="registration__block">
                      <div className="registration__block__num">5</div>
                      <h2 className="caption__h2">Экспертиза</h2>
                      <p>Прохождение ТО, подача документов в ГИБДД</p>
                    </article>
                  </div>
                </div>
              </div>
            </section>

            <section className="install">
              <div className="container">
                <div className="install__bcg bcg--2" />
                <div className="install__body">
                  <div className="install__img">
                    <picture className="lozad" data-iesrc="/img/install-1.png" 
                      data-alt="Установка ГБО в Газовед">
                      <source media="(min-width: 768px)" srcSet="/img/install-2.png" />
                      <source media="(min-width: 300px)" srcSet="/img/install-2-m.png" />
                    </picture>
                  </div>
                  <div className="install__form">
                    <p className="install__p">Отправь заявку и Наш специалист 
                      свяжется с Вами для установки ГБО</p>
                    <form calss="form">
                      <label className="form__input">
                        <input type="text" name="name" required />
                        <span>Имя</span>
                      </label>
                      <label className="form__input">
                        <InputMask mask="+7 (999) 999-99-999" type="text" 
                          name="phone"  data-valid="phone" required />
                        <span>Телефон</span>
                      </label>
                      <label className="input__check license">
                        <input type="checkbox" name="treatment" 
                          data-valid="check" className="input__required" />
                        <span></span>
                        <p>Я даю свое согласие на обработку персональных данных</p>
                      </label>
                      <input type="hidden" name="_csrf" value={this.state.csrf} />
                      <div className="install__btn">
                        <button className="btn-1 btn--blue" 
                          data-type="Установка ГБО"
                          aria-label="Отправить заявку"
                          type="submit"
                          onClick={this.send.bind(this)}
                        >Отправить</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="install__caption__container">
                  <h2 className="install__caption">Установка ГБО<span></span><span></span></h2>
                  <div className="install__caption__bcg"></div>
                </div>
              </div>
            </section>

            <section className="gibdd">
              <div className="container">
                <div className="gibdd__bcg bcg--2" />
                <div className="gibdd__body">
                  <div className="gibdd__form">
                    <p className="gibdd__p">Отправь заявку и Наш специалист 
                      свяжется с Вами для регистрации в ГИБДД</p>
                    <form calss="form">
                      <label className="form__input">
                        <input type="text" name="name" required />
                        <span>Имя</span>
                      </label>
                      <label className="form__input">
                        <InputMask mask="+7 (999) 999-99-999" data-valid="phone" 
                          type="text" name="phone" required />
                        <span>Телефон</span>
                      </label>
                      <label className="input__check license">
                        <input type="checkbox" name="treatment" 
                          data-valid="check" className="input__required" />
                        <span></span>
                        <p>Я даю свое согласие на обработку персональных данных</p>
                      </label>
                      <input type="hidden" name="_csrf" value={this.state.csrf} />
                      <div className="gibdd__btn">
                        <button className="btn-1 btn--blue" 
                          data-type="Регистрация в ГИБДД"
                          aria-label="Отправить заявку"
                          type="submit"
                          onClick={this.send.bind(this)}
                        >Отправить</button>
                      </div>
                    </form>
                  </div>
                  <div className="gibdd__img">
                    <picture className="lozad" data-iesrc="/img/gibdd-1.png" 
                      data-alt="Регистрация ГБО в ГИБДД с Газовед">
                      <source media="(min-width: 768px)" srcSet="/img/gibdd-1.png" />
                      <source media="(min-width: 300px)" srcSet="/img/gibdd-1-m.png" />
                    </picture>
                  </div>
                </div>
                <div className="gibdd__caption__container">
                  <h2 className="gibdd__caption">Регистрация в ГИБДД<span></span></h2>
                  <div className="gibdd__caption__bcg"></div>
                </div>
              </div>
            </section>

            {/* Отзывы */}
            {
              (infoCity.reviews && infoCity.reviews.length) 
                ? (<Review
                  reviewList={infoCity.reviews}
                  reviewVk={infoCity.review_vk}
                />) : ('')
            }

            {/* Карта */}
            {
              (infoCity.addresses && infoCity.addresses.length)
                ? (<Map 
                    activeCity={infoCity}
                    selectCityToMap={this.selectCityToMap}
                />) : ('')
            }

            <Footer 
              activeCity={infoCity}
            />

            <ModalRecord 
              data={this.state.modalRecord}
              close={this.closeModalRecord.bind(this)}
              csrf={csrf}
            />

            <button className="btn-menu"
              onClick={this.toggleMenu}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
      );
    else 
      return (
        <div>
          <div className="container">
            <h2 className="caption__section">Нет данных для отображения</h2>
          </div>
        </div>
      );
  }
}

ReactDOM.render(<Main/>, container);

