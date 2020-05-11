import React, { Component } from 'react';


class Employee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countWindow: 0,
      countAll: null,
      widthItem: 0,
      heightWindow: 0,
      listDot: [],
      pageGallery: 0,

      moveGallery: false,

      startGallery: 0,
      startShiftGallery: 0,
      shiftGallery: 0,

      windowGallery: React.createRef()
    }
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.resizeWindow);
    this.resizeWindow();
  } 
  
  resizeWindow = () => {
    let width = document.body.clientWidth;

    if (width > 768) {
      const c = 3;
      let countAll = (this.props.employeeList.length < c)
        ? 3 : this.props.employeeList.length;

      this.setValueGallery(countAll, c);
    } else if (width <= 768) {
      const c = 1;
      let countAll = this.props.employeeList.length;

      this.setValueGallery(countAll, c);
    }
  }

  setValueGallery = (countAll, c) => {
    let windowGallery = this.state.windowGallery.current;
    let widthWindow = windowGallery.offsetWidth;
    let widthItem = widthWindow / c;
    let listDot = new Array(Math.ceil(countAll / c)).fill(0).map((a, b) => b);
    let changeData = {
      widthItem,
      shiftGallery: -1 * this.state.pageGallery * widthItem * c,
    };

    if (c != this.state.countWindow) {
      changeData = Object.assign(changeData, {
        countAll,
        listDot,
        countWindow: c,
        shiftGallery: 0,
        pageGallery: 0
      });
    }

    this.setState(changeData);

    setTimeout(() => {this.setValueHeight()}, 1000);
  }

  setValueHeight = () => {
    let windowGallery = this.state.windowGallery.current;
    let heightWindow = windowGallery.firstChild.offsetHeight;

    this.setState({heightWindow})
  }

  onSelectDot = (num, e) => {
    e.preventDefault();
    
    let {widthItem, countWindow} = this.state;
    let shiftGallery = -1 * num * widthItem * countWindow;

    this.setState({pageGallery: num, shiftGallery});
  }

  onMouseDown = (e) => {
    let event = e;
    
    if (event.type == "touchstart") {
      event = event.touches[0] || event.changedTouches[0];
    }

    let startGallery = event.clientX;
    let startShiftGallery = this.state.shiftGallery;
    
    this.setState({
      startGallery,
      startShiftGallery,
      moveGallery: true});
  }

  onMouseUp = () => {
    if (!this.state.moveGallery)
      return;

    this.setState({
      startGallery: 0,
      startShiftGallery: 0,
      shiftGallery: this.state.startShiftGallery,
      moveGallery: false
    });
  }

  onMouseMove = (e) => {
    if (!this.state.moveGallery)
      return;

    let event = e;
    
    if (event.touches) {
      event = event.touches[0] || event.changedTouches[0];
    }

    let clientX = event.clientX;
    let start = this.state.startShiftGallery;
    let shift = clientX - this.state.startGallery;

    if (Math.abs(shift) > 150) {
      let {listDot, pageGallery, widthItem, countWindow} = this.state;
      let page = (shift > 0) 
        ? (pageGallery - 1)
        : (pageGallery + 1);

      if (page < 0) {
        page = 0;
      } else if (page > listDot.length - 1) {
        page = listDot.length - 1;
      }

      this.setState({
        pageGallery: page,
        startGallery: 0,
        startShiftGallery: 0,
        shiftGallery: -1 * page * widthItem * countWindow,
        moveGallery: false
      });

      return;
    }

    this.setState({shiftGallery: start + shift});
  }  


  render() {
    let employeeList = this.props.employeeList;
    let {widthItem, countAll, pageGallery} = this.state;

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
            <div className="gallery__window" ref={this.state.windowGallery} 
              style={{height: this.state.heightWindow + 'px'}}>
              <div className="gallery__list" 
                onMouseUp={this.onMouseUp}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseOut={this.onMouseUp}
                onTouchStart={this.onMouseDown}
                onTouchMove={this.onMouseMove}
                onTouchEnd={this.onMouseUp}
                onTouchCancel={this.onMouseUp}
                style={{
                  width: widthItem * countAll + 'px',
                  left: this.state.shiftGallery + 'px'
                }}>
                {
                  employeeList.map((employee, idx) => (
                    <div className="staff__block" key={idx} 
                      style={{width: widthItem + 'px'}}>
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
              </div>
            </div>
            { 
              (this.state.listDot.length > 1) && (
                <div className="gallery__dot">
                  {
                    this.state.listDot.map((dot, idx) => (
                      <a href="" 
                        className={pageGallery === idx ? 'active' : ''}
                        onClick={this.onSelectDot.bind(this, dot)} key={idx} />
                    ))
                  }
                </div>
              )
            }
          </div>
        </div>
      </section>
    );
  }
}

export default Employee;

