import React from 'react';
import {Slider} from 'antd';
import InputMask from 'react-input-mask';


function Benefit(props) {
  let {consumption, mileage, petrolList, petrol} = props.data;
  let nextProps = {
    consumption, 
    mileage, 
    petrolList,
    petrol 
  };
  let benefit = {
    petrol: null,
    gas: null,
    result: null
  };
  const priceFuel = {
    gas: 21
  };

  priceFuel[petrolList[0]] = 42;
  priceFuel[petrolList[1]] = 45;

  const calculation = () => {
    let liter = nextProps.mileage * nextProps.consumption * 10;
    let pricePetrol = priceFuel[nextProps.petrol];
    let priceGas = priceFuel['gas'];

    benefit.petrol = separate(Math.round(liter * pricePetrol));
    benefit.gas = separate(Math.round(liter * priceGas));
    benefit.result = separate(Math.round(liter * (pricePetrol - priceGas)));
  };

  const changeData = (data) => {
    props.changeData(data);
  };

  const onSelctConsumption = value => {
    changeData({consumption: value});
    nextProps.consumption = value;
    calculation();
  };

  const onSelctMileage = value => {
    changeData({mileage: value});
    nextProps.mileage = value;
    calculation();
  };

  const onSelctPetrol = e => {
    if (e.target.tagName != 'INPUT')
      return;

    let value = e.target.value;

    changeData({petrol: value});
    nextProps.petrol = value;
    calculation();
  };

  const separate = (value) => {
    return ('' + value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  };

  calculation();

  const openModal = (e) => {
    props.openModal(e);
  };


  return(
    <section class="benefit">
      <div class="container">
        <div class="benefit__bcg bcg--1"></div>
        <div class="caption__container">
          <h2 class="caption__section benefit__caption">Рассчитай <strong>свою выгоду</strong></h2>
        </div>
        <div class="benefit__body">
          <div class="benefit__input">
            <div class="benefit__slider">
              <p class="benefit__label">Расход топлива (<span>{consumption}</span> литров на 100 км)</p>
              <div class="benefit__slider__container">
                <span>4</span>
                <Slider
                  min={4}
                  max={25}
                  onChange={onSelctConsumption}
                  value={consumption}
                />
                <span>25</span>
              </div>
            </div>
            <div class="benefit__slider">
              <p class="benefit__label">Пробег в год (<span>{mileage}</span> тыс. км)</p>
              <div class="benefit__slider__container">
                <p>0</p>
                <Slider
                  min={0}
                  max={150}
                  onChange={onSelctMileage}
                  value={mileage}
                />
                <p>150</p>
              </div>
            </div>
            <div class="benefit__checks">
              <p class="benefit__label">Тип бензина</p>
              <div class="benefit__checks__list">
                <label class="input__check benefit__check" onClick={onSelctPetrol}>
                  <p>АИ-92</p><input type="radio" name="check" value={petrolList[0]}
                    checked={petrol==petrolList[0]} />
                  <span />
                </label>
                <label class="input__check benefit__check" onClick={onSelctPetrol}>
                  <p>АИ-95</p><input type="radio" name="check" value={petrolList[1]} 
                    checked={petrol==petrolList[1]} />
                  <span />
                </label>
              </div>
            </div>
          </div>
          <div class="benefit__result">
            <div class="benefit__result-1">
              <p class="benefit__result__name-1">Расход на бензине</p>
              <p class="benefit__result__value-1"><span>{benefit.petrol}</span> руб/год</p>
            </div>
            <div class="benefit__result-1">
              <p class="benefit__result__name-1">Расход на газу</p>
              <p class="benefit__result__value-1"><span>{benefit.gas}</span> руб/год</p>
            </div>
            <div class="benefit__result-2">
              <p class="benefit__result__name-2">Экономия</p>
              <p class="benefit__result__value-2"><span>{benefit.result}</span> руб/год</p>
            </div>
          </div>
        </div>
        <div class="benefit__result__btn">
          <form class="benefit__btn__form">
            <label class="form__input">
              <InputMask mask="+7 (999) 999-99-999" type="text" name="phone" required />
              <span>Телефон</span>
            </label>
            <button class="btn-1" 
              aria-label="Открыть модальное окно"
              onClick={openModal}
            >Начать экономить</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Benefit;