import React from 'react';
import { Select } from 'antd';

import 'antd/es/select/style/css'; 

const { Option } = Select;

function YaSprav({cityBrief}){
  switch (cityBrief) {
    case 'cheboksary':
      return (
        <article className="ya-sprav">
          <iframe src="https://yandex.ru/sprav/widget/rating-badge/183460183052" width="150" height="50" frameBorder="0" />
        </article>
      );
    case 'yoshkar-ola':
      return (
        <article className="ya-sprav">
          <iframe src="https://yandex.ru/sprav/widget/rating-badge/103103368963" width="150" height="50" frameBorder="0" />
        </article>
      );
    case 'Nizhnii-Novgorod':
      return (
        <article className="ya-sprav">
          <iframe src="https://yandex.ru/sprav/widget/rating-badge/4617431402" width="150" height="50" frameBorder="0" />
        </article>);
    default: 
      return ('');
  }
}

function Header({activeCity, cityList}) {
  const selectCity = value => {
    // Определяем localhost ли
    let link = '';

    if (location.href.includes('localhost')) {
      const linkGroup = location.href.match(/(www\.*)*([a-zA-Z0-9-]*.)(\.*localhost){1}(:[0-9]+){1}(\/*[a-zA-Z0-9-/]*)/);

      link = `${location.protocol}//${(linkGroup[1] || '')}${value}.${linkGroup[3]}${linkGroup[4] || ''}${linkGroup[5]}`;
    } else {
      const linkGroup = location.href.match(/(www\.*)*([a-zA-Z0-9-]*.)(\.*gazoved.com){1}(\/*[a-zA-Z0-9-\/]*)/);

      link = location.protocol + '//' + (linkGroup[1] || '') + value + '.' + linkGroup[3] + linkGroup[4];      
    }
    window.location.href = link;
  }

  return (
    <header className="header">
      <YaSprav cityBrief={activeCity.brief}/>

      <div className="header__left">
        <div className="header__logo">
          <a href="/" className="header__logo__link">
            <img src="/img/logo-blue.png" alt="Gazoved" />
          </a>
          <p><span>установка</span> газоболонного оборудования</p>
        </div>
        
        <div className="header__select">
          <Select defaultValue={activeCity.subdomain} style={{width: 200}} onChange={selectCity}>
            {cityList.map((city) => {
              return <Option key={city.id} value={city.subdomain}>{city.name}</Option>
            })}
          </Select>
          <div>
            {
              activeCity.addresses && activeCity.addresses.map((address, idx) => {
                return (<p key={idx}>{address.address}</p>);
              })
            }
          </div>          
        </div>
      </div>
      <div className="header__right">
        { 
          (activeCity.phone)
            ? (<a className="header__phone" href={'tel:' + activeCity.phone.link}>
                {activeCity.phone.kod} <strong>{activeCity.phone.number}</strong></a>) 
            : ('')  
        }
        {
          (activeCity.time)
            ? (<p className="header__clock">с {activeCity.time.from} до {activeCity.time.before}</p>) 
            : ('')
        }
      </div>
    </header>
  );
}

export default Header;