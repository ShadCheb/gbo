import React, { useState, useEffect, useRef } from 'react';

import Gallery from './Gallery';

const noPhoto = 'not-photo.jpg';

function BlockCheck({ cylinder, selectEquipment, idx, name }) {
  const count = ['4x', '6x', '8x']
  const separator = (number) => (
    (number.toString()).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
  )

  return (cylinder)
    ? (
      <div className="price__body__value price__check">
        <div className="price__count">{count[idx]}</div>
        <label className="input__radio">
          <input type="radio" name={name}
            onClick={selectEquipment.bind(this, ({ cylinder, count: count[idx] }))} /><span></span>
          <p>от <strong>{separator(cylinder)} руб</strong></p>
        </label>
      </div>
    ) : (
      <div className="price__body__value price__check"></div>
    )
}

function PriceBlock({ equipment, onPayment, onOrder }) {
  const [widthItem, setWidthItem] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectAdd, setSelectAdd] = useState([]);
  const [selectCylinder, setSelectCylinder] = useState(0);
  const [costComposition, setCostComposition] = useState(0);
  const [sendData, setSendData] = useState('');

  let cylinderArray = (equipment.cylinder) 
    ? equipment.cylinder.split(',')
    : [];
  const onSelectCylinder = (data) => {
    setSelectCylinder(data);
  }
  const onVisible = () => {
    setVisible(!visible);
  }
  const separator = (number) => (
    number.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
  )
  // Заказ
  const onOrderEquipment = (e) => {
    let message = `Выбранное оборудование: ${equipment.name || 'Без названия'}. `

    if (selectCylinder) {
      `Количество цилиндров ${selectCylinder.count}. Стоимость оборудования ${selectCylinder.cylinder}`;
    }
    if (selectAdd && selectAdd.length) {
      message += `Выбрано дополнительное оборудование: `;

      selectAdd.map((add, idx) => {
        if (!idx) message += `${add.name} (${add.price} руб)`;
        else message += `, ${add.name} (${add.price} руб)`;
      });
    }

    setSendData(message);
    onOrder(e);
  }
  const onSelectCompositionAdd = (composition, e) => {
    const checked = e.target.checked;
    
    if (checked) {
      let cost = +composition.price + +costComposition;

      setSelectAdd([ ...selectAdd, composition ]);
      setCostComposition(cost);
    } else {
      let compositions = selectAdd.filter(t => t.composition_id !== composition.composition_id);
      let cost = +costComposition -  +composition.price;

      setSelectAdd(compositions);
      setCostComposition(cost);
    }
    
  }

  return (
    <div className={visible ? 'price__body__block active' : 'price__body__block' }>
      <div className="price__body__content">
        <div className="price__body__name">
          <p className="price__body__name__title">{ equipment.name || 'Без названия' }</p>
          {
            equipment.summary
              ? (<p className="price__body__name__summary">{ equipment.summary }</p>) : null
          }
          {
            equipment.tagline
              ? (<div className="price__body__name__tagline">{ equipment.tagline }</div>) : null
          }
          <div className="price__body__grow">
            <p><a className="price__body__name__more price--desctop"
              onClick={onVisible}
            >Подробнее</a></p>
          </div>
        </div>
        <div className="price__body__price">
          <div className="price__body__row">
            {
              // cylinderList.map((cylinder, i) => (
              cylinderArray.map((cylinder, i) => (
                <BlockCheck 
                  name={equipment.id}
                  selectEquipment={onSelectCylinder}
                  cylinder={cylinder}
                  key={i}
                  idx={i}
                />
              ))
            }
          </div>
          <div className="price__body__btn">
            <a className="price__body__name__more price--mobile"
              onClick={onVisible}
            >Подробнее</a>
            <div />
            <button 
              className="btn-1 btn--blue-border"
              data-type="Оформить рассрочку"
              data-description={sendData}
              aria-label="рассрочка"
              onClick={onOrderEquipment}
            >
              <span className="price--desctop">Оформить рассрочку</span>
              <span className="price--mobile">Рассрочка</span>
            </button>
            <button 
              className="btn-1 btn--blue"
              data-type="Оформить заявку"
              data-description={sendData}
              aria-label="заявка"
              onClick={onOrderEquipment}
            >
              <span className="price--desctop">Оставить заявку</span>
              <span className="price--mobile">Заявка</span>
            </button>
          </div>
        </div>
      </div>
      {
        visible
        ? (
          <>
            <div className="price__description">
              <p className="price__description__bcg">Gazoved</p>
              <div>
                <div className="price__description__text">
                  <h2>Описание:</h2>
                  <div dangerouslySetInnerHTML={{__html: equipment.description}} />
                </div>
                {
                  equipment.composition_main && equipment.composition_main.length
                    ? (
                      <div className="price__description__text">
                        <h2>Комплектация:</h2>
                        <Gallery
                          countLarge={3}
                          countMiddle={2}
                          countSmall={1}
                          length={equipment.composition_main.length}
                          onChangeWidth={setWidthItem}
                        >
                          {
                            equipment.composition_main.map(composition => (
                              <div 
                                className="composition__item" 
                                key={composition.composition_id}
                                style={{ width: widthItem + 'px' }}
                              >
                                <div>
                                  <div className="composition__img">
                                    <img 
                                      src={composition.image && '/images/' + composition.image.name || '/images/' + noPhoto}
                                      alt={composition.name}
                                    />
                                  </div>
                                  <div className="composition__name">{composition.name}</div>
                                </div>
                              </div>
                            ))
                          }
                        </Gallery>
                      </div>
                    ) : null
                }
                {
                  equipment.composition_add && equipment.composition_add.length
                    ? (
                      <div className="price__description__text">
                        <h2>Дополнительно можно установить:</h2>
                        <Gallery 
                          countLarge={3}
                          countMiddle={2}
                          countSmall={1}
                          length={equipment.composition_add.length}
                        >
                          {
                            equipment.composition_add.map(composition => (
                              <div className="composition__item" key={composition.composition_id}>
                                <div>
                                  <div className="composition__img">
                                    <img 
                                      src={composition.image && '/images/' + composition.image.name || '/images/' + noPhoto}
                                      alt={composition.name}
                                    />
                                  </div>
                                  <div className="composition__name-add">
                                    <label className="input__check composition__check">
                                      <input type="checkbox" name="check" 
                                        value={composition.composition_id} 
                                        onClick={(e) => onSelectCompositionAdd(composition, e)}
                                      /><span />
                                    </label>{composition.name}
                                    <div className="composition__price">{composition.price && (separator(composition.price) + ' р.') || '0 р.'}</div>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </Gallery>
                      </div>
                    ) : null
                }
                <div className="price__description__total">
                  { selectCylinder 
                    ? (<p>Итого: <span>{separator(+selectCylinder.cylinder + costComposition)} руб</span></p>) 
                    : null }
                  <button className="btn-1"
                    data-type="Заказать установку оборудования"
                    data-description={sendData}
                    aria-label="заказать"
                    onClick={onOrderEquipment}
                  >Заказать</button>
                </div>
              </div>
            </div>
            <button className="price__description__btn" onClick={onVisible}>
              <svg>
                <use xlinkHref="/img/sprite-icon.svg#icon-arrow-up" />
              </svg>
            </button>
          </>
        ) : null
      }
    </div>
  );
}

let isDistance = false;

function Price({ openModal, equipment }) {
  const [isLoadComponent, setIsLoadComponent] = useState(false);
  const header = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    if (!isLoadComponent) {
      setIsLoadComponent(true);
      window.addEventListener('scroll', scrollWindow);
    }
  });

  const onOpenModal = (e) => {
    openModal(e);
  };

  const scrollWindow = () => {
    if (!container && !header)
      return;

    const R = header.current.getBoundingClientRect();
    const Ra = container.current.getBoundingClientRect();

    if (Ra.top <= 0 && Ra.bottom - R.height >= 0) {
      const distance = 0 - Ra.top;
      if (!isDistance) {
        isDistance = true;
      }
      header.current.style = `top: ${distance}px;`;
    } else if (isDistance && Ra.top > 0) {
      header.current.style = 'top: 0px;';
      isDistance = false;
    } else if (isDistance && Ra.top < 0) {
      header.current.style = `top: ${Ra.height - R.height}px;`;
      isDistance = false;
    }
  }

  return (
    <section className="price">
      <div className="container">
        <div className="caption__container">
          <h2 className="caption__section">Оборудование ГБО</h2>
        </div>
        <div className="price__body">
          <div className="price__body__header" ref={header}>
            <div className="price__body__value name--header"><p>4 <span>цилиндра</span></p></div>
            <div className="price__body__value name--header"><p>6 <span>цилиндров</span></p></div>
            <div className="price__body__value name--header"><p>8 <span>цилиндров</span></p></div>
          </div>

          <div className="price__body__body" ref={container}>
            {
              equipment.map((item, idx) =>
                (<PriceBlock 
                  equipment={item}
                  onPayment={onOpenModal}
                  onOrder={onOpenModal}
                  key={idx}
                />)
              )
            }
          </div>   

          {/* <div className="price__btn">
            <button className="btn-1"
              data-type="Заказать установку оборудования"
              data-description={sendData}
              aria-label="заказать"
              onClick={onOpenModal}
            >Заказать</button>
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default Price;

