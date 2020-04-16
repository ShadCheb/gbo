import React, { useState } from 'react';

const cylinderList = ['4', '6', '8'];

function BlockCheck({cylinders, cylinder, equipment, selectEquipment}) {
  return (cylinders.indexOf(cylinder) > -1)
    ? (
      <div className="price__body__value">
        <label className="input__check price__check" 
          onClick={selectEquipment.bind(this, {cylinder, equipment})}>
          <input type="radio" name="check-gbo" /><span></span></label>
      </div>
    )
    : (
      <div className="price__body__value"></div>
    );
}

function PriceBlock({equipment, openDescription, selectEquipment}) {
  let cylinderArray = (equipment.cylinder) 
    ? equipment.cylinder.split(',')
    : [];

  return (
    <div className="price__body__block">
      <div className="price__body__row">
        <div className="price__body__name">{equipment.name || 'Без названия'}</div>
        {
          cylinderList.map((cylinder, i) => (
            <BlockCheck 
              selectEquipment={selectEquipment}
              cylinders={cylinderArray} 
              cylinder={cylinder}
              equipment={equipment.name}
              key={i}
            />
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
  const [sendData, setSendData] = useState('');
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

  const selectEquipment = (data) => {
    if (data && data.cylinder) {
      let message = `Выбранное оборудование ${data.equipment || 'Без названия'}. Количество цилиндров ${data.cylinder}`;

      setSendData(message);
    }
  }

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
                selectEquipment={selectEquipment}
                key={idx}
              />)
            )
          }          

          <div className="price__btn">
            <button className="btn-1"
              data-type="Заказать установку оборудования"
              data-description={sendData}
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

