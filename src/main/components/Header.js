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
    <header className="header">
      <div className="header__left">
        <div className="header__logo">
          <a href="/" className="header__logo__link">
            <img src="img/logo-blue.png" alt="Gazoved" />
          </a>
          <p><span>установка</span> газоболонного оборудования</p>
        </div>
        
        <div className="header__select">
          <Select defaultValue={props.activeCity.name} style={{width: 200}} onChange={handleChange}>
            {props.city.map((city) => {
              return <Option key={city.id} value={city.name}>{city.name}</Option>
            })}
          </Select>
          <div>
            {
              props.activeCity.addresses.map((a, idx) => {
                return (<p key={idx}>{a}</p>);
              })
            }
          </div>          
        </div>
      </div>
      <div className="header__right">
          <a className="header__phone" href={'tel:' + phone.link}>
            {phone.kod} <strong>{phone.number}</strong></a>
        <p className="header__clock">с {time.from} до {time.before}</p>
      </div>
    </header>
  );
}

export default Header;