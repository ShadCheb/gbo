import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Loader from '../main/components/Loader';
import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';
import ModalRecord from '../main/components/ModalRecord';
import FixedBtn from '../main/components/FixedBtn';

import lozad from 'lozad';

import '../../public/style/antd.css';
import '../../public/style/style.css';
import '../../public/style/service.css';

const container = document.getElementById('page-service-item');
const csrf = container.dataset.csrf;
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);


class Propan extends Component {
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
      page: 'Вариатор',
      pageBrief: 'variator'
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

        <section className="p-header">
          <div className="container">
            <div className="p-header__bcg"></div>
            <div className="p-header__content">
              <h1 className="p-caption-h1">ГБО пропан</h1>
              <h2 className="p-caption-h2">установка в { infoCity.city 
                ? (infoCity.city.name2 || 'городе')
                : ('')
              }</h2>
              <p className="p-caption-p">Выбор большинства автолюбителей</p>
              <div className="p-header__btns">
                <button className="btn-3 btn--white" 
                  data-type="Заказать установку вариатора" 
                  aria-label="Заказать установку"
                  onClick={this.openModalRecord.bind(this)}
                >Заказать установку</button>
              </div>
            </div>
          </div>
        </section>


        <section className="p-advantages">
          <div className="container">
            <div className="p-advantages__item">
              <h2 className="caption__h2">Преимущества установки ГБО на пропане</h2>
              <article className="p-advantages__block">
                  <div className="p-advantages__icon lozad"
                    data-background-image-set="url('../img/propan/wallet.jpg')"
                  ></div>
                  <p>Невысокая стоимость установки оборудования. Начальная стоимость 
                    установки под ключ составляет 25 000 рублей, этой суммы достаточно для переоборудования 
                    популярных городских седанов.
                  </p>
              </article>
              <article className="p-advantages__block">
                  <div className="p-advantages__icon lozad"
                    data-background-image-set="url('../img/propan/piggy-bank.jpg')"
                  ></div>
                  <p>Экономия на топливе составляет до 50%. Если на бензине на 
                  каждый километр пути приходиться тратить 5 рублей, то на газе Пропан-Бутан расходы снизяться 
                  вдвое, и это с учетом обслуживания автомобиля
                  </p>
              </article>
              <article className="p-advantages__block">
                  <div className="p-advantages__icon lozad"
                    data-background-image-set="url('../img/propan/points.jpg')"
                  ></div>
                  <p>Большое количество заправочных станций с надписями "Газ", 
                  "Пропан". Вам не придется тратить больше времени на поиск чтобы заправиться.
                  </p>
              </article>
              <article className="p-advantages__block">
                  <div className="p-advantages__icon lozad"
                    data-background-image-set="url('../img/propan/stars.jpg')"
                  ></div>
                  <p>При эксплуатации автомобиля отсутствует накопления сажи 
                  нагара, так как газ поступает в цилиндры только в паровой фазе и не смывает 
                  масляную пленку со стенок цилиндров.
                  </p>
              </article>
            </div>
            <div className="p-advantages__item">
              <h2 className="caption__h2">Недостатки установки ГБО на пропане</h2>
              <article className="p-advantages__block">
                  <div className="p-advantages__icon lozad"
                    data-background-image-set="url('../img/propan/minus.jpg')"
                  ></div>
                  <p>Ну и как же без недостатков - потеря пространства в багажнике 
                  автомобиля. Данный недостаток решается установкой тороидального балонна (под запаску).
                  </p>
              </article>
            </div>
          </div>
        </section>


        <section className="p-install">
          <div className="container">
            <div className="p-install__content">
              <div className="p-install__text">
                <h2 className="caption__h2">Установка ГБО на пропане</h2>
                <p className="text__p">Установить газобаллонное оборудование на пропане можно 
                  на любой авто вне зависимости от пробега, характеристик двигателя и прочих 
                  параметров автомобиля. Установка пропана на авто проводится по безопасной 
                  технологии, что гарантирует высокое качество работ и продолжительный срок 
                  эксплуатации оборудования.
                </p>
                <p className="text__p">Для установки пропана на авто проводятся работы 
                  по монтажу дополнительной топливной системы автомобиля. 
                  Конкретная модель ГБО для установки выбирается специалистами на 
                  основе характеристик транспортного средства. Установка пропана на 
                  авто проводится квалифицированными специалистами с использованием 
                  безопасной технологии. Наша компания сотрудничает с ведущими 
                  производителями газобаллонного оборудования и предоставляет на все 
                  работы гарантии, низкие цены на комплектующие и само оборудование.
                </p>
              </div>
              <div className="p-install__img">
                <picture className="lozad" data-iesrc="/img/propan/propan-1.jpg" 
                  data-alt="Установка пропана в Газовед">
                  <source media="(min-width: 300px)" srcSet="/img/propan/propan-1.jpg" />
                </picture>
              </div>
            </div>
            <div className="p-install__btn">
              <button className="btn-3" 
                data-type="Заказать установку пропана" 
                aria-label="Заказать установку"
                onClick={this.openModalRecord.bind(this)}
              >Заказать установку</button>
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

        { (infoCity.phone)
          ? (<FixedBtn phone={infoCity.phone}/>) 
          : ('') }
      </div>
    );
  }
}

ReactDOM.render(<Propan/>, document.getElementById('page-service-item'));
