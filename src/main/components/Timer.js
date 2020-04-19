import React from 'react';


function Timer({id}) { 
  let timer = null;

  const num2str = (n, text) => {  
    n = Math.abs(n) % 100; var n1 = n % 10;
    if (n > 10 && n < 20) { return text[2]; }
    if (n1 > 1 && n1 < 5) { return text[1]; }
    if (n1 == 1) { return text[0]; }

    return text[2];
  }

  const getTimeRemaining = (endtime) => {
    let t = Date.parse(endtime) - Date.parse(new Date());
    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    let days = Math.floor(t / (1000 * 60 * 60 * 24));

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }
   
  const initializeClock = (endtime) => {
    let clock = timer;
    let daysSpan = clock.querySelector('.timer--days .timer__time');
    let hoursSpan = clock.querySelector('.timer--hours .timer__time');
    let minutesSpan = clock.querySelector('.timer--minutes .timer__time');
    let secondsSpan = clock.querySelector('.timer--seconds .timer__time');

    let daysText = clock.querySelector('.timer--days .timer__text');
    let hoursText = clock.querySelector('.timer--hours .timer__text');
    let minutesText = clock.querySelector('.timer--minutes .timer__text');
    let secondsText = clock.querySelector('.timer--seconds .timer__text');

   
    function updateClock() {
      let t = getTimeRemaining(endtime);

      const daysList = ['день', 'дня', 'дней'];
      const hoursList = ['час', 'часа', 'часов'];
      const minutesList = ['минута', 'минуты', 'минут'];
      const secondsList = ['секунда', 'секунды', 'секунд'];

      if (t.total <= 0) {
        timer.classList.add('hidden');

        return true;
      }
   
      daysSpan.textContent = t.days;
      hoursSpan.textContent = ('0' + t.hours).slice(-2);
      minutesSpan.textContent = ('0' + t.minutes).slice(-2);
      secondsSpan.textContent = ('0' + t.seconds).slice(-2);

      daysText.textContent = num2str(t.days, daysList);
      hoursText.textContent = num2str(t.hours, hoursList);
      minutesText.textContent = num2str(t.minutes, minutesList);
      secondsText.textContent = num2str(t.seconds, secondsList);

      if (t.total > 0) {
        setTimeout(updateClock, 1000);
      }
    }
   
    updateClock();
  }

  const init = () => {
    if (!timer) {
      timer = document.getElementById(id);

      setTimeout(init, 400);
    } else {
      let d = new Date();
      const lostDay = 7 - d.getDay();
      const offset = 3;
      const endTime = d.setHours(23, 59, 59, 999);
      const lostTime = endTime - d.setTime((d.getTime()) + 
        (d.getTimezoneOffset() * 60 * 1000) + (1000 * 60 * 60 * offset));
      const deadline = new Date(d.setDate(lostDay + d.getDate()) + lostTime);

      initializeClock(deadline);
    }
  }

  init();


  return(
    <article className="timer" id="timer">
      <div className="timer__number timer--days">
        <span className="timer__time"></span>
        <span className="timer__text">дней</span>
      </div>
      <div className="timer__number timer--hours">
        <span className="timer__time"></span>
        <span className="timer__text">часов</span>
      </div>
      <div className="timer__number timer--minutes">
        <span className="timer__time"></span>
        <span className="timer__text">минут</span>
      </div>
      <div className="timer__number timer--seconds">
        <span className="timer__time"></span>
        <span className="timer__text">секунд</span>
      </div>
    </article>
  );
}

export default Timer;