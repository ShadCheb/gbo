import React from 'react';

export default ({showMenu, closeMenu, social}) => {
  const clickDefault = (e) => {
    e.stopPropagation();
  }

  return (
    <div className="header__nav">
      <nav className={(showMenu) ? 'main__nav active' : 'main__nav'}
        onClick={closeMenu}
      >
        <ul onClick={clickDefault}>
          <li className="main__nav__notlink">
            <button className="main__nav__close" onClick={closeMenu}><span /><span /></button>
          </li>
          <li><a href="/">Главная</a></li>
          <li><a href="/services">Услуги</a></li>
          {/* <li><a href="#0">Фотогалерея</a></li> */}
          <li><a href="/stock">Акции</a></li>
          <li><a href="/contact">Контакты</a></li>
          <li><a href="/work">Наши работы</a></li>
          {
            (social && social.youtube) 
              ? (<li><a href={social.youtube} 
                className="nav--red" target="_blank">youtube</a></li>)
              : ('')
          }
        </ul>
      </nav>
      { (social) 
          ? (
            <div className="nav__social">
              {
                (social.vk) 
                ? (<a className="nav__icon" href={social.vk} target="_blank">
                  <svg>
                    <use xlinkHref="img/sprite-icon.svg#icon-vk"></use>
                  </svg>VK</a>)
                : ('')
              }
              {
                (social.instagram) 
                  ? (<a className="nav__icon" href={social.instagram} target="_blank">
                    <svg>
                      <use xlinkHref="img/sprite-icon.svg#icon-inst"></use>
                    </svg>
                    Instagram</a>)
                  : ('')
              }
              {
                (social.youtube) 
                  ? (<a className="nav__icon" href={social.youtube} target="_blank">
                  <svg>
                    <use xlinkHref="img/sprite-icon.svg#icon-youtube"></use>
                  </svg>
                  Youtube</a>)
                  : ('')
              }
            </div> 
          ) : ('')
      }
    </div>
  );
}