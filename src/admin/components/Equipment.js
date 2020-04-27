import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Popconfirm, message } from 'antd';
import { FormOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import ModalAddEquipment from './ModalAddEquipment';

function RenderCylinder({cylinders}) {
  let cylinderTxt = cylinders.join(', ');

  return cylinderTxt;
}


class Equipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleAddEquipment: false,
      openEquipmentData: {}
    }
  }

  error = (msg) => {
    message.error(msg);
  };

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
    let openEmployee = {};

    if (!equipment) {
      openEmployee = {
        cityListId: this.props.data.cityListId
      }
    } else {
      openEmployee = Object.assign({}, equipment);
    }


    this.setState(() => {
      return ({
        openEquipmentData: openEmployee,
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
    this.setState({openEquipmentData});
  }

  changeActiveEdit = (type) => {
    let obj = Object.assign({}, this.state.editActive);

    obj[type] = !obj[type];
    this.setState({editActive: obj});
  }

  render() {
    let equipmentList = this.props.data.equipment || [];

    return (
      <section>
        <div>
          {equipmentList.map((eqpm, idx) => {
            return (
              <div className="a-row a-row--border a-row--start" key={idx}>
                <div className="a-col__1"><p>Оборудование {idx + 1}:</p></div>
                <div className="a-col__2">
                  <div className="a-card__equipment">
                    <h2 className="text__p--blue">{eqpm.name}</h2>
                    <div className="a-card__equipment__text"
                      dangerouslySetInnerHTML={{__html: eqpm.description}}
                    ></div>
                    <p className="a-card__equipment__text">
                      <strong>Кол-во цилиндров</strong>: <RenderCylinder cylinders={eqpm.cylinder}/></p>
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
            )
          })}
        </div>
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
          cancelAddEquipment={this.closeModalAddEquipment}
          handlerChangesData={this.props.handlerChangesData}
          changeValue={this.changeValue}
        />
      </section>
    );
  }
}

export default Equipment;