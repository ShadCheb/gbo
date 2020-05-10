import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Loader from '../main/components/Loader';
import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';
import ModalRecord from '../main/components/ModalRecord';

import { LightgalleryProvider, LightgalleryItem } from 'react-lightgallery';

import '../../public/style/lightgallery.min.css';
import '../../public/style/antd.css';
import '../../public/style/style.css';
import '../../public/style/work.css';

const container = document.getElementById('page-other');
const csrf = container.dataset.csrf;
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);


class WorkItem extends Component {
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

  // Открытие/закрытие меню
  toggleMenu = () => {
    this.setState(function(prevValue) {
      return ({showMenu: !prevValue.showMenu});
    });
  }

  separate = (value) => {
    return ('' + value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  };

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
              page="isWork"
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
                  <img src={'/images/' + (infoCity.avatar || 'not-car.jpg')} />
                </div>
              </div>
              <div className="wi__header__text">{ infoCity.nameWork || 'Без названия' }</div>
            </div>
          </div>
        </section>

        <section className="wi-description">
          <div className="container">
            <div className="wi-description__body">
              <div className="wi-description__text">
                <div>
                  <h2 className="wi-description__caption">
                    { (infoCity.mileage) ? ('Пробег ' + this.separate(infoCity.mileage) + ' км') : ('') }
                    { (infoCity.saving) 
                      ? (<strong> Экономия {this.separate(infoCity.saving)} рублей</strong>) 
                      : ('') }
                  </h2>
                  {
                    (infoCity.established && infoCity.established[0]) 
                    ? (<div className="wi-description__install">
                      <p className="text__p2">Установлено газовое оборудование:</p>
                      <ul className="text__list">
                        {
                          infoCity.established.map((item,idx) => (
                            <li key={ idx }>{ item }</li> || ('')
                          ))
                        }
                      </ul>
                    </div>)
                    : ('')
                  }
                  {
                    (infoCity.additionally && infoCity.additionally[0]) 
                    ? (<div className="wi-description__add">
                        <p className="text__p2">Дополнительно:</p>
                        <ul className="text__list">
                          {
                            infoCity.additionally.map((item,idx) => (
                              item && <li key={ idx }>{ item }</li> || ('')
                            ))
                          }
                        </ul>
                      </div>)
                    : ('')
                  }
                  <div className="wi-description__btn">
                    <button className="btn-1" 
                      aria-label="Заказать установку"
                      onClick={this.openModalRecord.bind(this)}
                    >Хочу также</button>
                  </div>
                </div>
              </div>
              <div className="wi-description__img">
                <div className="advantages__bcg"><span></span><span></span><span></span><span></span><span></span></div>
                <h2>Gazoved</h2>
              </div>
            </div>

            {
              (infoCity.description)
                ? (<div className="wi-description__description" 
                  dangerouslySetInnerHTML={{__html: infoCity.description}}
                />)
                : ('')
            }

            {
              (infoCity.gallery && infoCity.gallery.length)
              ? (<LightgalleryProvider>
                  <div className="wi-description__gallery">
                  { infoCity.gallery.map((image, idx) => (
                    <LightgalleryItem group="group" src={ '/images/' + image } key={ idx }>
                      <img src={ '/images/' + image } />
                    </LightgalleryItem>
                    ))
                  }
                  </div>
                </LightgalleryProvider>
                ) 
              : ('')
            }

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


ReactDOM.render(<WorkItem/>, container);
