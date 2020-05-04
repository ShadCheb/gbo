import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Popconfirm, message } from 'antd';
import { FormOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import ModalAddEmployee from './ModalAddEmployee';

class Employee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleAddEmployee: false,
      openEmployeeData: {},
    }
  }

  error = (msg) => {
    message.error(msg);
  };

  deleteEmployee = (employee) => {
    let id = employee.id;

    this.props.setLoading(true);

    fetch('/admin/employee/' + id, {
      method: 'delete',
      headers: {
        'X-XSRF-TOKEN': this.props.csrf
      }
    })
      .then(() => {
        this.props.setLoading(false);

        let employee = this.props.data.employee.slice();

        employee = employee.filter(a => a.id !== id);
        this.props.handlerChangesData({employee});
      })
      .catch(e => {
        this.props.setLoading(false);
        
        if (e.error)
          this.props.handlerChangesData(e.error);
      })
  }


  openModalAddEmployee = (employee, idx) => {
    let openEmployee = {};

    if (!employee) {
      openEmployee = {
        cityListId: this.props.data.cityListId
      }
    } else {
      openEmployee = Object.assign({}, employee);
      openEmployee['idx'] = idx;
    }

    if (openEmployee.avatar) {
      openEmployee['fileList'] = [{
        uid: '-1',
        name: openEmployee.avatar,
        status: 'done',
        url: openEmployee.avatar,
      }]; 
    }

    this.setState(() => {
      return ({
        openEmployeeData: openEmployee,
        visibleAddEmployee: true
      });
    });
  }

  closeModalAddEmployee = () => {
    this.setState({visibleAddEmployee: false});
  }

  changeValue = (obj) => {
    let openEmployeeData = this.state.openEmployeeData;

    for(let key in obj) {
      Object.assign(openEmployeeData, {[key]: obj[key]})
    }
    this.setState(openEmployeeData);
  }

  render() {
    let emloyeeList = this.props.data.employee || [];
    
    return (
      <section>
        <div>
          {emloyeeList.map((empl, idx) => {
            return (
              <div className="a-row a-row--border" key={idx}>
                <div className="a-col__1"><p>Сотрудник {idx + 1}:</p></div>
                <div className="a-col__2">
                  <div className="a-card__employee">
                    <div className="a-card__employee__img">
                      <img src={'/images/' + empl.avatar} />
                    </div>
                    <div className="a-card__employee__text">
                      <p className="text__p--blue">{empl.name}</p>
                      <p className="text__p--2">{empl.post}</p>
                      <p className="text__p--3">стаж {empl.experience}</p>
                    </div>
                  </div>
                </div>
                <Button 
                  type="primary"
                  onClick={this.openModalAddEmployee.bind(this, empl, idx)}
                  icon={<FormOutlined />}
                />
                <Popconfirm title="Удалить?" 
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  okText="Да" 
                  cancelText="Нет"
                  onConfirm={this.deleteEmployee.bind(this, empl)}
                >
                  <Button 
                    type="primary"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>
            )
          })}
        </div>
        <div className="a-btn">
          <Button 
            type="primary"
            onClick={this.openModalAddEmployee.bind(this, null)}
          >Добавить сотрудника</Button>
        </div>
        
        <ModalAddEmployee 
          visibleAddEmployee={this.state.visibleAddEmployee}
          data={this.state.openEmployeeData}
          csrf={this.props.csrf}
          cancelAddEmployee={this.closeModalAddEmployee}
          handlerChangesData={this.props.handlerChangesData}
          changeValue={this.changeValue}
          setLoading={this.props.setLoading}
        />
      </section>
    );
  }
}

export default Employee;