import React from 'react';

function Footer(props) {
  let phone = props.activeCity.phone;
  let time = props.activeCity.time;

  return (
    <footer class="footer">
      <div class="container">
        <div class="footer__body">
          <div class="footer__col">
            <div class="footer__logo">
              <a href="" class="footer__logo__link">
                <img src="img/logo-white.png" alt="Gazoved" />
              </a>
              <p class="footer__logo__text">Качественная и надежная установка ГБО с Газовед</p>
            </div>
            <div class="footer__contact">
              { 
                phone && <p><a href={'tel:' + phone.link} class="footer__contact__phone">
                  {phone.kod} <strong>{phone.number}</strong></a></p>
              }
              
              <p class="footer__contact__address">г. {props.activeCity.name}, 
                {
                  props.activeCity.addresses.map(a => {
                    return (<span>{a}</span>);
                  })
                }
              </p>
            </div>
          </div>
          <div class="footer__col foter__space">
            <div class="footer__pay">
              <a href="" class="footer__pay__type"><img src="img/visa-mk-1.png" alt="Visa MasterCard" /></a>
              <button class="btn-1 btn--white">Оплата онлайн</button>
            </div>
            <div class="footer__social">
              <a class="footer__icon map--vk" href={props.activeCity.social.vk} target="_blank">
                <svg>
                  <use xlinkHref="img/sprite-icon.svg#icon-vk" />
                </svg>VK</a>
              <a class="footer__icon map--inst" href={props.activeCity.social.instagram} target="_blank">
                <svg>
                  <use xlinkHref="img/sprite-icon.svg#icon-inst" />
                </svg>Instagram</a>
            </div>
          </div>
        </div>
        <div class="footer__copy">© Газовед | 2018</div>
      </div>
    </footer>
  );
}

export default Footer;