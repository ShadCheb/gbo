import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';

const container = document.getElementById('page-other');
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);

class WorkItem extends Component {
  state = {
    cityList,
    infoCity,

    showMenu: false, // открытие меню
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
              showMenu={this.state.showMenu}
              social={infoCity.social}
              closeMenu={this.toggleMenu}
            />
          </div>
        </main>
        
        <section className="wi__header">
          <div className="container">
            <div className="wi__header__bcg bcg--1"></div>
            <div className="wi__header__body">
              <div className="wi__header__img">
                <div>
                  <img src="/images/solaris.jpg" />
                </div>
              </div>
              <div className="wi__header__text">Hyunday Solaris</div>
            </div>
          </div>
        </section>

        <section className="wi-description">
          <div className="container">
            <div className="wi-description__body">
              <div className="wi-description__text">
                <div>
                  <h2 className="wi-description__caption">Пробег 22&nbsp;000&nbsp;км
                    <strong> Экономия 41&nbsp;000&nbsp;рублей</strong>
                  </h2>
                  <div className="wi-description__install">
                    <p className="text__p2">Установлено газовое оборудование:</p>
                    <ul className="text__list">
                      <li>iQ</li>
                      <li>Газовый редуктор <b>Nordic</b></li>
                      <li>Форсунки <b>Dymco</b></li>
                      <li>Фирменные шланги</li>
                      <li>Термо-пластиковая трубка</li>
                      <li>Фильтр тонкой очистки</li>
                      <li>Тороидальный баллон на 54 литров вместо запасного колеса</li>
                      <li>ВЗУ выведено под бампер</li>
                    </ul>
                  </div>
                  <div className="wi-description__add">
                    <p className="text__p2">Дополнительно:</p>
                    <ul className="text__list">
                      <li>Газовая расходная магистраль проложена по штатной топливной магистрали</li>
                      <li>Все отверстия и крепёжные элементы обработаны антикором</li>
                    </ul>
                  </div>
                  <div className="wi-description__btn">
                    <button className="btn-1" aria-label="Заказать установку">Хочу также</button>
                  </div>
                </div>
              </div>
              <div className="wi-description__img">
                <div className="advantages__bcg"><span></span><span></span><span></span><span></span><span></span></div>
                <h2>Gazoved</h2>
              </div>
            </div>
            <div className="wi-description__gallery">
              <div className="wi-description__gallery__img"><img src="/images/solaris.jpg" /></div>
              <div className="wi-description__gallery__img"><img src="/images/solaris.jpg" /></div>
              <div className="wi-description__gallery__img"><img src="/images/solaris.jpg" /></div>
              <div className="wi-description__gallery__img"><img src="/images/solaris.jpg" /></div>
              <div className="wi-description__gallery__img"><img src="/images/solaris.jpg" /></div>
            </div>
          </div>
        </section>

        <Footer 
          activeCity={infoCity}
        />
      </div>
    );
  }
}

ReactDOM.render(<WorkItem/>, container);
