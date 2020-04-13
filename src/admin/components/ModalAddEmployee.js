
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Upload, Form, Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;


function ModalAddEmployee({
  csrf, data, handlerChangesData, cancelAddEmployee, 
  changeValue, visibleAddEmployee
}) {

  const uploadAvatar = async (file) => {
    let promise = new Promise((resolve, reject) => {
      let sendForm = new FormData();
  
      sendForm.append('filedata', file);
  
      fetch('/upload', {
        method: 'post',
        headers: {
          'X-XSRF-TOKEN': csrf
        },
        body: sendForm
      })
        .then(res => res.json())
        .then(data => { 
          handlerChangesData({file: null}, true); // проверить

          if (data.success) 
            resolve(data.success.filename);
        })
        .catch(e => {
          if (e.error) {
            handlerChangesData(e.error);
  
            reject();
          }
        });
    });

    return await promise;
  }

  const onOk = async () => {
    let avatar = data.fileList[0].name;

    // сначала загружаем картинку, если она есть
    if (data.file) 
      uploadAvatar(data.file);

    // Теперь сохраняем данный в БД
    let sendForm = new FormData();

    if (data.id) {
      sendForm.append('id', data.id);
    }
    sendForm.append('name', data.name);
    sendForm.append('post', data.post);
    sendForm.append('experience', data.experience);
    sendForm.append('avatar', avatar);
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
          handlerChangesData({employee: data.result});
      })
      .catch(e => {
        if (e.error)
          handlerChangesData(e.error);
      });
    cancelAddEmployee();
  }

  const beforeUpload = (file) => {
    let fileList = [{
      uid: '-1',
      name: file.name,
      status: 'done',
      url: file.name,
    }];

    changeValue({fileList});
  }
  const onRemove = file => {
    const index = data.fileList.indexOf(file);
    const newFileList = data.fileList.slice();

    newFileList.splice(index, 1);

    changeValue({fileList: newFileList}); 
  }
  const onChange = () => {
    return;
  }
  const handleChange = e => {
    let target = e.target;

    changeValue({[target.name]: target.value});
  }

  // Если добавили новый файл
  const customRequest = data => {
    changeValue({file: data.file});
  }

  return (
    <Modal
      visible={visibleAddEmployee}
      title={(data.id) ? 'Редактирование сотрудника' : 'Добавление сотрудника'}
      okText="Сохранить"
      cancelText="Отмена"
      onCancel={cancelAddEmployee}
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
        <label className="a-form__label">
          <span className="a-form__label-name">Должность:</span>
          <Input 
            name="post"
            value={data.post}
            defaultValue={data.post}
            onChange={handleChange}
            className="required"
          />
          <span className="a-form__required">Заполните поле</span>
        </label>
        <label className="a-form__label">
          <span className="a-form__label-name">Стаж:</span>
          <Input 
            name="experience"
            value={data.experience}
            defaultValue={data.experience}
            onChange={handleChange}
            className="required"
          />
          <span className="a-form__required">Заполните поле</span>
        </label>

        <Dragger 
          name='filedata'
          fileList={data.fileList}
          onRemove={onRemove}
          onChange={onChange}
          beforeUpload={beforeUpload}
          customRequest={customRequest}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">Фотография</p>
          <p className="ant-upload-hint">Выберите или переместите файл для загрузки</p>
        </Dragger>
      </form>
    </Modal>
  );
};

export default ModalAddEmployee;