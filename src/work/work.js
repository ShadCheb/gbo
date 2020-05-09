import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Loader from '../main/components/Loader';
import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';

import '../../public/style/antd.css';
import '../../public/style/style.css';
import '../../public/style/work.css';

const container = document.getElementById('page-other');
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);


class Work extends Component {
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
        { this.state.loader && <Loader /> } 

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
        
        <section className="job">
          <div className="container">
            <div className="job__bcg-1 bcg--1"></div>
            <div className="caption__container">
              <h2 className="caption__section ">Наши работы</h2>
            </div>
            {
              (infoCity.works && infoCity.works.length)
                ? (
                <div className="job__body">
                  { infoCity.works.map((item, idx) => (
                      <article className="job__item" key={idx}>
                        <div className="job__item__img">
                          <div className="job__img__label">Подробнее</div>
                          <img src={ '/images/' + (item.avatar || 'not-car.jpg') } alt={ item.name } />
                        </div>
                        <div className="job__item__body">
                          <h2>{ item.name }</h2>
                        </div>
                        <a className="link__block" href={ '/work/' + item.id }></a>
                      </article>
                    ))
                  }
                </div>)
              : (<p>Нет данных</p>)
            }
            { (infoCity.pages && infoCity.pages > 1)
              ? (
                <div className="job__navigation">
                  {
                    (infoCity.page > 1)
                      ? (<a href={ infoCity.page - 1 } className="nav__arrow nav--right">
                            <svg>
                              <use xlinkHref="/img/sprite-icon.svg#icon-back"/>
                            </svg>
                        </a>) 
                      : ('')
                  }
                  {
                    <a>{ infoCity.page }</a>
                  }
                  {
                    (infoCity.page < infoCity.pages)
                      ? (<a href={ infoCity.page + 1 } className="nav__arrow nav--right">
                        <svg>
                          <use xlinkHref="/img/sprite-icon.svg#icon-next"/>
                        </svg>
                      </a>) : ('')
                  }
                </div>
              ) : ('')
            }
          </div>
        </section>

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

ReactDOM.render(<Work/>, container);
