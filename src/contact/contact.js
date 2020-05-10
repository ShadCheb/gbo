import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Loader from '../main/components/Loader';
import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';
import Map from '../main/components/Map';

import '../../public/style/antd.css';
import '../../public/style/map.css';
import '../../public/style/style.css';
import '../../public/style/contact.css';

const container = document.getElementById('page-other');
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);

class Contact extends Component {
  state = {
    cityList,
    infoCity,

    showMenu: false, // открытие меню
    loader: true,
  }

  componentDidMount = () => {
    window.ymaps && ymaps.ready(this.initMap);

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

  // Открытие/закрытие меню
  toggleMenu = () => {
    this.setState(function(prevValue) {
      return ({showMenu: !prevValue.showMenu});
    });
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

  render() {
    let {infoCity} = this.state;

    return (
      <div>
        {/* { this.state.loader && <Loader /> }  */}

        <main className="main-header">
          <div className="container">
            <Header 
              cityList={this.state.cityList}
              activeCity={infoCity}
              handleChange={this.handleChange}
            />
            <Nav 
              page="isContact"
              showMenu={this.state.showMenu}
              social={infoCity.social}
              closeMenu={this.toggleMenu}
            />
          </div>
        </main>
        
        <section className="contact">
          <div className="container">
            <div className="contact__bcg bcg--1"></div>
            <div className="caption__container">
              <h2 className="caption__section">Контакты</h2>
            </div>
            <div className="contact__body">
              <div className="contact__body__text">
                <div>
                  <h2 className="contact__caption">Реквизиты</h2>
                  <div className="contact__row">
                    <p className="contact__row__caption">Наименование</p>
                    <p className="contact__row__value">ИП Александров Константин Владиславович</p>
                  </div>
                  <div className="contact__row">
                    <p className="contact__row__caption">ИНН</p>
                    <p className="contact__row__value">212401158287</p>
                  </div>
                  <div className="contact__row">
                    <p className="contact__row__caption">Счёт</p>
                    <p className="contact__row__value">40802810602500021543</p>
                  </div>
                  <div className="contact__row">
                    <p className="contact__row__caption">Банк получателя</p>
                    <p className="contact__row__value">Точка ПАО Банка "Открытие"</p>
                  </div>
                  <div className="contact__row">
                    <p className="contact__row__caption">Город</p>
                    <p className="contact__row__value">Москва</p>
                  </div>
                  <div className="contact__row">
                    <p className="contact__row__caption">БИК</p>
                    <p className="contact__row__value">044525999</p>
                  </div>
                  <div className="contact__row">
                    <p className="contact__row__caption">Корр. счёт</p>
                    <p className="contact__row__value">30101810845250000999</p>
                  </div>
                </div>
              </div>
              <div className="contact__body__img">
                <img src="/img/contact-logo.png" alt="Автомобильные газовые системы" />
              </div>
            </div>
          </div>
        </section>

        <Map 
          activeCity={infoCity}
          selectCityToMap={this.selectCityToMap}
        />

        <Footer 
          activeCity={infoCity}
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

ReactDOM.render(<Contact/>, container);
