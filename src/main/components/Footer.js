import React from 'react';

function Footer(props) {
  let phone = props.activeCity.phone;
  let time = props.activeCity.time;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__body">
          <div className="footer__col">
            <div className="footer__logo">
              <a href="" className="footer__logo__link">
                <img src="img/logo-white.png" alt="Gazoved" />
              </a>
              <p className="footer__logo__text">Качественная и надежная установка ГБО с Газовед</p>
            </div>
            <div className="footer__contact">
              { 
                phone && <p><a href={'tel:' + phone.link} className="footer__contact__phone">
                  {phone.kod} <strong>{phone.number}</strong></a></p>
              }
              
              <p className="footer__contact__address">г. {props.activeCity.name}, 
                {
                  props.activeCity.addresses.map((a, idx) => {
                    return (<span key={idx}>{a}</span>);
                  })
                }
              </p>
            </div>
          </div>
          <div className="footer__col foter__space">
            <div className="footer__pay">
              <a href="" className="footer__pay__type"><img src="img/visa-mk-1.png" alt="Visa MasterCard" /></a>
              <button className="btn-1 btn--white">Оплата онлайн</button>
            </div>
            <div className="footer__social">
              <a className="footer__icon map--vk" href={props.activeCity.social.vk} target="_blank">
                <svg>
                  <use xlinkHref="img/sprite-icon.svg#icon-vk" />
                </svg>VK</a>
              <a className="footer__icon map--inst" href={props.activeCity.social.instagram} target="_blank">
                <svg>
                  <use xlinkHref="img/sprite-icon.svg#icon-inst" />
                </svg>Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer__copy">© Газовед | 2018</div>
      </div>
    </footer>
  );
}

export default Footer;