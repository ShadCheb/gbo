import React from 'react';

function Stock(props) {
  return (
    <section className="b-stock">
      <div className="b-stock__bcg-1"></div>
      <div className="container">
        <div className="b-stock__bcg-2"></div>
        <div className="b-stock__body">
          <div className="b-stock__caption">
            <h2>
              <span>Акция</span>
              <span>от компании</span>
              <span>GAZOVED</span>
            </h2>
          </div>
          <div className="b-stock__text">
            {/* <p className="bs__text-1">Итальянский комплект</p> */}
            <p className="bs__text-1"><strong>OMVL SAVER</strong></p>
            <p className="bs__text-2">всего за <strong>25 600</strong> рублей</p>
            <div className="b-stock__btn">
              <button className="btn-1 btn--white" 
                data-type="Заказать установку ГБО по акции"
                aria-label="Заказать установку"
                onClick={props.open}
              >Заказать установку</button>
            </div>
          </div>
        </div>
        <div className="b-stock__footer">
          <div className="b-stock__list">
            <p>В комплект включены:</p>
            <ul>
              <li>- электроника OMVL</li>
              <li>- редуктор Nordic</li>
              <li>- форсунки Reg Fast</li>
              <li>- магистраль Cталь</li>
              <li>- баллон 42л</li>
              <li>- мультиклапан Евро</li>
            </ul>
          </div>
          <div className="b-stock__img">
            <img src="/img/stock.png" />
          </div>
          {/* <div className="b-stock__col">
            <p>&nbsp;</p>
            <p className="b-stock__label">Только оригинальное оборудование, подлинность комплектующих можно 
                проверить на официальном сайте <a href="https://www.digitronicgas.ru/proverit-oborudovanie-gbo/" 
                target="_blank">Digitronic</a>
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default Stock;


