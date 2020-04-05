import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';

const container = document.getElementById('page-other');
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);

class Work extends Component {
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
        
        <section className="job">
          <div className="container">
            <div className="job__bcg-1 bcg--1"></div>
            <div className="job__bcg-2 bcg--2"></div>
            <div className="caption__container">
              <h2 className="caption__section ">Наши работы</h2>
            </div>
            <div className="job__body">
              <article className="job__item">
                <div className="job__item__img">
                  <div className="job__img__label">Подробнее</div>
                  <img src="/img/not-car.jpg" alt="Hyundai solaris" />
                </div>
                <div className="job__item__body">
                  <h2>Hyundai solaris</h2>
                </div>
                <a className="link__block" href="/work/1"></a>
              </article>
              <article className="job__item">
                <div className="job__item__img">
                  <div className="job__img__label">Подробнее</div>
                  <img src="/img/not-car.jpg" alt="Hyundai solaris" />
                </div>
                <div className="job__item__body">
                  <h2>Hyundai solaris</h2>
                </div>
                <a className="link__block" href="/work/1"></a>
              </article>
              <article className="job__item">
                <div className="job__item__img">
                  <div className="job__img__label">Подробнее</div>
                  <img src="/img/not-car.jpg" alt="Hyundai solaris" />
                </div>
                <div className="job__item__body">
                  <h2>Hyundai solaris</h2>
                </div>
                <a className="link__block" href="/work/1"></a>
              </article>
              <article className="job__item">
                <div className="job__item__img">
                  <div className="job__img__label">Подробнее</div>
                  <img src="/img/not-car.jpg" alt="Hyundai solaris" />
                </div>
                <div className="job__item__body">
                  <h2>Hyundai solaris</h2>
                </div>
                <a className="link__block" href="/work/1"></a>
              </article>
              <article className="job__item">
                <div className="job__item__img">
                  <div className="job__img__label">Подробнее</div>
                  <img src="/img/not-car.jpg" alt="Hyundai solaris" />
                </div>
                <div className="job__item__body">
                  <h2>Hyundai solaris</h2>
                </div>
                <a className="link__block" href="/work/1"></a>
              </article>
            </div>
            <div className="job__navigation">
              <a href="#0" className="nav__arrow nav--right">
                <svg>
                  <use xlinkHref="img/sprite-icon.svg#icon-back"/>
                </svg>
              </a>
              <a href="#0">2</a>
              <a href="#0">3</a>
              <a href="#0">4</a>
              <a href="#0" className="nav__arrow nav--right">
                <svg>
                  <use xlinkHref="img/sprite-icon.svg#icon-next"/>
                </svg>
              </a>
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

ReactDOM.render(<Work/>, container);
