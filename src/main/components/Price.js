import React from 'react';

function Price(props) {
  let activePrice = null;

  const openDescription = e => {
    let target = e.target;
    let price = target.closest('.price__body__block');
    
    if (price.classList.contains('active')) {
      price.classList.remove('active');

      return;
    }

    if (activePrice) {
      activePrice.classList.remove('active');
    }

    price.classList.add('active');
    activePrice = price;
  };

  const openModal = (e) => {
    props.openModal(e);
  };

  return (
    <section class="price">
      <div class="container">
        <div class="caption__container">
          <h2 class="caption__section">Цены на ГБО</h2>
        </div>
        <div class="price__body">
          <div class="price__body__header-mobile">
            <div class="price__body__name" />
            <div class="mobile__header">Кол-во цилиндров:</div>
            <div class="price__body__btn" />
          </div>
          <div class="price__body__header">
            <div class="price__body__name" />
            <div class="price__body__value name--header"><p>4 <span>цилиндра</span></p></div>
            <div class="price__body__value name--header"><p>6 <span>цилиндров</span></p></div>
            <div class="price__body__value name--header"><p>8 <span>цилиндров</span></p></div>
            <div class="price__body__btn" />
          </div>
          <div class="price__body__block">
            <div class="price__body__row">
              <div class="price__body__name">OMVL</div>
              <div class="price__body__value">
                <label class="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div class="price__body__value">
                <label class="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div class="price__body__value">
                <label class="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div class="price__body__btn"><button class="btn-1 btn--blue"
                  onClick={openDescription}
                ><span class="price--open">Описание</span><span class="price--close">Закрыть</span>
                  <svg><use xlinkHref="img/sprite-icon.svg#icon-description" /></svg></button></div>
            </div>
            <div class="price__container">
              <div class="price__description">
                <p class="price__description__bcg">Gazoved</p>
                <div>
                  <h3 class="price__description__caption">Описание:</h3>
                  <p class="price__description__p">Качественное газобаллонное оборудование на авто – 
                    это не только залог минимизации транспортных расходов, но и надежность, долговечность 
                    топливной системы, увеличение ресурса двигателя, межсервисного интервала замены свечей 
                    зажигания и фильтров, снижение износа узлов мотора. Чтобы воспользоваться всеми этими 
                    преимуществами и гарантированно получить безотказное автогазовое оборудование, ГБО 
                    итальянской марки OMVL</p>
                  <h3 class="price__description__caption">Комплектация:</h3>
                  <ul class="price__description__ul">
                    <li>Редуктор Tomasetto Alaska до 140лс Италия</li>
                    <li>Форсунки lpg tech 2Om</li>
                    <li> Баллон 42 литра тор., либо 50 литров цилиндр</li>
                    <li>Полный пакет документов для ГИБДД</li>
                  </ul>
                </div>
              </div>
              <button class="price__description__btn" onClick={openDescription}>
                <svg>
                  <use xlinkHref="img/sprite-icon.svg#icon-arrow-up" />
                </svg>
              </button>
            </div>
          </div>
          <div class="price__body__block">
            <div class="price__body__row">
              <div class="price__body__name">Digitronic maxi2</div>
              <div class="price__body__value">
                <label class="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div class="price__body__value">
                <label class="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div class="price__body__value">
                <label class="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div class="price__body__btn"><button class="btn-1 btn--blue"
                  onClick={openDescription}
                ><span class="price--open">Описание</span><span class="price--close">Закрыть</span>
                  <svg><use xlinkHref="img/sprite-icon.svg#icon-description" /></svg></button>
              </div>
            </div>
            <div class="price__container">
              <div class="price__description">
                <p class="price__description__bcg">Gazoved</p>
                <div>
                  <h3 class="price__description__caption">Описание:</h3>
                  <p class="price__description__p">Качественное газобаллонное оборудование на авто – 
                    это не только залог минимизации транспортных расходов, но и надежность, долговечность 
                    топливной системы, увеличение ресурса двигателя, межсервисного интервала замены свечей 
                    зажигания и фильтров, снижение износа узлов мотора. Чтобы воспользоваться всеми этими 
                    преимуществами и гарантированно получить безотказное автогазовое оборудование, ГБО 
                    итальянской марки OMVL</p>
                  <h3 class="price__description__caption">Комплектация:</h3>
                  <ul class="price__description__ul">
                    <li>Редуктор Tomasetto Alaska до 140лс Италия</li>
                    <li>Форсунки lpg tech 2Om</li>
                    <li> Баллон 42 литра тор., либо 50 литров цилиндр</li>
                    <li>Полный пакет документов для ГИБДД</li>
                  </ul>
                </div>
              </div>
              <button class="price__description__btn" onClick={openDescription}>
                <svg>
                  <use xlinkHref="img/sprite-icon.svg#icon-arrow-up" />
                </svg>
              </button>
            </div>
          </div>
          <div class="price__btn">
            <button class="btn-1"
              aria-label="заказать"
              onClick={openModal}
            >Заказать</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Price;

