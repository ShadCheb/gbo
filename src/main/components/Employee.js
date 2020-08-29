import React, { Component } from 'react';

import Gallery from './Gallery';

class Employee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widthItem: 0,
    }
  }

  onChangeWidth = (widthItem) => {
    this.setState({ widthItem });
  }

  render() {
    let employeeList = this.props.employeeList;
    let { widthItem } = this.state;

    return (
      <section className="staff" id="employee">
        <div className="staff__bcg-1" />
        <div className="container">
          <div className="staff__bcg-2 bcg--1" />
          <div className="caption__container">
            <div className="staff__caption">
              <h2 className="caption__section">Наша <strong>команда</strong></h2>
              <h3 className="caption__section-under">ведущие эксперты по газовому оборудованию</h3>
            </div>
          </div>
          <div className="staff__body">
            <Gallery
              length={employeeList.length}
              onChangeWidth={this.onChangeWidth}
            >
              {
                employeeList.map((employee, idx) => (
                  <div className="staff__block" key={idx} 
                    style={{ width: widthItem + 'px' }}>
                    <div className="staff__img">
                      <img src={'/images/' + (employee.avatar || 'not-photo.png')} 
                        alt={employee.name || 'Имя не указано'} />
                    </div>
                    <div className="staff__label">
                      <p className="staff__label__name">{employee.name || 'Имя не указано'}</p>
                      <p className="staff__label__post">{employee.post || ''}</p>
                      <p className="staff__label__exp">{employee.experience || ''}</p>
                    </div>
                  </div>
                ))
              }
            </Gallery>
          </div>
        </div>
      </section>
    );
  }
}

export default Employee;

