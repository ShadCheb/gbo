import React from 'react';

function Footer({activeCity}) {
  let phone = activeCity.phone;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__body">
          <div className="footer__col">
            <div className="footer__logo">
              <a href="" className="footer__logo__link">
                <img src="/img/logo-white.png" alt="Gazoved" />
              </a>
              <p className="footer__logo__text">Качественная и надежная установка ГБО с Газовед</p>
            </div>
            <div className="footer__contact">
              { 
                phone && <p><a href={'tel:' + phone.link} className="footer__contact__phone">
                  {phone.kod} <strong>{phone.number}</strong></a></p>
              }
              {(activeCity.addresses)
                ? (<div className="footer__contact__address">г. {activeCity.name}, 
                  {
                    activeCity.addresses.map((address, idx) => {
                      return (<p key={idx}>{address.address}</p>);
                    })
                  }
                </div>)
                : ('')
              }
            </div>
          </div>
          <div className="footer__col foter__space">
            <div className="footer__pay">
              <a href="" className="footer__pay__type"><img src="/img/visa-mk-1.png" alt="Visa MasterCard" /></a>
              {/* :todo Сделать оплату онлайн */}
              {/* <button className="btn-1 btn--white">Оплата онлайн</button> */}
            </div>
            { (activeCity.social) 
              ? (<div className="footer__social">
                {
                  (activeCity.social.vk) 
                  ? (<a className="footer__icon map--vk" href={activeCity.social.vk} target="_blank">
                    <svg>
                      <use xlinkHref="/img/sprite-icon.svg#icon-vk" />
                    </svg>VK</a>)
                  : ('')
                }
                {
                  (activeCity.social.instagram) 
                    ? (<a className="footer__icon map--inst" href={activeCity.social.instagram} target="_blank">
                      <svg>
                        <use xlinkHref="/img/sprite-icon.svg#icon-inst" />
                      </svg>Instagram</a>)
                    : ('')
                }
              </div>)
              : ('')
            }
          </div>
        </div>
        <div className="footer__copy">© Газовед | 2020</div>
      </div>
    </footer>
  );
}

export default Footer;