import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function Header({activeCity, cityList}) {
  const selectCity = value => {
    let link = location.pathname;

    location.href = link + '?city=' + value;
  }

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__logo">
          <a href="/" className="header__logo__link">
            <img src="/img/logo-blue.png" alt="Gazoved" />
          </a>
          <p><span>установка</span> газоболонного оборудования</p>
        </div>
        
        <div className="header__select">
          <Select defaultValue={activeCity.brief} style={{width: 200}} onChange={selectCity}>
            {cityList.map((city) => {
              return <Option key={city.id} value={city.brief}>{city.name}</Option>
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