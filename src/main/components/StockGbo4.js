import React from 'react';

function StockGbo4(props) {
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
              <p className="by-stock__name">ГБО 4 поколения</p>
              <p className="by-stock__description">самое простое и доступное газобалонное оборудование</p>
              <div className="by-stock__row">
                <div className="by-stock__col">
                  <p className="by-stock__price-2">19 800 рублей</p>
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
                  data-type="Узнать подробнее про ГБО по акции"
                  aria-label="Узнать подробнее"
                  onClick={props.open}
                >Узнать подробнее</button>
              </div>
            </div>
            <p className="by-stock__bcg">YOUTA RED</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StockGbo4;


