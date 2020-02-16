import React from 'react';

export default props => {
  return (
    <div class="header__nav">
      <nav class="main__nav">
        <ul>
          <li class="main__nav__notlink">
            <button class="main__nav__close"><span /><span /></button>
          </li>
          <li><a href="">Главная</a></li>
          <li><a href="">Услуги</a></li>
          <li><a href="">Фотогалерея</a></li>
          <li><a href="">Акции</a></li>
          <li><a href="">Контакты</a></li>
          <li><a href="">Наши работы</a></li>
          <li><a href="" class="nav--red">youtube</a></li>
        </ul>
      </nav>
      <div class="nav__social">
        <a class="nav__icon" href="">
          <svg>
            <use xlinkHref="img/sprite-icon.svg#icon-vk"></use>
          </svg>VK</a>
        <a class="nav__icon" href="">
          <svg>
            <use xlinkHref="img/sprite-icon.svg#icon-inst"></use>
          </svg>
          Instagram</a>
      </div>
    </div>
  );
}