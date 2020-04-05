import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';

const container = document.getElementById('page-other');
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);

class Stock extends Component {
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
        
        <section className="stock">
          <div className="container">
            <div className="stock__bcg-1 bcg--1"></div>
            <div className="stock__bcg-2 bcg--2"></div>
            <div className="caption__container">
              <h2 className="caption__section">Акции</h2>
            </div>
            <div className="stock__body">
              <article className="stock__block">
                <div>
                  <div className="stock__block__img">
                    <img src="/img/stock/present.png" alt="Термопластиковая магистраль" />
                  </div>
                  <div className="stock__block__text">
                    <div>
                      <p className="stock__header">Акция</p>
                      <h2 className="stock__caption">При единовременной оплате 
                        <strong> термопластиковая магистраль в подарок</strong></h2>
                    </div>
                  </div>
                </div>
              </article>
              <article className="stock__block">
                <div>
                  <div className="stock__block__img">
                    <img src="/img/stock/label.png" alt="Наклейка Газовед" />
                  </div>
                  <div className="stock__block__text">
                    <div>
                      <p className="stock__header">Акция</p>
                      <h2 className="stock__caption">Наклей на заднее стекло наклейку "Газовед" и
                        <strong> проходи ТО со скидкой 50%</strong></h2>
                    </div>
                  </div>
                </div>
              </article>

              <article className="stock__block">
                <div>
                  <div className="stock__block__img">
                    <img src="/img/stock/money.png" alt="Приведи друга" />
                  </div>
                  <div className="stock__block__text">
                    <div>
                      <p className="stock__header">Акция</p>
                      <h2 className="stock__caption">Приведи друга и <strong>получи 500 рублей</strong>
                        <strong> или ТО в подарок</strong></h2>
                    </div>
                  </div>
                </div>
              </article>
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

ReactDOM.render(<Stock/>, container);
