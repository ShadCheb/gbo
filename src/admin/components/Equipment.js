import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Popconfirm, message } from 'antd';
import { FormOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import ModalAddEquipment from './ModalAddEquipment';


class Equipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleAddEquipment: false,
      openEquipmentData: {},
      equipmentList: [],
    }
  }

  error = (msg) => {
    message.error(msg);
  };

  componentDidMount = () => {
    if (!this.props.data.equipment) {
      fetch('/admin/equipment/get', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'X-XSRF-TOKEN': this.props.csrf
        },
        body: JSON.stringify({cityId: this.props.data.cityListId})
      })
        .then(res => res.json())
        .then(data => {
          console.log('data ', data);
          this.setState({equipmentList: data.result})
        })
        .catch(e => {
          if (e.error)
            this.error(e.error);
        });
    }
  }

  deleteEquipment = (equipment) => {
    let id = equipment.id;

    fetch('/admin/equipment/' + id, {
      method: 'delete',
      headers: {
        'X-XSRF-TOKEN': this.props.csrf
      }
    })
      .then(() => {
        let equipment = this.props.data.equipment.slice();

        equipment = equipment.filter(a => a.id !== id);
        this.props.handlerChangesData({equipment});
      })
      .catch(e => {
        if (e.error)
          this.props.handlerChangesData(e.error);
      })
  }


  openModalAddEquipment = (equipment) => {
    if (!equipment) {
      equipment = {
        cityListId: this.props.data.cityListId
      }
    }

    this.setState(() => {
      return ({
        openEquipmentData: equipment,
        visibleAddEquipment: true
      });
    });
  }

  closeModalAddEquipment = () => {
    this.setState({visibleAddEquipment: false});
  }

  changeValue = (obj) => {
    let openEquipmentData = this.state.openEquipmentData;

    for(let key in obj) {
      Object.assign(openEquipmentData, {[key]: obj[key]})
    }
    this.setState(openEquipmentData);
  }

  render() {
    let {equipmentList} = this.state;

    return (
      <section>
        {equipmentList.map((eqpm, idx) => {
          return (
            <div key={idx}>
              <div className="a-row a-row--border">
                <div className="a-col__1"><p>Сотрудник {idx + 1}:</p></div>
                <div className="a-col__2">
                  <div className="a-card__employee">
                    <div className="a-card__employee__img">
                      <img src={'/images/' + eqpm.avatar} />
                    </div>
                    <div className="a-card__employee__text">
                      <p className="text__p--blue">{eqpm.name}</p>
                      <p className="text__p--2">{eqpm.post}</p>
                      <p className="text__p--3">стаж {eqpm.experience}</p>
                    </div>
                  </div>
                </div>
                <Button 
                  type="primary"
                  onClick={this.openModalAddEquipment.bind(this, eqpm)}
                  icon={<FormOutlined />}
                />
                <Popconfirm title="Удалить?" 
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  okText="Да" 
                  cancelText="Нет"
                  onConfirm={this.deleteEquipment.bind(this, eqpm)}
                >
                  <Button 
                    type="primary"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>
            </div>
          )
        })}
        <div className="a-btn">
          <Button 
            type="primary"
            onClick={this.openModalAddEquipment.bind(this, null)}
          >Добавить оборудование</Button>
        </div>
        
        <ModalAddEquipment 
          visibleAddEquipment={this.state.visibleAddEquipment}
          data={this.state.openEquipmentData}
          csrf={this.props.csrf}
          cancelAddEmployee={this.closeModalAddEquipment}
          handlerChangesData={this.props.handlerChangesData}
          changeValue={this.changeValue}
        />
      </section>
    );
  }
}

export default Equipment;