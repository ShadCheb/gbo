
import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';


function ModalAddAddress({
  map, placemark,  
  cancelAddAddress, csrf, data, handlerChangesData,
  changeValue, visibleAddAddress, serachAddress, setLoading
}) {

  const cancelAddress = () => {
    map && map.geoObjects.remove(placemark);
    cancelAddAddress();
  }

  const onOk = async() => {
    setLoading(true);

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
        setLoading(false);

        if (result)
          handlerChangesData({addresses: result});
      })
      .catch(e => {
        setLoading(false);
        
        if (e.error)
          handlerChangesData(e.error);
      });
    cancelAddress();
  }

  const changeAddress = (value) => {
    changeValue({nameAddress: value}, 'data');
  }

  const search = () => {
    serachAddress(data.nameAddress);
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
        <Button 
          type="primary"
          onClick={search}
          icon={<SearchOutlined />}
        />
      </div>
      <div id="map-modal" className="a-modal__map">
      </div>
    </Modal>
  );
};

export default ModalAddAddress;