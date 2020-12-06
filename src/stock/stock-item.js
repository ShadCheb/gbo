import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Loader from '../main/components/Loader';
import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';
import FixedBtn from '../main/components/FixedBtn';
import ModalRecord from '../main/components/ModalRecord';

import '../../public/style/antd.css';
import '../../public/style/style.css';
import '../../public/style/stock.css';

const container = document.getElementById('page-other');
const csrf = container.dataset.csrf;
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);

class Stock extends Component {
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
  // handleChange = (value) => {
  //   let brief = '';

  //   this.state.cityList.some(c => {
  //     if (c.id == value){
  //       brief = c.brief;

  //       return true;
  //     }
  //   });

  //   location.href = '/?city=' + brief;
  // }

  // Открытие/закрытие меню
  toggleMenu = () => {
    this.setState(function(prevValue) {
      return ({showMenu: !prevValue.showMenu});
    });
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
              // handleChange={this.handleChange}
            />
            <Nav 
              page="isStok"
              showMenu={this.state.showMenu}
              social={infoCity.social}
              closeMenu={this.toggleMenu}
            />
          </div>
        </main>
        
        <section className="stock">
          <div className="container">
            <div className="stock__body">
              <div className="si__header">
                <div className="container">
                  <div className="si__header__bcg bcg--1"></div>
                  <div className="si__header__body">
                    <div className="si__header__img">
                      <div>
                        <img src="/img/stock/friends.jpg" alt="Акция Приведи друга" />
                      </div>
                    </div>
                    <div className="si__header__text"><span>Акция</span> "Приведи друга"</div>
                  </div>
                </div>
              </div>
              
              <div className="si-description">
                <div className="container">
                  <div className="si-description__body">
                    <div className="si-description__img">
                      <div className="advantages__bcg"><span></span><span></span><span></span><span></span><span></span></div>
                      <h2>Gazoved</h2>
                    </div>
                    <div className="si-description__text">
                      <div>
                        <h2 className="si-description__caption">
                          Приведи друга - <strong>получи бесплатно</strong>
                          <strong> 30л газа</strong>
                        </h2>                        
                        <p className="text__p2">Что нужно для получения 30 литров газа:</p>
                        <ul className="text__list">
                          <li>Приведи друга на установку газового оборудования в GAZOVED</li>
                          <li>Напиши в WhatsApp 
                            <a href={`https://wa.me/79969498725?text=Хочу%20привести%20друга%20на%20установку%20ГБО`}>
                            +7(996)949-87-25</a> модель авто и номер друга</li>
                          <li>Получи топливную карту с газом</li>
                        </ul>
                        <p className="text__p2">Акция не распространяется на комплекты с 
                          красным ценником</p>
                        <div className="si-description__btn">
                          <button className="btn-1 btn--blue" 
                            aria-label="Участие в акции Приведи друга"
                            onClick={this.openModalRecord.bind(this)}
                          >Участвовать</button>
                        </div>
                      </div>
                    </div>
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

        { (infoCity.phone)
          ? (<FixedBtn phone={infoCity.phone}/>) 
          : ('') }
      </div>
    );
  }
}

ReactDOM.render(<Stock/>, container);
