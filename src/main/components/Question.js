import React from 'react';

function Question(props) {
  let activeQuestion = null;

  const openQuestion = (e) => {
    let target = e.target;
    let question = target.closest('.question__block');

    if (question.classList.contains('active')) {
      question.classList.remove('active');

      return;
    }

    if (activeQuestion) {
      activeQuestion.classList.remove('active');
    }

    question.classList.add('active');
    activeQuestion = question;
  };

  return (
    <section className="question">
      <div className="container">
        <div className="caption__container">
          <h2 className="caption__section question__caption">Часто задаваемые <strong>вопросы</strong></h2>
        </div>
        <div className="question__body" onClick={openQuestion} onMouseUp={e => e.preventDefault()}>
          <div className="question__block">
            <div className="question__header">
              <button className="question__btn">
                <span></span>
                <span></span>
              </button>
              <h2 className="question__name">Вредит ли газ двигателю?</h2>
            </div>
            <div className="question__text">
              <div>
                <p className="question__text__main">Газ не только не вредит двигателю автомобиля, а наоборот в некоторых 
                  случаях увеличивает ресурс его работы.</p>
                <ul className="question__text__ul">
                  <li>1. Необходимо правильно подобрать оборудование согласно типу, объему и мощности 
                    автомобиля.</li>
                  <li>2. Корректно установить оборудование на автомобиль</li>
                  <li>3. И самое важное, с пониманием и точностью настроить совокупную работу автомобиля 
                    и газобаллонного оборудования.</li>
                </ul>
                <p className="question__text__p">При соблюдении всех вышеуказанных условий Ваш автомобиль верой и 
                  правдой будет служить Вам долгое время.
                </p>
              </div>
            </div>
          </div>

          <div className="question__block">
            <div className="question__header">
              <button className="question__btn">
                <span></span>
                <span></span>
              </button>
              <h2 className="question__name">Вредит ли газ двигателю?</h2>
            </div>
            <div className="question__text">
              <div>
                <p className="question__text__main">Газ не только не вредит двигателю автомобиля, а наоборот в некоторых 
                  случаях увеличивает ресурс его работы.</p>
                <ul className="question__text__ul">
                  <li>1. Необходимо правильно подобрать оборудование согласно типу, объему и мощности 
                    автомобиля.</li>
                  <li>2. Корректно установить оборудование на автомобиль</li>
                  <li>3. И самое важное, с пониманием и точностью настроить совокупную работу автомобиля 
                    и газобаллонного оборудования.</li>
                </ul>
                <p className="question__text__p">При соблюдении всех вышеуказанных условий Ваш автомобиль верой и 
                  правдой будет служить Вам долгое время.
                </p>
              </div>
            </div>
          </div>

          <div className="question__block">
            <div className="question__header">
              <button className="question__btn">
                <span></span>
                <span></span>
              </button>
              <h2 className="question__name">Вредит ли газ двигателю?</h2>
            </div>
            <div className="question__text">
              <div>
                <p className="question__text__main">Газ не только не вредит двигателю автомобиля, а наоборот в некоторых 
                  случаях увеличивает ресурс его работы.</p>
                <ul className="question__text__ul">
                  <li>1. Необходимо правильно подобрать оборудование согласно типу, объему и мощности 
                    автомобиля.</li>
                  <li>2. Корректно установить оборудование на автомобиль</li>
                  <li>3. И самое важное, с пониманием и точностью настроить совокупную работу автомобиля 
                    и газобаллонного оборудования.</li>
                </ul>
                <p className="question__text__p">При соблюдении всех вышеуказанных условий Ваш автомобиль верой и 
                  правдой будет служить Вам долгое время.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Question;

