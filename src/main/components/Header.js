import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function Header(props) {
  let phone = props.activeCity.phone;
  let time = props.activeCity.time;

  const handleChange = value => {
    props.handleChange(value);
  }

  return (
    <header class="header">
      <div class="header__left">
        <div class="header__logo">
          <a href="/" class="header__logo__link">
            <img src="img/logo-blue.png" alt="Gazoved" />
          </a>
          <p><span>установка</span> газоболонного оборудования</p>
        </div>
        
        <div class="header__select">
          <Select defaultValue={props.activeCity.id} style={{width: 200}} onChange={handleChange}>
            {props.city.map((city) => {
              return <Option key={city.id} value={city.id}>{city.name}</Option>
            })}
          </Select>
          <div>
            {
              props.activeCity.addresses.map(a => {
                return (<p>{a}</p>);
              })
            }
          </div>          
        </div>
      </div>
      <div class="header__right">
          <a class="header__phone" href={'tel:' + phone.link}>
            {phone.kod} <strong>{phone.number}</strong></a>
        <p class="header__clock">с {time.from} до {time.before}</p>
      </div>
    </header>
  );
}

export default Header;