import React from 'react';

function WUpLink ({whatsup}) {
  // let link = `https://api.whatsapp.com/send?phone=${whatsup}&text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82,%20%D1%85%D0%BE%D1%87%D1%83%20%D1%83%D0%B7%D0%BD%D0%B0%D1%82%D1%8C%20%D1%81%D1%82%D0%BE%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D1%8C%20%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%81%D0%B2%D0%BE%D0%B9%20%D0%90%D0%92%D0%A2%D0%9E&source=&data=&app_absent=`;
  let link = `https://wa.me/${whatsup}`;

  return (
    <a href={link}
      className="link-fix__btn btn__wup"
    >
      <svg>
        <use xlinkHref="/img/sprite-icon.svg#icon-whatsup" />
      </svg>
    </a>
  );
}

function FixedBtn({phone, openModal}) {
  return (
    <div className="link-fix">
      {/* {
        (phone.whatsup)
          ? (<WUpLink whatsup={phone.whatsup}/>)
          : ('')
      } */}
      <a href={'tel:' + phone.link}
        className="link-fix__btn btn__call" 
      >
        <svg>
          <use xlinkHref="/img/sprite-icon.svg#icon-phone"></use>
        </svg>
      </a>
      {
        (openModal)
        ? (
          <button href="#0" 
            onClick={openModal}
            className="btn__calculate-cost pulse">Рассчитать стоимость</button>)
        : ('')
      }
    </div>
  );
}

export default FixedBtn;


