import React from 'react';


function Map({activeCity}) {
  return (
    <section className="map">
      <div className="map__body">
        <div className="container">
          <div className="map__label">
            {(activeCity.phone)
              ? (<div className="map__label__phone">
                <a 
                  href={'tel:' + activeCity.phone.link}
                >{activeCity.phone.kod}<strong>{activeCity.phone.number}</strong></a>
              </div>)
              : ('')
            }
            {(activeCity.addresses)
              ? (<div className="map__label__address">
                <strong>г. {activeCity.name},</strong> 
                {
                  activeCity.addresses.map((address, idx) => {
                    return (<p key={idx}>{address.address}</p>);
                  })
                }
              </div>) 
              : ('')
            }
            { (activeCity.social) 
              ? (<div className="map__label__social">
                  {(activeCity.social.vk) 
                    ? (<a className="map__icon map--vk" 
                      href={activeCity.social.vk} target="_blank">
                      <svg>
                        <use xlinkHref="img/sprite-icon.svg#icon-vk"/>
                      </svg>VK</a>) 
                    : ('')
                  }
                  {(activeCity.social.instagram) 
                    ? (<a className="map__icon map--inst" 
                      href={activeCity.social.instagram} target="_blank">
                      <svg>
                        <use xlinkHref="img/sprite-icon.svg#icon-inst" />
                      </svg>Instagram</a>)
                    : ('')
                  }
                </div>)
              : ('')
            }
          </div>
        </div>
        <div className="map__container" id="map"></div>
      </div>
    </section>
  );
}

export default Map;

