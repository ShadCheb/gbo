import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';
import ModalRecord from '../main/components/ModalRecord';

import lozad from 'lozad';

const container = document.getElementById('page-service-item');
const csrf = container.dataset.csrf;
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);


class Variator extends Component {
  state = {
    cityList,
    infoCity,

    modalRecord: {
      visible: false,
      title: 'Форма'
    },

    showMenu: false, // открытие меню
  }

  componentDidMount = () => {
    const observer = lozad();

    observer.observe();
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
      page: 'Вариатор'
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
        
        <div className="s-header s-header--grey">
          <div className="container">
            <div className="s-header__body">
              <div className="s-header__text">
                <h1 className="s-caption-h1">
                  <span className="s-caption-h1--i1">Установка</span>Вариатора
                  { infoCity.city 
                    ? (<span className="s-caption-h1--i2">в {infoCity.city.name2 || 'городе'}</span>)
                    : ('')
                  }
                </h1>
                <ul className="s-header__list">
                  <li><strong>Уменьшение расхода</strong> газа во всех режимах</li>
                  <li><strong>Исключение</strong> появления <strong>бедной смеси</strong></li>
                  <li><strong>Корректное сгорание</strong> газо-воздушной смеси</li>
                </ul>
                <div className="s-header__btns">
                  <button className="btn-1 btn--white" 
                    data-type="Заказать установку вариатора" 
                    aria-label="Заказать установку"
                    onClick={this.openModalRecord.bind(this)}
                  >Заказать установку</button>
                </div>
              </div>
              <div className="s-header__img sm-header__img">
                <picture className="lozad" data-iesrc="/img/variator/engine-1.png" 
                  data-alt="Установка вариатора в Газовед">
                  <source media="(min-width: 576px)" srcSet="/img/variator/engine-1.png" />
                  <source media="(min-width: 300px)" srcSet="/img/variator/engine-1-m.png" />
                </picture>
              </div>
            </div>
          </div>
        </div>

        <section className="sr-services">
          <div className="container">
            <div className="sr-services__body">
              <div className="sr-services__text services__text--sv">
                <div>
                  <p className="text__p"><strong>Вариатор УОЗ (угла опережения зажигания)</strong> – 
                    электронный прибор, который <strong>регулирует момент поджигания 
                    топливной смеси.</strong></p>
                  <p className="text__p"><strong>Стандартный электронный блок управления 
                    в машине рассчитан на бензин</strong>, поэтому газовая смесь не успевает 
                    прогореть на 100%.</p>
                  <p className="text__p">Октан-контроллер нужен для того, чтобы <strong>подстроить 
                    угол зажигания под газовую смесь</strong> и дать команду на опережение 
                    электронному управляющему блоку автомобиля.</p>
                </div>
              </div>
              <div className="sr-services__img">
                <picture className="lozad" data-iesrc="/img/variator/variator-2.png" 
                  data-alt="Установка вариатора в Газовед">
                  <source media="(min-width: 576px)" srcSet="/img/variator/variator-2.png" />
                  <source media="(min-width: 300px)" srcSet="/img/variator/variator-2-m.png" />
                </picture>
              </div>
            </div>
            <div className="sv-description__bcg bcg--2"></div>
          </div>
        </section>

        <section className="sd-advantages">
          <div className="container">
            <div className="caption__container">
              <h2 className="caption__section benefit__caption">Зачем нужен <strong>вариатор?</strong></h2>
            </div>
            <div className="sm-advantages__body">
              <div className="sm-advantages__list">
                <div className="sm-advantages__item">
                  <div className="advantages__item__img lozad"
                    data-background-image-set="url('../img/icon-advantages/wallet.png')"
                  ></div>
                  <div className="advantages__item__text">
                    <h2 className="caption__h2">Экономия</h2>
                    <p> На автомобиле объемом 2 литра вариатор экономит 1 литр газа 
                      на каждые 100 км пробега.</p>
                  </div>
                </div>
                <div className="sm-advantages__item">
                  <div className="advantages__item__img lozad"
                    data-background-image-set="url('../img/icon-advantages/mobility.png')"
                  ></div>
                  <div className="advantages__item__text">
                    <h2 className="caption__h2">Легкий старт</h2>
                    <p>Педаль будет реагировать на малейшее прикосновение, машина будет 
                      стартовать быстрее.</p>
                  </div>
                </div>
                <div className="sm-advantages__item">
                  <div className="advantages__item__img lozad"
                    data-background-image-set="url('../img/icon-advantages/speed.png')"
                  ></div>
                  <div className="advantages__item__text">
                    <h2 className="caption__h2">Увеличение мощности</h2>
                    <p>Установка вариатора позволяет повысить мощность до 12%.</p>
                  </div>
                </div>
                <div className="sm-advantages__item">
                  <div className="advantages__item__img lozad"
                    data-background-image-set="url('../img/icon-advantages/calendar.png')"
                  ></div>
                  <div className="advantages__item__text">
                    <h2 className="caption__h2">Увеличение ресурса</h2>
                    <p> Практикой доказано, что ресурс работы двигателя увеличивается в разы.</p>
                  </div>
                </div>
              </div>
              <div className="sm-advantages__img sm-advantages__img--variator">
                <div className="advantages__bcg advantages__bcg--sm">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <picture className="lozad" data-iesrc="/img/variator/speedometer.png" 
                  data-alt="Преимущества установки вариатора в Газовед">
                  <source media="(min-width: 768px)" srcSet="/img/variator/speedometer.png" />
                  <source media="(min-width: 300px)" srcSet="/img/variator/speedometer-m.png" />
                </picture>
              </div>
            </div>
            <div className="sm-advantages__btn">
              <button className="btn-1 btn--blue" 
                data-type="Заказать установку вариатора" 
                aria-label="Заказать установку"
                onClick={this.openModalRecord.bind(this)}
              >Заказать установку</button>
            </div>
          </div>
        </section>

        <section className="sv-comparison">
          <div className="container">
            <div className="caption__container">
              <h2 className="caption__section benefit__caption">Особенности <strong>вариатора</strong></h2>
            </div>
            <div className="sd-conclusion__body conclusion__body--sv">
              <div className="sd-conclusion__text">
                <div>
                  <ul className="text__list">
                    <li><strong>Настраивается</strong> с помощью компьютерной программы</li>
                    <li>Позволяет <strong>смоделировать график движения</strong> транспортного 
                      средства и <strong>выставить угол опережения зажигания</strong> с 
                      точностью до градуса</li>
                    <li>Работает с коленвалом и распредвалом</li>
                    <li><strong>Встроен осциллограф</strong>, который подает 
                      устройству сигналы на входе и выходе</li>
                    <li>Трансформатор позволяет сделать <strong>взаимодействие с ЭБУ более 
                      слаженным</strong>. Особенно, на машинах с дифференциальным входом</li>
                  </ul>
                  <div className="sd-conclusion__btn">
                    <button className="btn-1" 
                      data-type="Заказать установку вариатора" 
                      aria-label="Заказать установку"
                      onClick={this.openModalRecord.bind(this)}
                    >Заказать установку</button>
                  </div>
                </div>
              </div>
              <div className="sd-conclusion__img conclusion__img--sv">
                <picture className="lozad" data-iesrc="/img/variator/variator-1.png" 
                  data-alt="Установка вариатора в Газовед">
                  <source media="(min-width: 768px)" srcSet="/img/variator/variator-1.png" />
                  <source media="(min-width: 300px)" srcSet="/img/variator/variator-1-m.png" />
                </picture>
              </div>
            </div>
            <div className="sv-description__bcg bcg--2"></div>
          </div>
        </section>

        <section className="sv-conclusion">
          <div className="container">
            <div className="sd-advantages__block sd-block--left">
              <div className="sd-advantages__block__img">
                <picture className="lozad" data-iesrc="/img/variator/car-niva.png" 
                  data-alt="Вариатор опережения зажигания">
                  <source media="(min-width: 768px)" srcSet="/img/variator/car-niva.png" />
                  <source media="(min-width: 300px)" srcSet="/img/variator/car-niva-m.png" />
                </picture>
              </div>
              <div className="sd-advantages__block__text sv-conclusion__block">
                <div>
                  <p className="text__p2"><strong>Вариатор опережения зажигания</strong> – не 
                    просто кусок пластика, начиненный электроникой. 
                    Это миниатюрное устройство <strong>помогает сделать работу 
                    газобаллонного оборудования</strong> и двигателя слаженной, 
                    как симфонический оркестр.</p>
                  <p className="text__p2">Если у вас 4 поколение ГБО, 
                    <strong>установка вариатора – выгодное решение</strong>. Узнайте о том, 
                    следует ли вам в вашем конкретном случае устанавливать 
                    вариатор, позвонив нашим менеджерам.</p>
                  <div className="sv-conclusion__btn">
                    <button className="btn-1 btn--blue" 
                      data-type="Заказать установку вариатора" 
                      aria-label="Заказать установку"
                      onClick={this.openModalRecord.bind(this)}
                    >Заказать установку</button>
                  </div>
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

ReactDOM.render(<Variator/>, document.getElementById('page-service-item'));
