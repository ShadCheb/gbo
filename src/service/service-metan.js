import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';

const container = document.getElementById('page-service-item');
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);

class Metan extends Component {
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
        
        <div className="s-header s-header--green">
          <div className="container">
            <div className="s-header__body">
              <div className="s-header__text">
                <h1 className="s-caption-h1">
                  <span className="s-caption-h1--i1">Установка</span>ГБО на метане
                  <span className="s-caption-h1--i2">в Чебоксарах</span>
                </h1>
                <ul className="s-header__list">
                  <li><strong>Экономия до 70%</strong> с каждой заправкой</li>
                </ul>
                <div className="s-header__btns">
                  <button className="btn-1 btn--white-border" aria-label="Заказать установку">Заказать установку</button>
                </div>
              </div>
              <div className="s-header__img sm-header__img">
                <img src="/img/metan/header-1.png" alt="Установка ГБО на метане" />
              </div>
            </div>
          </div>
        </div>

        <section className="sd-description">
          <div className="container">
            <div className="sd-advantages__block sd-block--right">
              <div className="sd-advantages__block__text">
                <div>
                  <p className="sd-description__text text__p2"><span>Метан</span> - природный газ, 
                  плотность которого 
                  несравнима с плотностью бензина. Поэтому его заправляют 
                  в баллоны высокого давления, сжимая до пары сотен атмосфер. 
                  Собственно, эти самые баллоны и монтируются в автомобили.</p>
                </div>
              </div>
              <div className="sd-advantages__block__img">
                <img src="/img/metan/murano_1.png" alt="Рост цен на дизельное топливо" />
              </div>
            </div>
            <div className="sd-description__bcg bcg--2"></div>
          </div>
        </section>

        <section className="sd-advantages">
          <div className="container">
            <div className="caption__container">
              <h2 className="caption__section">Преимущества <strong>метана</strong></h2>
            </div>
            <div className="sm-advantages__body">
              <div className="sm-advantages__list">
                <div className="sm-advantages__item">
                  <div className="advantages__item__img adv-item--security"></div>
                  <div className="advantages__item__text">
                    <h2 className="caption__h2">Безопасность</h2>
                    <p>Метан опрасен только при накоплении только в закрытом помещении. 
                    Он легче воздуха и при ДТП просто улетучивается.</p>
                  </div>
                </div>
                <div className="sm-advantages__item">
                  <div className="advantages__item__img adv-item--ecology"></div>
                  <div className="advantages__item__text">
                    <h2 className="caption__h2">Экологичность</h2>
                    <p>Выбросы углекислого газа, в сравнении с бензином, ниже 
                      на четверть, а оксидов азота — меньше на 75%.</p>
                  </div>
                </div>
                <div className="sm-advantages__item">
                  <div className="advantages__item__img adv-item--price"></div>
                  <div className="advantages__item__text">
                    <h2 className="caption__h2">Цена</h2>
                    <p>Октановое число у метана больше, чем у 98-го бензина (110), 
                      а стоит в три раза меньше.</p>
                  </div>
                </div>
              </div>
              <div className="sm-advantages__img">
                <div className="advantages__bcg advantages__bcg--sm">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <img src="/img/metan/metan-1.png" alt="Преимущества метана" />
              </div>
            </div>
            <div className="sm-advantages__btn">
              <button className="btn-1 btn--blue" aria-label="Заказать установку">Заказать установку</button>
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

ReactDOM.render(<Metan/>, document.getElementById('page-service-item'));
