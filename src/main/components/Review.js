import React from 'react';


function Employee({reviewList, reviewVk}) {
  return (
    <section className="review">
      <div className="container">
        <div className="caption__container">
          <h2 className="caption__section">Отзывы</h2>
        </div>
        <div className="review__body">
          <div className="review__bcg-1 bcg--1"></div>
          <div className="review__bcg-2 bcg--2"></div>
          <div className="review__body__mask">
            {
              reviewList.map((review, idx) => 
                (<article className="review__block" key={idx}>
                  <div className="review__img">
                    <img src={review.avatar} alt={review.name}/>
                  </div>
                  <div className="review__text">
                    <p className="review__text__caption">{review.name}</p>
                    <p className="review__text__p">{review.review}</p>
                    <p className="review__text__date">{review.date}</p>
                  </div>
                </article>)
              )
            }
            {
              (reviewVk)
                ? (
                  <div className="review__btn">
                    <a className="btn-1 btn--blue" 
                      href={'https://vk.com/topic-' + reviewVk.id_group + '_' + reviewVk.id_token}
                      aria-label="Смотреть отзывы"
                      target="_blank"
                    >Больше отзывов</a>
                  </div>
                ) : ('')
            }
          </div>
        </div>
      </div>
    </section>
  );
}

export default Employee;

