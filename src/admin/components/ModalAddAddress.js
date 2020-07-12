
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

    const coords = (typeof data.coords === 'string')
      ? data.coords
      : `[${data.coords.join(',')}]`;

    fetch('/admin/address', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': csrf
      },
      body: JSON.stringify({
        id:         data.id,
        address:    data.address,
        coords,
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

  const changeAddress = (e) => {
    let { value } = e.target;

    changeValue({address: value});
  }

  const search = () => {
    serachAddress(data.address);
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
          value={data.address}
          // defaultValue={data.address}
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