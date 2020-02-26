import React from 'react';

export default props => {
  return (
    <div class="header__nav">
      <nav class="main__nav">
        <ul>
          <li class="main__nav__notlink">
            <button class="main__nav__close"><span /><span /></button>
          </li>
          <li><a href="#0">Главная</a></li>
          <li><a href="#0">Услуги</a></li>
          <li><a href="#0">Фотогалерея</a></li>
          <li><a href="#0">Акции</a></li>
          <li><a href="#0">Контакты</a></li>
          <li><a href="#0">Наши работы</a></li>
          <li><a href={props.social.youtube} 
            class="nav--red" target="_blank">youtube</a></li>
        </ul>
      </nav>
      <div class="nav__social">
        <a class="nav__icon" href={props.social.vk} target="_blank">
          <svg>
            <use xlinkHref="img/sprite-icon.svg#icon-vk"></use>
          </svg>VK</a>
        <a class="nav__icon" href={props.social.instagram} target="_blank">
          <svg>
            <use xlinkHref="img/sprite-icon.svg#icon-inst"></use>
          </svg>
          Instagram</a>
      </div>
    </div>
  );
}