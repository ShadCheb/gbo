import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header';
import Nav from './components/Nav';
import Benefit from './components/Benefit';
import Question from './components/Question';
import Price from './components/Price';
import ModalRecord from './components/ModalRecord';



class Main extends Component {
  state = {
    benefit: {
      consumption: 10,
      mileage: 30,
      petrolList: ['ai92', 'ai95'],
      petrol: null
    },

    activeCity: {
      id: 0,
      name: 'Чебоксары',
      addresses: ['ул. Лесная, д.3 (Лакреевский лес)'],
      social: {
        vk: 'vklink',
        instagram: 'instagramlink',
        youtube: ''
      },
      time: 'с 09:00 до 18:00',
      phone: {
        kod: '+7(8352)',
        number: '70-91-44',
        link: '+78352709144'
      },
    },
    cityList: [
      {
        id: 0,
        name: 'Чебоксары',
        addresses: ['ул. Лесная, д.3 (Лакреевский лес)'],
      },
      {
        id: 1,
        name: 'Казань',
        addresses: ['ул. Лесная, д.3 (Лакреевский лес)']
      },
      {
        id: 2,
        name: 'Йошкар-ола',
        addresses: ['ул. Лесная, д.3 (Лакреевский лес)']
      },
      {
        id: 3,
        name: 'Нижний Новгорд',
        addresses: ['ул. Лесная, д.3 (Лакреевский лес)']
      }
    ],

    modalRecord: {
      visible: false,
      title: 'Форма'
    }
  };

  componentWillMount = () => {
    let benefit = this.state.benefit;

    benefit.petrol = this.state.benefit.petrolList[0];
    this.setState({benefit});
  }

  changeDatabenefit = (data) => {
    let benefit = this.state.benefit;

    for(let key in data) {
      benefit[key] = data[key];
    }
    this.setState({benefit});
  }

  // Меняем город в шапке
  handleChange(value) {
    console.log('Перезагрузка страницы на новый город');
  }

  openModalRecord(e) {
    let target = e.target;
    let title = target.closest('button').textContent;
    let modalRecord = {
      visible: true,
      title
    };

    this.setState({modalRecord});
  }

  closeModalRecord() {
    let modalRecord = {
      visible: false,
      title: 'Форма'
    };

    this.setState({modalRecord});
  }


  render() {
    return (
      <div>
        <main class="main" id="main">
          <div class="main__bcg-1" />
          <div class="main__bcg-2" />
          <div class="container">
            
            <Header 
              city={this.state.cityList}
              activeCity={this.state.activeCity}
              handleChange={this.handleChange}
            />

            <Nav />

            <div class="main__body">
              <p class="main__bcg">Gazoved</p>
              <div class="main__text">
                <h1 class="main__caption">
                  <span class="main__caption--first">Установка</span>
                  <span class="main__caption--last">и регистрация ГБО</span>
                </h1>
                <div>
                  <h2 class="main__caption-under">в Чебоксарах<span></span></h2>
                </div>  
                <div class="main__btn">
                  <button class="btn-1" 
                    aria-label="Узнать цену"
                    onClick={this.openModalRecord.bind(this)}>Узнать цену</button>
                </div>
              </div>
              <div class="main__img">
                <img src="img/main-1.png" alt="" />
              </div>
            </div>
          </div>
        </main>

        <Benefit 
          data={this.state.benefit}
          changeData={this.changeDatabenefit}
          openModal={this.openModalRecord.bind(this)}
        />

        <section class="advantages">
          <div class="container">
            <div class="advantages__body">
              <div class="advantages__img">
                <div class="advantages__bcg">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <img src="img/advantages-1.png" alt="" />
              </div>
              <div class="advantages__list">
                <div class="advantages__item">
                  <div class="advantages__item__img adv-item--plan"></div>
                  <div class="advantages__item__text">
                    <h2 class="caption__h2">Рассрочка без переплат</h2>
                    <p>Установка газового оборудования в рассрочку 
                      до 12 месяцев под 0 % годовых</p>
                  </div>
                </div>
                <div class="advantages__item">
                  <div class="advantages__item__img adv-item--bonus"></div>
                  <div class="advantages__item__text">
                    <h2 class="caption__h2">Бонусные карты</h2>
                    <p>Бонусные карты предоставляются для АЗС наших партнеров. Скидки до 
                      5 % на газовое топливо</p>
                  </div>
                </div>
                <div class="advantages__item">
                  <div class="advantages__item__img adv-item--reg"></div>
                  <div class="advantages__item__text">
                    <h2 class="caption__h2">Регистрация</h2>
                    <p>Полный пакет документов в ГИБДД за 3 000 руб</p>
                  </div>
                </div>
                <div class="advantages__item">
                  <div class="advantages__item__img adv-item--warranty"></div>
                  <div class="advantages__item__text">
                    <h2 class="caption__h2">Гарантия</h2>
                    <p>Гарантия на оборудование от 1 года до 5 лет в зависимости 
                      от выбранного вами комплекта</p>
                  </div>
                </div>
                <div class="advantages__item">
                  <div class="advantages__item__img adv-item--install"></div>
                  <div class="advantages__item__text">
                    <h2 class="caption__h2">Быстрая установка</h2>
                    <p>Надежная установка ГБО за 1 день в день обращения</p>
                  </div>
                </div>
                <div class="advantages__item">
                  <div class="advantages__item__img adv-item--program"></div>
                  <div class="advantages__item__text">
                    <h2 class="caption__h2">Бонусные программы</h2>
                    <p>Даем вам возможность заработать вместе с нами. Подробнее у наших 
                      менеджеров</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="installment">
          <div class="container">
            <div class="installment__bcg bcg--2"></div>
            <div class="installment__body">
              <div class="installment__header">
                <h2 class="installment__caption">Вы можете установить <strong>ГБО в рассрочку</strong></h2>
                <div class="installment__label">
                  <p>до <strong>12</strong> месяцев</p>
                  <p>под <strong>0 %</strong> годовых</p>
                </div>
              </div>
              <ul class="installment__list">
                <li>Рассрочка от компании: 50 % первоначальный взнос, 
                  оставшаяся сумма в течении 2 месяцев равными долями.</li>
                <li>Рассрочка от банка: до 12 месяцев, без первоначального 
                  взноса, без переплат. В обоих случаях нужен только паспорт</li>
              </ul>
              <div class="installment__btn">
                <button class="btn-1" 
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

        <section class="certificates">
          <div class="container">
            <div class="caption__container">
              <h2 class="caption__section">Сертификаты</h2>
            </div>
            <div class="certificates__body">
              <div class="certificates__bcg bcg--2" />
              <div class="certificates__text">
                <h2 class="caption__h2">Сертифицированные мастера</h2>
                <p class="text__p">	Более 1 000 установленных систем ГБО на автомобили 
                  в регионах: Чебоксары, Йошкар-Ола и Казань. Наши мастера прошли обучении 
                  в учебных центрах Digitronic, OMVL и в компании «мир газа». Обратитесь 
                  к нам, даже если у вас автомобиль редкой марки – в компании работают 
                  мастера с опытом от 5 лет, прошедшие курсы повешения квалификации!
                </p>
                <div class="certificates__btn">
                  <button class="btn-1 btn--blue">Просмотреть</button>
                </div>
              </div>
              <div class="certificates__img certificates__bcg--1">
                <img src="img/certificates-1.png" alt="Сертифицированные мастера" />
              </div>
            </div>
            <div class="certificates__body">
              <div class="certificates__img certificates__bcg--2">
                <img src="img/certificates-2.png" alt="Сертифицированный сервис" />
              </div>
              <div class="certificates__text">
                <h2 class="caption__h2">Сертифицированный сервис</h2>
                <p class="text__p">У нас сертифицированная станция по установке ГБО. Все 
                  документы, все экспертизы на газовое оборудование вы получаете в одном 
                  месте, у нас в автосервисе.
                </p>
                <p class="text__p">Наш центр установки ГБО - аккредитованный партнер 
                  "ГАЗПРОМ-газомоторное топливо" У нас вы можете официально установить газобаллонное 
                  оборудование пропан и метан, на легковые и грузовые автомобили и на разные типы 
                  двигателя и системы впрыска (на дизель, инжектор, моновпрыск, непосредственный 
                  прямой впрыск, распределенный впрыск, двигатели tsi, fsi и др.).
                </p>
                <p class="text__p">GAZOVED - официальный дилер ГБО BRC (БРС), LOVATO (ЛОВАТО), 
                  ZAVOLI (ЗАВОЛИ), DIGITRONIC (ДИДЖИТРОНИК), OMVL (ОМВЛ) в Чебоксарах, Йошкар-Оле 
                  и Казани. Посмотрите сертификаты и ознакомьтесь с отзывами тех, кто поставил газ 
                  в машину у нас.
                </p>
                <div class="certificates__btn">
                  <button class="btn-1 btn--blue">Просмотреть</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="staff">
          <div class="staff__bcg-1" />
          <div class="container">
            <div class="staff__bcg-2 bcg--2" />
            <div class="caption__container">
              <div class="staff__caption">
                <h2 class="caption__section">Наша <strong>команда</strong></h2>
                <h3 class="caption__section-under">ведущие эксперты по газовому оборудованию</h3>
              </div>
            </div>
            <div class="staff__body">
              <div class="staff__block">
                <div class="staff__img">
                  <img src="img/staff/staff-1.jpg" alt="Иван Иванов" />
                </div>
                <div class="staff__label">
                  <p class="staff__label__name">Иван Иванов</p>
                  <p class="staff__label__post">мастер установки ГБО</p>
                  <p class="staff__label__exp">опыт 5 лет</p>
                </div>
              </div>
              <div class="staff__block">
                <div class="staff__img">
                  <img src="img/staff/staff-1.jpg" alt="Иван Иванов" />
                </div>
                <div class="staff__label">
                  <p class="staff__label__name">Иван Иванов</p>
                  <p class="staff__label__post">мастер установки ГБО</p>
                  <p class="staff__label__exp">опыт 5 лет</p>
                </div>
              </div>
              <div class="staff__block">
                <div class="staff__img">
                  <img src="img/staff/staff-1.jpg" alt="Иван Иванов" />
                </div>
                <div class="staff__label">
                  <p class="staff__label__name">Иван Иванов</p>
                  <p class="staff__label__post">мастер установки ГБО</p>
                  <p class="staff__label__exp">опыт 5 лет</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Вопросы */}
        <Question/>

        <section class="registration">
          <div class="container">
            <div class="caption__container">
              <h2 class="caption__section"><strong>Регистрация</strong> ГБО</h2>
            </div>
            <div class="registration__body">
              <div class="registration__col">
                <article class="registration__block">
                  <div class="registration__block__num">1</div>
                  <h2 class="caption__h2">Заключаем договор</h2>
                  <p>Вы предоставляете документы на транспортное средство и собственника.</p>
                  <p>Физ. лица:</p>
                  <ul class="text__ul">
                    <li>свидетельство о регистрации ТС</li>
                    <li>паспорт транспортного средства (ПТС)</li>
                    <li>паспорт гражданина РФ</li>
                  </ul>
                  <p>Юр. лица:</p>
                  <ul class="text__ul">
                    <li>свидетельство о регистрации ТС</li>
                    <li>паспорт транспортного средства (ПТС)</li>
                    <li>копия свидетельства ОГРН</li>
                    <li>паспортные данные доверенного лица</li>
                  </ul>
                </article>
                <div class="registration__img">
                  <div class="registration__bcg">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <img src="img/registration-1.png" alt="" />
                </div>
              </div>
              <div class="registration__col">
                <article class="registration__block">
                  <div class="registration__block__num">2</div>
                  <h2 class="caption__h2">Подготовка</h2>
                  <p>Оформление предварительной экспертизы</p>
                </article>
                <article class="registration__block">
                  <div class="registration__block__num">3</div>
                  <h2 class="caption__h2">Заявление в ГИБДД</h2>
                  <p>Получение разрешения в ГИБДД на внесение изменений в конструкцию ТС</p>
                </article>
                <article class="registration__block">
                  <div class="registration__block__num">4</div>
                  <h2 class="caption__h2">Оформление</h2>
                  <p>Подготовка документов на оборудование и проведенные работы</p>
                </article>
                <article class="registration__block">
                  <div class="registration__block__num">5</div>
                  <h2 class="caption__h2">Экспертиза</h2>
                  <p>Прохождение ТО, подача документов в ГИБДД</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section class="install">
          <div class="container">
            <div class="install__bcg bcg--2" />
            <div class="install__body">
              <div class="install__img">
                <img src="img/install-1.png" alt="" />
              </div>
              <div class="install__form">
                <p class="install__p">Отправь заявку и Наш специалист 
                  свяжется с Вами для установки ГБО</p>
                <form calss="form">
                  <label class="form__input">
                    <input type="text" name="name" required />
                    <span>Имя</span>
                  </label>
                  <label class="form__input">
                    <input type="text" name="phone" required />
                    <span>Телефон</span>
                  </label>
                  <label class="input__check license">
                    <input type="checkbox" data-valid="check" class="input__required" />
                    <span></span>
                    <p>Я даю свое согласие на обработку персональных данных</p>
                  </label>
                  <div class="install__btn">
                    <button class="btn-1 btn--blue" 
                      aria-label="Отправить заявку"
                      type="submit"
                    >Отправить</button>
                  </div>
                </form>
              </div>
            </div>
            <div class="install__caption__container">
              <h2 class="install__caption">Установка ГБО<span></span><span></span></h2>
              <div class="install__caption__bcg"></div>
            </div>
          </div>
        </section>

        <section class="gibdd">
          <div class="container">
            <div class="gibdd__bcg bcg--1" />
            <div class="gibdd__body">
              <div class="gibdd__form">
                <p class="gibdd__p">Отправь заявку и Наш специалист 
                  свяжется с Вами для регистрации в ГИБДД</p>
                <form calss="form">
                  <label class="form__input">
                    <input type="text" name="name" required />
                    <span>Имя</span>
                  </label>
                  <label class="form__input">
                    <input type="text" name="phone" required />
                    <span>Телефон</span>
                  </label>
                  <label class="input__check license">
                    <input type="checkbox" data-valid="check" class="input__required" />
                    <span></span>
                    <p>Я даю свое согласие на обработку персональных данных</p>
                  </label>
                  <div class="gibdd__btn">
                    <button class="btn-1 btn--blue" 
                      aria-label="Отправить заявку"
                      type="submit"
                    >Отправить</button>
                  </div>
                </form>
              </div>
              <div class="gibdd__img">
                <img src="img/gibdd-1.png" alt="Регистрация в ГИБДД" />
              </div>
            </div>
            <div class="gibdd__caption__container">
              <h2 class="gibdd__caption">Регистрация в ГИБДД<span></span></h2>
              <div class="gibdd__caption__bcg"></div>
            </div>
          </div>
        </section>

        <section class="review">
          <div class="container">
            <div class="caption__container">
              <h2 class="caption__section">Отзывы</h2>
            </div>
          </div>
        </section>

        <section class="map">
          <div class="map__body">
            {/* <!--Карта--> */}
            <div class="container">
              <div class="map__label">
                <div class="map__label__phone">
                  <a href="tel:+78352709144">+7(8352) <strong>70-91-44</strong></a>
                </div>
                <div class="map__label__address">
                  <strong>г. Чебоксары,</strong> ул. Лесная, д.3 (Лакреевский лес)
                </div>
                <div class="map__label__social">
                  <a class="map__icon map--vk" href="" target="_blank">
                    <svg>
                      <use xlinkHref="img/sprite-icon.svg#icon-vk"/>
                    </svg>VK</a>
                  <a class="map__icon map--inst" href="" target="_blank">
                    <svg>
                      <use xlinkHref="img/sprite-icon.svg#icon-inst" />
                    </svg>Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer class="footer">
          <div class="container">
            <div class="footer__body">
              <div class="footer__col">
                <div class="footer__logo">
                  <a href="" class="footer__logo__link">
                    <img src="img/logo-white.png" alt="Gazoved" />
                  </a>
                  <p class="footer__logo__text">Качественная и надежная установка ГБО с Газовед</p>
                </div>
                <div class="footer__contact">
                  <p><a href={'tel:' + this.state.activeCity.phone.link} class="footer__contact__phone">
                    {this.state.activeCity.phone.kod} <strong>{this.state.activeCity.phone.number}</strong></a></p>
                  <p class="footer__contact__address">г. {this.state.activeCity.name}, {this.state.activeCity.addresses.join('; ')}</p>
                </div>
              </div>
              <div class="footer__col foter__space">
                <div class="footer__pay">
                  <a href="" class="footer__pay__type"><img src="img/visa-mk-1.png" alt="Visa MasterCard" /></a>
                  <button class="btn-1 btn--white">Оплата онлайн</button>
                </div>
                <div class="footer__social">
                  <a class="footer__icon map--vk" href={this.state.activeCity.social.vk} target="_blank">
                    <svg>
                      <use xlinkHref="img/sprite-icon.svg#icon-vk" />
                    </svg>VK</a>
                  <a class="footer__icon map--inst" href={this.state.activeCity.social.instagram} target="_blank">
                    <svg>
                      <use xlinkHref="img/sprite-icon.svg#icon-inst" />
                    </svg>Instagram</a>
                </div>
              </div>
            </div>
            <div class="footer__copy">© Газовед | 2018</div>
          </div>
        </footer>

        {/* <section class="modal modal__call">
            <div class="modal__content">
                <div class="modal__header">
                  <h4 class="modal__caption">Организовать питание</h4>
                  <button class="modal__close"><span></span><span></span></button>
                </div>
                <p class="modal__p">Заплните форму и наш сотрудник свяжется с вами:</p>
                <form class="form modal__form">
                  <label class="form__input">
                    <input type="text" name="name" required />
                    <span>Имя</span>
                  </label>
                  <label class="form__input">
                    <input type="text" name="phone" required />
                    <span>Телефон</span>
                  </label>
                  <label class="input__check license">
                    <input type="checkbox" data-valid="check" class="input__required" />
                    <span></span>
                    <p>Я даю свое согласие на обработку персональных данных</p>
                  </label>
                  <div class="modal__btn">
                      <button class="btn-1">Отправить</button>
                  </div>
                </form>
            </div>
        </section> */}

        <ModalRecord 
          data={this.state.modalRecord}
          close={this.closeModalRecord.bind(this)}
        />

        <button class="btn-menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('page-main'));

