
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Form, Input, message } from 'antd';


function ModalAddAddress({
  map, placemark,  
  cancelAddAddress, csrf, data, handlerChangesData,
  changeValue, visibleAddAddress
}) {

  const cancelAddress = () => {
    map && map.geoObjects.remove(placemark);
    cancelAddAddress();
  }

  const onOk = async() => {
    console.log('data', data);

    fetch('/admin/address', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': csrf
      },
      body: JSON.stringify({
        id:         data.id,
        address:    data.nameAddress,
        coords:     JSON.stringify(data.coords),
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

  const changeAddress = (value) => {
    changeValue({nameAddress: value}, 'data');
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