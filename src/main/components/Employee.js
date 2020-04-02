import React from 'react';


function Employee({employeeList}) {
  return (
    <section className="staff">
      <div className="staff__bcg-1" />
      <div className="container">
        <div className="staff__bcg-2 bcg--2" />
        <div className="caption__container">
          <div className="staff__caption">
            <h2 className="caption__section">Наша <strong>команда</strong></h2>
            <h3 className="caption__section-under">ведущие эксперты по газовому оборудованию</h3>
          </div>
        </div>
        <div className="staff__body">
          {
            employeeList.map((employee, idx) => (
              <div className="staff__block" key={idx}>
                <div className="staff__img">
                  <img src={'/images/' + employee.avatar} alt={employee.name || 'Имя не указано'} />
                </div>
                <div className="staff__label">
                  <p className="staff__label__name">{employee.name || 'Имя не указано'}</p>
                  <p className="staff__label__post">{employee.post || ''}</p>
                  <p className="staff__label__exp">{employee.experience || ''}</p>
                </div>
              </div>
            ))
          }


          {/* <div className="staff__block">
            <div className="staff__img">
              <img src="/img/staff/staff-1.jpg" alt="Иван Иванов" />
            </div>
            <div className="staff__label">
              <p className="staff__label__name">Иван Иванов</p>
              <p className="staff__label__post">мастер установки ГБО</p>
              <p className="staff__label__exp">опыт 5 лет</p>
            </div>
          </div>
          <div className="staff__block">
            <div className="staff__img">
              <img src="/img/staff/staff-1.jpg" alt="Иван Иванов" />
            </div>
            <div className="staff__label">
              <p className="staff__label__name">Иван Иванов</p>
              <p className="staff__label__post">мастер установки ГБО</p>
              <p className="staff__label__exp">опыт 5 лет</p>
            </div>
          </div>
          <div className="staff__block">
            <div className="staff__img">
              <img src="/img/staff/staff-1.jpg" alt="Иван Иванов" />
            </div>
            <div className="staff__label">
              <p className="staff__label__name">Иван Иванов</p>
              <p className="staff__label__post">мастер установки ГБО</p>
              <p className="staff__label__exp">опыт 5 лет</p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default Employee;

