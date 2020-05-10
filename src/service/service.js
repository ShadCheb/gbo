import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Loader from '../main/components/Loader';
import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';

import '../../public/style/style.css';
import '../../public/style/service.css';

const container = document.getElementById('page-service');
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);

class Services extends Component {
  state = {
    cityList,
    infoCity,

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
        {/* { this.state.loader && <Loader /> }  */}

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
        
        <div className="services">
          <div className="container">
            <div className="services__body">
              <article className="services__block">
                <div className="service__block__bcg"></div>
                <div className="service__block__content">
                  <img className="services__block__img" src="/img/metan/metan-1.png" alt="ГБО Метан" />
                  <h2 className="services__block__caption">ГБО Метан</h2>
                </div>
                <a className="link__block" href="/services/metan" />
              </article>
              <article className="services__block">
                <div className="service__block__bcg"></div>
                <div className="service__block__content">
                  <img className="services__block__img" 
                    src="/img/registration/registration-1-p.png" alt="Регистрация ГБО" />
                  <h2 className="services__block__caption">Регистрация ГБО</h2>
                </div>
                <a className="link__block" href="/services/registration" />
              </article>
              <article className="services__block">
                <div className="service__block__bcg"></div>
                <div className="service__block__content">
                  <img className="services__block__img" src="/img/dizel/dizel-1.png" alt="Газодизель" />
                  <h2 className="services__block__caption">Газодизель</h2>
                </div>
                <a className="link__block" href="/services/dizel" />
              </article>
              <article className="services__block">
                <div className="service__block__bcg"></div>
                <div className="service__block__content">
                  <img className="services__block__img" src="/img/variator/variator-1.png" alt="Вариатор" />
                  <h2 className="services__block__caption">Вариатор</h2>
                </div>
                <a className="link__block" href="/services/variator" />
              </article>
            </div>
          </div>
        </div>
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

ReactDOM.render(<Services/>, document.getElementById('page-service'));
