import React from 'react';

const cylinderList = ['4', '6', '8'];

function BlockCheck({cylinders, cylinder}) {
  return (cylinders.indexOf(cylinder) > -1)
    ? (
      <div className="price__body__value">
        <label className="input__check price__check">
          <input type="radio" name="check-gbo" /><span></span></label>
      </div>
    )
    : (
      <div className="price__body__value"></div>
    );
}

function PriceBlock({equipment, openDescription}) {
  let cylinderArray = (equipment.cylinder) 
    ? equipment.cylinder.split(',')
    : [];

  return (
    <div className="price__body__block">
      <div className="price__body__row">
        <div className="price__body__name">{equipment.name || 'Без названия'}</div>
        {
          cylinderList.map((cylinder, i) => (
            <BlockCheck cylinders={cylinderArray} cylinder={cylinder} key={i}/>
          ))
        }
        <div className="price__body__btn"><button className="btn-1 btn--blue"
            onClick={openDescription}
          ><span className="price--open">Описание</span><span className="price--close">Закрыть</span>
            <svg><use xlinkHref="img/sprite-icon.svg#icon-description" /></svg></button></div>
      </div>
      <div className="price__container">
        <div className="price__description">
          <p className="price__description__bcg">Gazoved</p>
          <div className="price__description__text" 
            dangerouslySetInnerHTML={{__html: equipment.description}}>
          </div>
        </div>
        <button className="price__description__btn" onClick={openDescription}>
          <svg>
            <use xlinkHref="img/sprite-icon.svg#icon-arrow-up" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Price({openModal, equipment}) {
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

  const onOpenModal = (e) => {
    openModal(e);
  };

  return (
    <section className="price">
      <div className="container">
        <div className="caption__container">
          <h2 className="caption__section">Оборудование ГБО</h2>
        </div>
        <div className="price__body">
          <div className="price__body__header-mobile">
            <div className="price__body__name" />
            <div className="mobile__header">Кол-во цилиндров:</div>
            <div className="price__body__btn" />
          </div>
          <div className="price__body__header">
            <div className="price__body__name" />
            <div className="price__body__value name--header"><p>4 <span>цилиндра</span></p></div>
            <div className="price__body__value name--header"><p>6 <span>цилиндров</span></p></div>
            <div className="price__body__value name--header"><p>8 <span>цилиндров</span></p></div>
            <div className="price__body__btn" />
          </div>
          {
            equipment.map((item, idx) =>
              (<PriceBlock 
                equipment={item}
                openDescription={openDescription}
                key={idx}
              />)
            )
          }          


          {/* <div className="price__body__block">
            <div className="price__body__row">
              <div className="price__body__name">OMVL</div>
              <div className="price__body__value">
                <label className="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div className="price__body__value">
                <label className="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div className="price__body__value">
                <label className="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div className="price__body__btn"><button className="btn-1 btn--blue"
                  onClick={openDescription}
                ><span className="price--open">Описание</span><span className="price--close">Закрыть</span>
                  <svg><use xlinkHref="img/sprite-icon.svg#icon-description" /></svg></button></div>
            </div>
            <div className="price__container">
              <div className="price__description">
                <p className="price__description__bcg">Gazoved</p>
                <div>
                  <h3 className="price__description__caption">Описание:</h3>
                  <p className="price__description__p">Качественное газобаллонное оборудование на авто – 
                    это не только залог минимизации транспортных расходов, но и надежность, долговечность 
                    топливной системы, увеличение ресурса двигателя, межсервисного интервала замены свечей 
                    зажигания и фильтров, снижение износа узлов мотора. Чтобы воспользоваться всеми этими 
                    преимуществами и гарантированно получить безотказное автогазовое оборудование, ГБО 
                    итальянской марки OMVL</p>
                  <h3 className="price__description__caption">Комплектация:</h3>
                  <ul className="price__description__ul">
                    <li>Редуктор Tomasetto Alaska до 140лс Италия</li>
                    <li>Форсунки lpg tech 2Om</li>
                    <li> Баллон 42 литра тор., либо 50 литров цилиндр</li>
                    <li>Полный пакет документов для ГИБДД</li>
                  </ul>
                </div>
              </div>
              <button className="price__description__btn" onClick={openDescription}>
                <svg>
                  <use xlinkHref="img/sprite-icon.svg#icon-arrow-up" />
                </svg>
              </button>
            </div>
          </div>
          <div className="price__body__block">
            <div className="price__body__row">
              <div className="price__body__name">Digitronic maxi2</div>
              <div className="price__body__value">
                <label className="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div className="price__body__value">
                <label className="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div className="price__body__value">
                <label className="input__check price__check"><input type="radio" name="check-gbo" /><span></span></label>
              </div>
              <div className="price__body__btn"><button className="btn-1 btn--blue"
                  onClick={openDescription}
                ><span className="price--open">Описание</span><span className="price--close">Закрыть</span>
                  <svg><use xlinkHref="img/sprite-icon.svg#icon-description" /></svg></button>
              </div>
            </div>
            <div className="price__container">
              <div className="price__description">
                <p className="price__description__bcg">Gazoved</p>
                <div>
                  <h3 className="price__description__caption">Описание:</h3>
                  <p className="price__description__p">Качественное газобаллонное оборудование на авто – 
                    это не только залог минимизации транспортных расходов, но и надежность, долговечность 
                    топливной системы, увеличение ресурса двигателя, межсервисного интервала замены свечей 
                    зажигания и фильтров, снижение износа узлов мотора. Чтобы воспользоваться всеми этими 
                    преимуществами и гарантированно получить безотказное автогазовое оборудование, ГБО 
                    итальянской марки OMVL</p>
                  <h3 className="price__description__caption">Комплектация:</h3>
                  <ul className="price__description__ul">
                    <li>Редуктор Tomasetto Alaska до 140лс Италия</li>
                    <li>Форсунки lpg tech 2Om</li>
                    <li> Баллон 42 литра тор., либо 50 литров цилиндр</li>
                    <li>Полный пакет документов для ГИБДД</li>
                  </ul>
                </div>
              </div>
              <button className="price__description__btn" onClick={openDescription}>
                <svg>
                  <use xlinkHref="img/sprite-icon.svg#icon-arrow-up" />
                </svg>
              </button>
            </div>
          </div> */}
          <div className="price__btn">
            <button className="btn-1"
              aria-label="заказать"
              onClick={onOpenModal}
            >Заказать</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Price;

