
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Upload, Form, Input } from 'antd';
import { BoldOutlined, UnorderedListOutlined } from '@ant-design/icons';

function ModalAddEquipment({
  csrf, data, handlerChangesData, cancelAddEquipment, 
  changeValue, visibleAddEquipment
}) {
  let textDescription = React.createRef();

  const onOk = () => {
    let sendForm = new FormData();
    let description = textDescription.current.value;

    if (data.id) {
      sendForm.append('id', data.id);
    }
    sendForm.append('name', data.name);
    // sendForm.append('description', data.description);
    sendForm.append('city_list_id', data.cityListId);

    fetch('/admin/employee', {
      method: 'post',
      headers: {
        'X-XSRF-TOKEN': csrf
      },
      body: sendForm
    })
      .then(res => res.json())
      .then(data => {
        if (data.result)
          handlerChangesData({equipment: data.result});
      })
      .catch(e => {
        if (e.error)
          handlerChangesData(e.error);
      });
    cancelAddEquipment();
  }

  const handleChange = (e) => {
    let target = e.target;

    changeValue({[target.name]: target.value});
  }

  return (
    <Modal
      visible={visibleAddEquipment}
      title={(data.employee) ? 'Редактирование сотрудника' : 'Добавление сотрудника'}
      okText="Сохранить"
      cancelText="Отмена"
      onCancel={cancelAddEquipment}
      onOk={onOk}
    >
      <form>
        <label className="a-form__label">
          <span className="a-form__label-name">Имя Фамилия:</span>
          <Input 
            name="name"
            value={data.name}
            defaultValue={data.name}
            onChange={handleChange}
            className="required"
          />
          <span className="a-form__required">Заполните поле</span>
        </label>
        <div class="a-form__block">
          <div class="a-form__block-name"><p>Описание</p></div>
          <div>
            <div class="a-form__editor" contenteditable="true" ref={textDescription}></div>
            <div class="a-form__editor__toolbar">
              <a href="#0" class="">h</a>
              <a href="#0" class="">p</a>
              <a href="#0" class=""><BoldOutlined /></a>
              <a href="#0" class=""><UnorderedListOutlined /></a>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalAddEquipment;