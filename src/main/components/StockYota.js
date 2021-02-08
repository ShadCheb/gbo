import React from 'react';

function StockYota(props) {
  return (
    <section className="by-stock">
      <div className="container">
        <div className="by-stock__body">
          <div className="by-stock__caption">
            <h2>
              <span>Специальная цена</span>
              <span>от компании GAZOVED</span>
            </h2>
          </div>
          <div className="by-stock__text">
            <div>
              <p className="by-stock__yota">YOTA<strong>RED</strong></p>
              <p className="by-stock__description">самое простое и доступное газобалонное оборудование</p>
              <div className="by-stock__row">
                <div className="by-stock__col">
                  <p className="by-stock__price">23 800 рублей<strong>19 800</strong></p>
                </div>
                <div className="by-stock__col">
                  <ul className="by-stock__list">
                    <li>- гарантия 1 год</li>
                    <li>- возможно установить в рассрочку</li>
                    <li>- подойдет на любое авто до 170 лс</li>
                  </ul>
                </div>
              </div>
              <div className="by-stock__btn">
                <button className="btn-1 btn--white" 
                  data-type="Заказать установку ГБО по акции"
                  aria-label="Заказать установку"
                  onClick={props.open}
                >Заказать установку</button>
              </div>
            </div>
            <p className="by-stock__bcg">YOUTA RED</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StockYota;


