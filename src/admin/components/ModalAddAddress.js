
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Form, Input, message } from 'antd';

// class ModalAddAddress extends Component {

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     nameAddress:        '',
  //     coord:              '',
  //     map:                null,
  //     placemark:          null,
  //   }
  // }

function ModalAddAddress({
  map, placemark, coord, 
  cancelAddAddress, csrf, data, handlerChangesData,
  changeValue, visibleAddAddress
}) {

  const error = (msg) => {
    message.error(msg);
  };
  const success = (msg) => {
    message.success(msg);
  };

  const cancelAddress = () => {
    map.geoObjects.remove(placemark);
    cancelAddAddress();
  }

  const onOk = async() => {
    fetch('/admin/address', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': csrf
      },
      body: JSON.stringify({
        id:         data.id,
        address:    data.nameAddress,
        coords:     JSON.stringify(coord),
        cityListId: data.cityListId
      })
    })
      .then(res => res.json())
      .then(({result}) => {
        if (result)
          handlerChangesData({addresses: result});
      })
      .catch(e => {
        if (e.error)
          handlerChangesData(e.error);
      });
    cancelAddress();
  }

  const setPoint = (c) => {
    let plcmark;

    if (!plcmark) {
      plcmark = new ymaps.Placemark(c, {
        iconColor: '#00c2ff',
      }, {
        preset: 'islands#blueDotIcon',
        draggable: true
      });

      changeValue({placemark: plcmark});
    } else {
      plcmark = placemark;
      plcmark.geometry.setCoordinates(c);
    }

    map.geoObjects.add(plcmark);
    plcmark.events.add('drag', () => {
      let coordPopint = plcmark.geometry.getCoordinates();

      ymaps.geocode(coordPopint).then((res) => {
        let names = [];
        
        res.geoObjects.each((obj) => {
          names.push(obj.properties.get('name'));
        });

        if (names) 
          changeValue({
            nameAddress: names[0],
            coord: coordPopint
          }, 'data');
      });
    });
  }

  const changeAddress = (value) => {
    changeValue({nameAddress: value}, 'data');
    // this.setState({nameAddress: value});
  }
  
  
  return (
    <Modal
      visible={visibleAddAddress}
      title={(data.coords) ? 'Редактировать адрес' : 'Добавить адрес'}
      okText="Сохранить"
      cancelText="Отмена"
      onCancel={cancelAddress}
      onOk={onOk}
    >
      <div className="a-modal__address">
          <p>Адрес:</p>
          <Input 
            name="address"
            value={data.nameAddress}
            defaultValue={data.nameAddress}
            onChange={changeAddress}
          />
      </div>
      <div id="map-modal" className="a-modal__map">
      </div>
    </Modal>
  );
};

export default ModalAddAddress;