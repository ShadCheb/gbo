import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Loader from '../main/components/Loader';
import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';
import ModalRecord from '../main/components/ModalRecord';

import lozad from 'lozad';

import '../../public/style/antd.css';
import '../../public/style/style.css';
import '../../public/style/service.css';

const container = document.getElementById('page-service-item');
const csrf = container.dataset.csrf;
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);

class Register extends Component {
  state = {
    cityList,
    infoCity,

    modalRecord: {
      visible: false,
      title: 'Форма'
    },

    showMenu: false, // открытие меню
    loader: true
  }

  componentDidMount = () => {
    const observer = lozad();

    observer.observe();
    window.onload = () => {
      this.setState({loader: false});
    }
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
      target,
      visible: true,
      title,
      page: 'Регистрация в ГИБДД'
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

  // Открытие/закрытие меню
  toggleMenu = () => {
    this.setState(function(prevValue) {
      return ({showMenu: !prevValue.showMenu});
    });
  }

  render() {
    let {infoCity} = this.state;

    return (
      <div>
        { this.state.loader && <Loader /> } 

        <main className="main-header">
          <div className="container">
            <Header 
              cityList={this.state.cityList}
              activeCity={infoCity}
              handleChange={this.handleChange}
            />
            <Nav 
              page="isServices"
              showMenu={this.state.showMenu}
              social={infoCity.social}
              closeMenu={this.toggleMenu}
            />
          </div>
        </main>
        
        <div className="s-header s-header--red">
          <div className="container">
            <div className="s-header__body">
              <div className="s-header__text">
                <h1 className="s-caption-h1">
                  Регистрация ГБО 
                  
                  { infoCity.city 
                    ? (<span className="s-caption-h1--i2">в {infoCity.city.name2 || 'городе'}</span>)
                    : ('')
                  }
                </h1>
                <ul className="s-header__list">
                  <li><strong>Установка ГБО</strong> является внесением изменений в конструкцию 
                    транспортного средства и <strong>требует согласования 
                    в ГИБДД </strong></li>
                </ul>
                <div className="s-header__btns">
                  <button className="btn-1 btn--white" 
                    data-type="Заказать услугу регистрация в ГИБДД" 
                    aria-label="Заказать услугу"
                    onClick={this.openModalRecord.bind(this)}
                  >Заказать услугу</button>
                </div>
              </div>
              <div className="s-header__img sd-header__img">
                <picture className="lozad" data-iesrc="/img/gibdd-1.png" 
                  data-alt="Регистрация ГБО в Газовед">
                  <source media="(min-width: 768px)" srcSet="/img/gibdd-1.png" />
                  <source media="(min-width: 300px)" srcSet="/img/gibdd-1-m.png" />
                </picture>
              </div>
            </div>
          </div>
        </div>

        <section className="sr-services">
          <div className="container">
            <div className="sr-services__body">
              <div className="sr-services__text">
                <div>
                  <ul className="text__list">
                    <li>Подготовка всех необходимых документов и проведение технической экспертизы</li>
                    <li>Сопровождение на всех этапах регистрации ГБО</li>
                    <li>Длительный опыт работы с органами технадзора</li>
                    <li>Гарантия регистрации</li>
                  </ul>
                </div>
              </div>
              <div className="sr-services__img">
                <picture  className="lozad" data-iesrc="/img/registration/registration-1.png" 
                  data-alt="Регистрация ГБО в Газовед">
                  <source media="(min-width: 768px)" srcSet="/img/registration/registration-1.png" />
                  <source media="(min-width: 576px)" srcSet="/img/registration/registration-1-p.png" />
                  <source media="(min-width: 300px)" srcSet="/img/registration/registration-1-m.png" />
                </picture>
              </div>
            </div>
            <div className="sd-description__bcg bcg--2"></div>
          </div>
        </section>

        <section className="sr-causes">
          <div className="container">
            <div className="caption__container sr-causes__caption">
              <h2 className="caption__section">Для чего нужна <strong>регистрация</strong></h2>
            </div>
            <div className="sr-causes__body">
              <div className="sr-causes__img">
                <picture className="lozad" data-iesrc="/img/registration/causes-1.jpg" 
                  data-alt="Для чего нужна регистрация ГБО">
                  <source media="(min-width: 768px)" srcSet="/img/registration/causes-1.jpg" />
                  <source media="(min-width: 300px)" srcSet="/img/registration/causes-1-m.jpg" />
                </picture>
              </div>
              <div className="sr-causes__text">
                <div className="sr-causes__block">
                  <p className="text__p">В соответствии с действующим законодательством - 
                  с 01.01.2015 года - каждый владелец автомобиля, на который 
                  устанавливается газобаллонное оборудование, должен в течение 10 суток 
                  выполнить такую процедуру, как <strong>регистрация ГБО в ГИБДД.</strong></p>
                </div>
                <div className="sr-causes__block">
                  <p className="text__p">Объясняется это тем, что установка ГБО представляет 
                  собой непосредственное <strong>изменение конструкции</strong> транспортного 
                  средства.</p>
                </div>
                <div className="sr-causes__block">
                  <p className="text__p">Следует учесть, что перед установкой ГБО сначала 
                  необходимо получить <strong>одобрение в испытательной лаборатории и 
                  Госавтоинспекции</strong>, только после этого разрешается осуществлять 
                  монтаж и оформление ГБО на авто, которое будет использовать 
                  газ в качестве альтернативного топлива.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sd-advantages">
          <div className="container">
            <div className="caption__container">
              <h2 className="caption__section">Преимущества </h2>
            </div>
            <div className="sm-advantages__body">
              <div className="sm-advantages__list">
                <div className="sm-advantages__item">
                  {/* adv-item--place */}
                  <div className="advantages__item__img lozad"
                    data-background-image-set="url('../img/icon-advantages/map.png')"
                  ></div>
                  <div className="advantages__item__text">
                    <h2 className="caption__h2">Все в одном месте</h2>
                    <p>Все необходимые документы для регистрации газового 
                      оборудования предоставляются нашим филиалом, исключая 
                      посещения разных инстанций.</p>
                  </div>
                </div>
                <div className="sm-advantages__item">
                {/* adv-item--turn */}
                  <div className="advantages__item__img lozad"
                    data-background-image-set="url('../img/icon-advantages/community.png')"
                  ></div>
                  <div className="advantages__item__text">
                    <h2 className="caption__h2">Без очередей</h2>
                    <p>Все необходимые документы для регистрации газового 
                      оборудования предоставляются нашим филиалом, исключая 
                      посещения разных инстанций.</p>
                  </div>
                </div>
                <div className="sm-advantages__item">
                {/* adv-item--fast */}
                  <div className="advantages__item__img lozad"
                    data-background-image-set="url('../img/icon-advantages/clock.png')"
                  ></div>
                  <div className="advantages__item__text">
                    <h2 className="caption__h2">Документы за 20 минут</h2>
                    <p>Подготовка комплекта документов на ГБО в офисе занимает 
                      порядка 20 минут по трем документам (ПТС, СТС, Паспорт 
                      собственника ТС).</p>
                  </div>
                </div>
              </div>
              <div className="sm-advantages__img sm-advantages__img--register">
                <div className="advantages__bcg advantages__bcg--sm">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <picture className="lozad" data-iesrc="/img/registration/girl-gibdd.png" 
                  data-alt="Преимущества регистрации ГБО в Gazoved">
                  <source media="(min-width: 768px)" srcSet="/img/registration/girl-gibdd.png" />
                  <source media="(min-width: 300px)" srcSet="/img/registration/girl-gibdd-m.png" />
                </picture>
              </div>
            </div>
            <div className="sm-advantages__btn">
              <button className="btn-1 btn--blue" 
                data-type="Заказать услугу регистрация в ГИБДД" 
                aria-label="Заказать услугу"
                onClick={this.openModalRecord.bind(this)}
              >Заказать услугу</button>
            </div>
          </div>
        </section>

        <section className="sr-sequence">
          <div className="container">
            <div className="caption__container">
              <h2 className="caption__section benefit__caption">Процесс  
                <strong>регистрации</strong></h2>
            </div>
            <div className="sr-sequence__body">
              <article className="registration__block sr-sequence__block">
                <div className="registration__block__num">1</div>
                <p className="text__p">Обратиться в аккредитованную испытательную 
                лабораторию с соответствующим заявлением и оформить 
                <strong> “Заключение предварительной технической экспертизы”</strong></p>
                {/* adv-item--building */}
                <div className="sr-sequence__block__icon lozad"
                  data-background-image-set="url('../img/icon-advantages/building.png')"
                ></div>
              </article>
              <article className="registration__block sr-sequence__block">
                <div className="registration__block__num">2</div>
                <p className="text__p">Обратиться в органы ГИБДД с Заявлением о возможности 
                внесения изменений в конструкцию транспортного средства.</p>
                <ul className="text__ul">
                  <li><a href="#0" className="text__a">Образец Заявления в ГИБДД (ГАИ)</a></li>
                </ul>
                {/* adv-item--gibdd */}
                <div className="sr-sequence__block__icon lozad"
                  data-background-image-set="url('../img/icon-advantages/police-station.png')"
                ></div>
              </article>
              <article className="registration__block sr-sequence__block">
                <div className="registration__block__num">3</div>
                <p className="text__p">Установить газобаллонное оборудование в 
                нашем сервисном пункте по переоборудованию. После монтажа мы 
                выдадим Вам полный пакет документов на установленное 
                оборудование.</p>
                <p>Примеры документов:</p>
                <ul className="text__ul">
                  <li><a href="#0" className="text__a">Форма 2а и 2б</a></li>
                  <li><a href="#0" className="text__a">Протокол экспертизы безопасности ТС</a></li>
                </ul>
                {/* adv-item--service */}
                <div className="sr-sequence__block__icon lozad"
                  data-background-image-set="url('../img/icon-advantages/car-service.png')"
                ></div>
              </article>
              <article className="registration__block sr-sequence__block">
                <div className="registration__block__num">4</div>
                <p className="text__p">Получить в аккредитованной испытательной 
                лаборатории <strong>Протокол технической экспертизы конструкции 
                ТС после внесенных изменений.</strong></p>
                {/* adv-item--docs */}
                <div className="sr-sequence__block__icon lozad"
                  data-background-image-set="url('../img/icon-advantages/set-docs.png')"
                ></div>
              </article>
              <article className="registration__block sr-sequence__block">
                <div className="registration__block__num">5</div>
                <p>Обратиться в территориальное подразделение ГИБДД для 
                  регистрации внесенных изменений</p>
                  {/* adv-item--gibdd */}
                <div className="sr-sequence__block__icon lozad"
                  data-background-image-set="url('../img/icon-advantages/police-station.png')"
                ></div>
              </article>
              <article className="registration__block sr-sequence__block">
                <div className="registration__block__num">6</div>
                <ul className="text__ul2">
                  <li>Отметка в ПТС</li>
                  <li>Свидетельство о соответствии ТС с внесенным в его конструкцию 
                    изменениями требованиям безопасности</li>
                </ul>
                {/* adv-item--reg */}
                <div className="sr-sequence__block__icon lozad"
                  data-background-image-set="url('../img/icon-advantages/terms-and-conditions.png')"
                ></div>
              </article>
            </div>
          </div>
        </section>

        <section className="sr-question">
          <div className="container">
            <div className="sr-question__bcg2"></div>
            <div className="sr-question__bcg3"></div>
          </div>
          <div className="sr-question__mask">
            <div className="sr-question__bcg1"></div>
            <div className="container">
              <div className="sr-question__body">
                <div className="sr-question__text">
                  <div className="caption2__container">
                    <h2 className="caption2__caption"><strong>Остались вопросы?</strong> 
                      задай нашему специалисту</h2>
                  </div>
                  <p className="text__p2">Проведем консультацию по телефону</p>
                  <div className="sr-question__btn">
                    <button className="btn-1 btn--blue" 
                      data-type="Задать вопрос про регистрацию в ГИБДД" 
                      aria-label="Задать вопрос"
                      onClick={this.openModalRecord.bind(this)}
                    >Задать вопрос</button>
                  </div>
                </div>
                <div className="sr-question__img">
                  <picture className="lozad" data-iesrc="/img/registration/phone-012.png" 
                    data-alt="Задать вопрос у Газовед">
                    <source media="(min-width: 768px)" srcSet="/img/registration/phone-012.png" />
                    <source media="(min-width: 300px)" srcSet="/img/registration/phone-012-m.png" />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </section>

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
  }
}

ReactDOM.render(<Register/>, document.getElementById('page-service-item'));
