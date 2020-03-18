import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header';
import Nav from './components/Nav';
import Benefit from './components/Benefit';
import Question from './components/Question';
import Price from './components/Price';
import ModalRecord from './components/ModalRecord';
import Footer from './components/Footer';

import { LightgalleryProvider, LightgalleryItem } from 'react-lightgallery';
import InputMask from 'react-input-mask';


const container = document.getElementById('page-main');
console.log(container);
const csrf = container.dataset.csrf;
const city = container.dataset.city;
let cityList = container.dataset.city_list;

cityList = JSON.parse(cityList);

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
      petrol: null
    },

    activeCity: {
      id: 0,
      name: 'Чебоксары',
      addresses: ['ул. Лесная, д.3 (Лакреевский лес)', 'ул. Пристанционная, 3'],
      coords: [[47.253127, 56.117577]],
      social: {
        vk: 'vklink',
        instagram: 'instagramlink',
        youtube: ''
      },
      time: {
        from: '09:00',
        before: '19:00',
      },
      phone: {
        kod: '+7(8352)',
        number: '70-91-44',
        link: '+78352709144'
      },
    },
    cityList, 
    // [
    //   {
    //     id: 0,
    //     name: 'Чебоксары',
    //     brief: 'cheboksary'
    //   },
    //   {
    //     id: 1,
    //     name: 'Казань',
    //     brief: 'kazan'
    //   },
    //   {
    //     id: 2,
    //     name: 'Йошкар-ола',
    //     brief: 'yoshkar-ola'
    //   },
    //   {
    //     id: 3,
    //     name: 'Нижний Новгорд',
    //     brief: 'nizhny-novgorod'
    //   }
    // ],

    certificates: [
      certificates1,
      certificates2
    ],

    modalRecord: {
      visible: false,
      title: 'Форма'
    },

    map: null
  };

  componentDidMount = () => {
    let benefit = this.state.benefit;

    benefit.petrol = this.state.benefit.petrolList[0];
    this.setState({benefit});

    this.state.cityList.some(c => {
      if (c.brief == city) {
        let activeCity = this.state.activeCity;

        activeCity.id = c.id;
        activeCity.name = c.name;

        this.setState({activeCity});

        return true;
      }
    });

    if (!this.state.cityList.length)
      this.setState({data: false});
  }

  componentDidMount = () => {
    ymaps.ready(this.initMap);
  }

  changeDatabenefit = (data) => {
    let benefit = this.state.benefit;

    for(let key in data) {
      benefit[key] = data[key];
    }
    this.setState({benefit});
  }

  // Меняем город в шапке
  handleChange = (value) => {
    let brief = '';

    this.state.cityList.some(c => {
      if (c.id == value){
        brief = c.brief;

        return true;
      }
    });

    location.href = '/?city=' + brief;
  }

  openModalRecord = (e) => {
    let target = e.target;
    let title = target.closest('button').textContent;
    let modalRecord = {
      visible: true,
      title
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
  sendRequest = (e) => {
    let data = {}; // Данные для отправки
    let form = e.target;
    let csrf = '';

    console.log(form);

    let inputList = form.querySelectorAll('input, textarea');

    console.log('input ', inputList);

    for(let item in inputList) {
      console.log();
    }
    if (!csrf) {
      console.log('csrf error');
    }

    fetch('/card/remove/' + id, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': csrf
      },
      body: JSON.stringify(data)
    }).then(response => response .json())
      .then(result => {
        console.log(result);
      })
      .catch(e => {
        console.log(e);
      })
  }

  /*
  // string | number | integer | date | regexp | boolean
  requirementType: 'string',

  // validateString | validateDate | validateMultiple
  validateString: function (value, requirement) {
      let regexp = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
      
      return  regexp.test(value) 
  },

  messages: {
      ru: 'ÐÐµÐ²ÐµÑ€Ð½Ñ‹Ð¹ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚ Ð½Ð¾Ð¼ÐµÑ€Ð°',
      en: 'Invalid number format'
  } */

  /*
   * рендер карты
  */
  initMap = () => {
    let points = this.state.activeCity.coords;
    let map = new ymaps.Map('map', {
      center: points[0],
      zoom: 17,
      controls: ['zoomControl']
    });

    points.forEach(function(p) {
      // balloonContentHeader: row.name,
      // balloonContent: row.address,
      // balloonContentFooter: row.text
      let placemark = new ymaps.Placemark(p, {
        preset: 'islands#blueDotIcon',
        iconColor: '#00c2ff'
      });

      map.geoObjects.add(placemark);
    });
    
    if (points.length > 1)
      map.setBounds(map.geoObjects.getBounds());

    this.setState({map});
  }


  render() {
    if (this.state.data)
      return (
        <div>
            <main className="main" id="main">
              <div className="main__bcg-1" />
              <div className="main__bcg-2" />
              <div className="container">
                
                <Header 
                  city={this.state.cityList}
                  activeCity={this.state.activeCity}
                  handleChange={this.handleChange}
                />
                <Nav 
                  social={this.state.activeCity.social}
                />

                <div className="main__body">
                  <p className="main__bcg">Gazoved</p>
                  <div className="main__text">
                    <h1 className="main__caption">
                      <span className="main__caption--first">Установка</span>
                      <span className="main__caption--last">и регистрация ГБО</span>
                    </h1>
                    <div>
                      <h2 className="main__caption-under">в Чебоксарах<span></span></h2>
                    </div>  
                    <div className="main__btn">
                      <form className="main__btn__form">
                        <label className="form__input">
                          <InputMask mask="+7 (999) 999-99-999" type="text" name="phone" required />
                          <span>Телефон</span>
                        </label>
                        <input type="hidden" name="_csrf" value={this.state.csrf} />
                        <button 
                          className="btn-1" 
                          aria-label="Узнать цену"
                        >Узнать цену</button>
                      </form>
                    </div>
                  </div>
                  <div className="main__img">
                    <img src="img/main-1.png" alt="" />
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
                    <img src="img/advantages-1.png" alt="" />
                  </div>
                  <div className="advantages__list">
                    <div className="advantages__item">
                      <div className="advantages__item__img adv-item--plan"></div>
                      <div className="advantages__item__text">
                        <h2 className="caption__h2">Рассрочка без переплат</h2>
                        <p>Установка газового оборудования в рассрочку 
                          до 12 месяцев под 0 % годовых</p>
                      </div>
                    </div>
                    <div className="advantages__item">
                      <div className="advantages__item__img adv-item--reg"></div>
                      <div className="advantages__item__text">
                        <h2 className="caption__h2">Регистрация</h2>
                        <p>Полный пакет документов в ГИБДД за 3 000 руб</p>
                      </div>
                    </div>
                    <div className="advantages__item">
                      <div className="advantages__item__img adv-item--bonus"></div>
                      <div className="advantages__item__text">
                        <h2 className="caption__h2">Электронный мультиклапан</h2>
                        <p>Последнее поколение клапана с двойной защитой от утечки газа</p>
                      </div>
                    </div>
                    <div className="advantages__item">
                      <div className="advantages__item__img adv-item--install"></div>
                      <div className="advantages__item__text">
                        <h2 className="caption__h2">Фильтр Ultra 360</h2>
                        <p>В комплект входит фильтр ultra 360</p>
                      </div>
                    </div>
                    <div className="advantages__item">
                      <div className="advantages__item__img adv-item--program"></div>
                      <div className="advantages__item__text">
                        <h2 className="caption__h2">Неубиваемые форсунки</h2>
                        <p>Устанавливаем неубиваемые форсунки</p>
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
                      <p>до <strong>12</strong> месяцев</p>
                      <p>под <strong>0 %</strong> годовых</p>
                    </div>
                  </div>
                  <ul className="installment__list">
                    <li>Рассрочка от компании: 50 % первоначальный взнос, 
                      оставшаяся сумма в течении 2 месяцев равными долями.</li>
                    <li>Рассрочка от банка: до 12 месяцев, без первоначального 
                      взноса, без переплат. В обоих случаях нужен только паспорт</li>
                  </ul>
                  <div className="installment__btn">
                    <button className="btn-1" 
                      aria-label="Получить консультацию"
                      onClick={this.openModalRecord.bind(this)}
                    >Получить консультацию</button>
                  </div>
                </div>
              </div>
            </section>

            <Price 
              openModal={this.openModalRecord.bind(this)}
            />

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
                        { this.state.certificates[0].map((img, idx) => (
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
                      <img src="img/certificates-1.png" alt="Сертифицированные мастера" />
                    </div>
                  </div>
                  <div className="certificates__body">
                    <div className="certificates__img certificates__bcg--2">
                      <img src="img/certificates-2.png" alt="Сертифицированный сервис" />
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

            <section className="staff">
              <div className="staff__bcg-1" />
              <div className="container">
                <div className="staff__bcg-2 bcg--2" />
                <div className="caption__container">
                  <div className="staff__caption">
                    <h2 className="caption__section">Наша <strong>команда</strong></h2>
                    <h3 className="caption__section-under">ведущие эксперты по газовому оборудованию</h3>
                  </div>
                </div>
                <div className="staff__body">
                  <div className="staff__block">
                    <div className="staff__img">
                      <img src="img/staff/staff-1.jpg" alt="Иван Иванов" />
                    </div>
                    <div className="staff__label">
                      <p className="staff__label__name">Иван Иванов</p>
                      <p className="staff__label__post">мастер установки ГБО</p>
                      <p className="staff__label__exp">опыт 5 лет</p>
                    </div>
                  </div>
                  <div className="staff__block">
                    <div className="staff__img">
                      <img src="img/staff/staff-1.jpg" alt="Иван Иванов" />
                    </div>
                    <div className="staff__label">
                      <p className="staff__label__name">Иван Иванов</p>
                      <p className="staff__label__post">мастер установки ГБО</p>
                      <p className="staff__label__exp">опыт 5 лет</p>
                    </div>
                  </div>
                  <div className="staff__block">
                    <div className="staff__img">
                      <img src="img/staff/staff-1.jpg" alt="Иван Иванов" />
                    </div>
                    <div className="staff__label">
                      <p className="staff__label__name">Иван Иванов</p>
                      <p className="staff__label__post">мастер установки ГБО</p>
                      <p className="staff__label__exp">опыт 5 лет</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

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
                      <img src="img/registration-1.png" alt="" />
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
                    <img src="img/install-1.png" alt="" />
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
                        <InputMask mask="+7 (999) 999-99-999" type="text" name="phone" required />
                        <span>Телефон</span>
                      </label>
                      <label className="input__check license">
                        <input type="checkbox" data-valid="check" className="input__required" />
                        <span></span>
                        <p>Я даю свое согласие на обработку персональных данных</p>
                      </label>
                      <input type="hidden" name="_csrf" value={this.state.csrf} />
                      <div className="install__btn">
                        <button className="btn-1 btn--blue" 
                          aria-label="Отправить заявку"
                          type="submit"
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
                <div className="gibdd__bcg bcg--1" />
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
                        {/* <input type="text" name="phone" required /> */}
                        <InputMask mask="+7 (999) 999-99-999" type="text" name="phone" required />
                        <span>Телефон</span>
                      </label>
                      <label className="input__check license">
                        <input type="checkbox" data-valid="check" className="input__required" />
                        <span></span>
                        <p>Я даю свое согласие на обработку персональных данных</p>
                      </label>
                      <input type="hidden" name="_csrf" value={this.state.csrf} />
                      <div className="gibdd__btn">
                        <button className="btn-1 btn--blue" 
                          aria-label="Отправить заявку"
                          type="submit"
                        >Отправить</button>
                      </div>
                    </form>
                  </div>
                  <div className="gibdd__img">
                    <img src="img/gibdd-1.png" alt="Регистрация в ГИБДД" />
                  </div>
                </div>
                <div className="gibdd__caption__container">
                  <h2 className="gibdd__caption">Регистрация в ГИБДД<span></span></h2>
                  <div className="gibdd__caption__bcg"></div>
                </div>
              </div>
            </section>

            <section className="review">
              <div className="container">
                <div className="caption__container">
                  <h2 className="caption__section">Отзывы</h2>
                </div>
              </div>
            </section>

            <section className="map">
              <div className="map__body">
                <div className="container">
                  <div className="map__label">
                    <div className="map__label__phone">
                      <a 
                        href={'tel:' + this.state.activeCity.phone.link}
                      >{this.state.activeCity.phone.kod}<strong>{this.state.activeCity.phone.number}</strong></a>
                    </div>
                    <div className="map__label__address">
                      <strong>г. {this.state.activeCity.name},</strong> 
                      {
                        this.state.activeCity.addresses.map((a, idx) => {
                          return (<p key={idx}>{a}</p>);
                        })
                      }
                    </div>
                    <div className="map__label__social">
                      <a className="map__icon map--vk" 
                        href={this.state.activeCity.social.vk} target="_blank">
                        <svg>
                          <use xlinkHref="img/sprite-icon.svg#icon-vk"/>
                        </svg>VK</a>
                      <a className="map__icon map--inst" 
                        href={this.state.activeCity.social.instagram} target="_blank">
                        <svg>
                          <use xlinkHref="img/sprite-icon.svg#icon-inst" />
                        </svg>Instagram</a>
                    </div>
                  </div>
                </div>
                <div className="map__container" id="map"></div>
              </div>
            </section>

            <Footer 
              activeCity={this.state.activeCity}          
            />

            <ModalRecord 
              data={this.state.modalRecord}
              close={this.closeModalRecord.bind(this)}
              csrf={csrf}
            />

            <button className="btn-menu">
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

ReactDOM.render(<Main/>, document.getElementById('page-main'));

