import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Loader from '../main/components/Loader';
import Header from '../main/components/Header';
import Nav from '../main/components/Nav';
import Footer from '../main/components/Footer';
import ModalRecord from '../main/components/ModalRecord';
import Timer from '../main/components/Timer';

import lozad from 'lozad';

import '../../public/style/antd.css';
import '../../public/style/style.css';
import '../../public/style/service.css';

const container = document.getElementById('page-service-item');
const csrf = container.dataset.csrf;
const infoCity = JSON.parse(container.dataset.info);
const cityList = JSON.parse(container.dataset.city_list);


class Dizel extends Component {
  state = {
    cityList,
    infoCity,

    modalRecord: {
      visible: false,
      title: 'Форма'
    },

    showMenu: false, // открытие меню
    loader: true,
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
      page: 'Газодизель'
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
        
        <div className="s-header">
          <div className="container">
            <div className="s-header__body">
              <div className="s-header__text">
                <h1 className="s-caption-h1">
                  <span className="s-caption-h1--i1">Установка</span>ГБО на дизельные машины 
                  { infoCity.city 
                    ? (<span className="s-caption-h1--i2">в {infoCity.city.name2 || 'городе'}</span>)
                    : ('')
                  }
                </h1>
                <ul className="s-header__list">
                  <li><strong>В рассрочку на 12 месяцев</strong> без первоначального взноса и переплаты</li>
                  <li><strong>Экономия</strong> около <strong>1&nbsp;000&nbsp;000 
                    в год</strong> на дизельном топливе</li>
                </ul>
                <div className="s-header__btns">
                  <button className="btn-1 btn--white-border" 
                    data-type="Узнать цену установки ГБО на дизель"
                    aria-label="Узнать стоимость"
                    onClick={this.openModalRecord.bind(this)}
                  >Узнать стоимость</button>
                  <button className="btn-1 btn--white" 
                    data-type="Заказать установку ГБО на дизель"
                    aria-label="Заказать установку"
                    onClick={this.openModalRecord.bind(this)}
                  >Заказать установку</button>
                </div>
              </div>
              <div className="s-header__img sd-header__img">
                <picture className="lozad" data-iesrc="/img/dizel/header-1.png" 
                  data-alt="Установку ГБО на дизель в Gazoved">
                  <source media="(min-width: 768px)" srcSet="/img/dizel/header-1.png" />
                  <source media="(min-width: 576px)" srcSet="/img/dizel/header-1-p.png" />
                  <source media="(min-width: 300px)" srcSet="/img/dizel/header-1-m.png" />
                </picture>
              </div>
            </div>
          </div>
        </div>

        <div className="sd-test">
          <div className="container">
            <div className="sd-test__bcg bcg--1">
            </div>
            <div className="sd-test__body">
              <div className="sd-test__img">
                <picture className="lozad" data-iesrc="/img/dizel/stock__men.jpg" 
                  data-alt="Установи ГБО бесплатно в Gazoved">
                  <source media="(min-width: 576px)" srcSet="/img/dizel/stock__men.jpg" />
                  <source media="(min-width: 300px)" srcSet="/img/dizel/stock__men-m.jpg" />
                </picture>
              </div>
              <div className="sd-test__text">
                <p className="sd-test__p-1">Установи</p>
                <p className="sd-test__p-2">ГБО бесплатно</p>
                <p className="sd-test__p-3">на 2 недели и тестируй его!</p>
                <p className="sd-test__p-4">Если Вас не заинтересует ГБО мы демонтируем его бесплатно</p>
                <button className="btn-1 sd-test__btn" 
                  data-type="Заказать установку ГБО на дизель"
                  aria-label="Заказать установку"
                  onClick={this.openModalRecord.bind(this)}
                >Заказать установку</button>
              </div>
            </div>
          </div>
        </div>

        <section className="sd-save">
          <div className="container">
            <div className="sd-save__bcg bcg--2"></div>
            <div className="sd-save__body">
              <div className="caption2__container">
                <h2 className="caption2__caption">Как экономить 
                  <strong>1&nbsp;000&nbsp;000 рублей в год</strong> на топливе</h2>
              </div>
              <div className="sd-save__list">
                <div className="sd-save__list__item">
                  <span>1</span>
                  <div className="sd-save__list__caption">
                    <h3 className="caption__h2">Замещение дизеля метаном <strong>60/40</strong></h3>
                  </div>
                  <p className="sd-save__description">Система газодизель расходует дизель 
                  и метан в среднем в пропорции 60% на 40%</p>
                </div>
                <div className="sd-save__list__item">
                  <span>2</span>
                  <div className="sd-save__list__caption">
                    <h3 className="caption__h2">Расходы на топливо газодизеля</h3>
                  </div>
                  <p className="sd-save__description">Совмещение топлива метан и дизель: (14л * 14руб. + 
                    21л * 45руб) * 5 * 350дней = <strong>1&nbsp;996&nbsp;750&nbsp;руб/год</strong></p>
                </div>
                <div className="sd-save__list__item">
                  <span>3</span>
                  <div className="sd-save__list__caption">
                    <h3 className="caption__h2">Расход топлива грузовиком <strong>35л/100км</strong></h3>
                  </div>
                  <p className="sd-save__description">Расходы на дизельное топливо 
                    <strong>500&nbsp;км/день</strong> * 
                    350 дней в году: 35л * 45руб * 5 * 350дней = 
                    <strong>2&nbsp;756&nbsp;250&nbsp;руб</strong></p>
                </div>
                <div className="sd-save__list__item">
                  <span>4</span>
                  <div className="sd-save__list__caption">
                    <h3 className="caption__h2">Экономия на топливе за 1 год</h3>
                  </div>
                  <p className="sd-save__description">2&nbsp;756&nbsp;250&nbsp;руб. - 
                    1&nbsp;996&nbsp;750&nbsp;руб. = <strong>759&nbsp;500&nbsp;руб/год </strong> 
                    на 1 машине автопарка</p>
                </div>                
              </div>
            </div>
          </div>
        </section>

        <section className="sd-installment">
          <div className="container">
            <div className="sd-installment__body">
              <div className="sd-installment__text">
                <div className="caption2__container">
                  <h2 className="caption2__caption"> 
                    <strong>Рассрочка</strong> на 12 месяцев</h2>
                </div>
                <p className="sd-installment__p text__p2">Устанавливаем ГБО на все виды автомобилей в рассрочку 
                  до 12 месяцев! Просто введите свою контактную информацию и оставьте заявку. Мы 
                  свяжемся с вами для уточнения деталей.
                </p>
              </div>
              <div className="sd-installment__clock">
                <Timer id="timer"/>

                <div className="sd-installment__btn">
                  <button className="btn-1"
                    data-type="Заказать установку ГБО на дизель"
                    aria-label="Заказать установку"
                    onClick={this.openModalRecord.bind(this)}
                  >Заказать установку</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sd-advantages">
          <div className="container">
            <div className="caption__container">
              <h2 className="caption__section">Преимущества</h2>
            </div>
            <div className="sd-advantages__list">
              <div className="sd-advantages__ul">
                <div className="sd-advantages__li">
                  <span>01</span>
                  <p><span>Экономия</span> топливных затрат до 30%</p>
                </div>
                <div className="sd-advantages__li">
                  <span>02</span>
                  <p><span>Щадящий режим</span> работы топливной системы</p>
                </div>
                <div className="sd-advantages__li">
                  <span>03</span>
                  <p><span>Улучшение сгорания</span> дизельного топлива</p>
                </div>
                <div className="sd-advantages__li">
                  <span>04</span>
                  <p>Постоянно <span>чистый</span> сажевый фильтр</p>
                </div>
                <div className="sd-advantages__li">
                  <span>05</span>
                  <p>Мягкая, <span>плавная работа</span> двигателя</p>
                </div>
              </div>
              <div className="sd-advantages__ul">
                <div className="sd-advantages__li">
                  <span>06</span>
                  <p><span>Прирост</span> мощности до 15%</p>
                </div>
                <div className="sd-advantages__li">
                  <span>07</span>
                  <p><span>Увеличение</span> запаса хода до 50%</p>
                </div>
                <div className="sd-advantages__li">
                  <span>08</span>
                  <p><span>Замещение</span> дизельного топлива 60-70% в смешанном цикле эксплуатации</p>
                </div>
                <div className="sd-advantages__li">
                  <span>09</span>
                  <p>Возможность переоборудования <span>любых дизельных двигателей</span>, включая COMMON RAIL ЕВРО-4</p>
                </div>
                <div className="sd-advantages__li">
                  <span>10</span>
                  <p>Возможность использовать оба вида топлива: <span>дизель и газ</span></p>
                </div>
              </div>
            </div>
            
            <div className="sd-advantages__block sd-block--left">
              <div className="sd-advantages__block__img">
                <picture className="lozad" data-iesrc="/img/dizel/dizel-1.png" 
                  data-alt="Параллельная работа видов топлива">
                  <source media="(min-width: 768px)" srcSet="/img/dizel/dizel-1.png" />
                  <source media="(min-width: 300px)" srcSet="/img/dizel/dizel-1-m.png" />
                </picture>
              </div>
              <div className="sd-advantages__block__text">
                <div>
                  <p className="text__p">При схеме «газ на дизель» дизельное топливо используется 
                    для поджигания топливо-воздушной смеси. <span>Параллельная работа на обоих видах 
                    топлива</span> позволит заправлять солярку, если поблизости нет газозаправочной станции.</p>
                </div>
              </div>
            </div>
            <div className="sd-advantages__block sd-block--right">
              <div className="sd-advantages__block__text">
                <div>
                  <p className="text__p"><span>Рост цен на дизельное топливо</span> делает экономически 
                    оправданным оснащение автомобилей с дизельными двигателями газобаллонным 
                    оборудованием.</p>
                  <p className="text__p">Установка ГБО совместно с дизелем оправдана для 
                    грузовых машин, пассажирского транспорта и сельскохозяйственной техники.</p>
                </div>
              </div>
              <div className="sd-advantages__block__img">
                <picture className="lozad" data-iesrc="/img/dizel/grafic-1.png" 
                  data-alt="Рост цен на дизельное топливо">
                  <source media="(min-width: 768px)" srcSet="/img/dizel/grafic-1.png" />
                  <source media="(min-width: 300px)" srcSet="/img/dizel/grafic-1-m.png" />
                </picture>
              </div>
            </div>
          </div>
        </section>

        <section className="sd-sequence">
          <div className="container">
            <div className="caption__container">
              <h2 className="caption__section benefit__caption">Последовательность <strong>переоборудования</strong></h2>
            </div>
            <div className="sd-sequence__body">
              
                <article className="registration__block">
                  <div className="registration__block__num">1</div>
                  <p>Аудит автопарка, определение возможности переоборудования</p>
                </article>
                <article className="registration__block">
                  <div className="registration__block__num">2</div>
                  <p>Обработка информации о двигателе инженерами</p>
                </article>
                <article className="registration__block">
                  <div className="registration__block__num">3</div>
                  <p>Технико-экономический расчет</p>
                </article>
                <article className="registration__block">
                  <div className="registration__block__num">4</div>
                  <p>Разработка и сборка прототипа</p>
                </article>
                <article className="registration__block">
                  <div className="registration__block__num">5</div>
                  <p>Испытания, оптимизация, вычисление фактической топливной эффективности прототипа</p>
                </article>
                <article className="registration__block">
                  <div className="registration__block__num">6</div>
                  <p>Обучение персонала заказчика (при необходимости)</p>
                </article>
                <article className="registration__block">
                  <div className="registration__block__num">7</div>
                  <p>Поставка и монтаж комплектов ГБО</p>
                </article>

              <div className="sd-sequence__img">
                <picture className="lozad" data-iesrc="/img/dizel/fura__bcg.jpg" 
                  data-alt="Последовательность переоборудования">
                  <source media="(min-width: 768px)" srcSet="/img/dizel/fura__bcg.jpg" />
                  <source media="(min-width: 300px)" srcSet="/img/dizel/fura__bcg-m.jpg" />
                </picture>
              </div>
            </div>
          </div>
        </section>

        <section className="sd-generation">
          <div className="container">
            <div className="caption__container">
              <h2 className="caption__section">Поколение <strong>технологий</strong></h2>
            </div>
            <div className="sd-generation__body">
              <article className="sd-generation__block">
                <div>
                  <div className="sd-generation__block__caption">
                    <h3><span>1</span> поколение</h3>
                    <p>Механическая система с модифицированным ТНВД</p>
                  </div>
                  <div className="sd-generation__block__body">
                    <div className="sd-generation__block__pos">
                      <h4>Преимущества:</h4>
                      <ul className="sd-generation__list">
                        <li>Высокая степень замещения</li>
                      </ul>
                    </div>
                    <div className="sd-generation__block__neg">
                      <h4>Недостатки:</h4>
                      <ul className="sd-generation__list">
                        <li>Неэффективен на переходных режимах</li>
                        <li>Привязка к конкретной модели устаревших ТНВД</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
              <article className="sd-generation__block">
                <div>
                  <div className="sd-generation__block__caption">
                    <h3><span>2</span> поколение</h3>
                    <p>Бустеры без ограничения подачи дизтоплива: газ добавляется в топливную смесь</p>
                  </div>
                  <div className="sd-generation__block__body">
                    <div className="sd-generation__block__pos">
                      <h4>Преимущества:</h4>
                      <ul className="sd-generation__list">
                        <li>Низкая стоимость</li>
                        <li>Увеличение мощности двигателя</li>
                      </ul>
                    </div>
                    <div className="sd-generation__block__neg">
                      <h4>Недостатки:</h4>
                      <ul className="sd-generation__list">
                        <li>Отсутствие практической экономии</li>
                        <li>Опасность повреждения двигателя</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
              <article className="sd-generation__block">
                <div>
                  <div className="sd-generation__block__caption">
                    <h3><span>3</span> поколение</h3>
                    <p>Электронно-механическая система с управляемой запальной дозой</p>
                  </div>
                  <div className="sd-generation__block__body">
                    <div className="sd-generation__block__pos">
                      <h4>Преимущества:</h4>
                      <ul className="sd-generation__list">
                        <li>65-70% замещения в любых режимах работы</li>
                        <li>Адаптивная подача топлива</li>
                      </ul>
                    </div>
                    <div className="sd-generation__block__neg">
                      <h4>Недостатки:</h4>
                      <ul className="sd-generation__list">
                        <li>Требует высококвалифицированное обслуживание</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
              <article className="sd-generation__block">
                <div>
                  <div className="sd-generation__block__caption">
                    <h3><span>4</span> поколение</h3>
                    <p>Электронная система с управляемой запальной дозой</p>
                  </div>
                  <div className="sd-generation__block__body">
                    <div className="sd-generation__block__pos">
                      <h4>Преимущества:</h4>
                      <ul className="sd-generation__list">
                        <li>Стабильная работа при высоком замещении (60-65%)</li>
                        <li>ЕВРО-4/5</li>
                      </ul>
                    </div>
                    <div className="sd-generation__block__neg">
                      <h4>Недостатки:</h4>
                      <ul className="sd-generation__list">
                        <li>Относительно высокая стоимость</li>
                        <li>Требует индивидуальной настройки</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="sd-job">
          <div className="container">
            <div className="sd-conclusion__bcg bcg--1"></div>
            <div className="caption__container">
              <h2 className="caption__section">Наши <strong>работы</strong></h2>
            </div>
            <div className="sd-job__body">
              <div className="sd-job__col-1">
                <div className="sd-job__img">
                  <img className="lozad" data-src="/img/dizel/job-1.jpg" 
                    data-alt="Преимущества метана" />
                </div>
                <div className="sd-job__img">
                  <img className="lozad" data-src="/img/dizel/job-2.jpg" 
                    data-alt="Преимущества метана" />
                </div>
                <div className="sd-job__img">
                  <img className="lozad" data-src="/img/dizel/job-3.jpg" 
                    data-alt="Преимущества метана" />
                </div>
                <div className="sd-job__img">
                  <img className="lozad" data-src="/img/dizel/job-4.jpg" 
                    data-alt="Преимущества метана" />
                </div>
              </div>
              <div className="sd-job__col-2">
                <div className="sd-job__img">
                  <img className="lozad" data-src="/img/dizel/job-5.jpg" 
                    data-alt="Преимущества метана" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sd-conclusion">
          <div className="sd-conclusion__bcg"></div>
          <div className="container">
            <div className="caption__container sd-conclusion__caption">
              <h2 className="caption__section">Выводы</h2>
            </div>
            <div className="sd-conclusion__body">
              <div className="sd-conclusion__text">
                <div>
                  <h2 className="sd-conclusion__caption">Таким образом, <strong>модификация</strong> дизельного 
                    двигателя в газодизель <strong>позволяет одновременно решить следующие задачи:</strong></h2>
                  <ul className="text__list">
                    <li>Снизить расходы <strong>на 10-30%</strong></li>
                    <li>Увеличить мощность и крутящий момент <strong>на 20-30%</strong></li>
                    <li>Увеличить <strong>срок службы</strong> элементов системы подачи 
                      топлива (прежде всего систем Common Rail) и ресурс двигателя в целом</li>
                    <li>Снизить содержание СО, СН и твердых частиц в выхлопе</li>
                  </ul>
                  <div className="sd-conclusion__btn">
                    <button className="btn-1" 
                      data-type="Заказать установку ГБО на дизель"
                      aria-label="Заказать установку"
                      onClick={this.openModalRecord.bind(this)}
                    >Заказать установку</button>
                  </div>
                </div>
              </div>
              <div className="sd-conclusion__img">
                <picture className="lozad" data-iesrc="/img/dizel/men.png" 
                    data-alt="Снизить расходы на топливо">
                  <source media="(min-width: 768px)" srcSet="/img/dizel/men.png" />
                  <source media="(min-width: 300px)" srcSet="/img/dizel/men-m.png" />
                </picture>
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
      </div>
    );
  }
}

ReactDOM.render(<Dizel/>, document.getElementById('page-service-item'));
