
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Upload, Form, Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;


// class ModalAddEmployee extends Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     name: '',
  //     post: '',
  //     experience: '',
  //     fileList: [],
  //     uploading: false,
  //   }
  // }

function ModalAddEmployee({
  csrf, data, handlerChangesData, cancelAddEmployee, 
  changeValue, visibleAddEmployee
}) {

  const onOk = () => {
    // this.setState({
    //   uploading: true,
    // });
    let sendForm = new FormData();

    if (data.id) {
      sendForm.append('id', data.id);
    }
    sendForm.append('name', data.name);
    sendForm.append('post', data.post);
    sendForm.append('experience', data.experience);
    sendForm.append('employee', data.fileList[0]);
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

  /* beforeUpload = (file, fileList) => {
    this.setState(() => ({fileList}));

    return false;
  } */
  const beforeUpload = (file, fileList) => {
    changeValue({fileList});
  }
  /* onRemove = file => {
    this.setState(state => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);

      return {
        fileList: newFileList,
      };
    });
  } */
  const onRemove = file => {
    const index = state.fileList.indexOf(file);
    const newFileList = state.fileList.slice();

    newFileList.splice(index, 1);

    changeValue({fileList: newFileList});
  }
  /* handleChange = (e) => {
    let target = e.target;

    this.setState({[target.name]: target.value});
  } */
  const handleChange = (e) => {
    let target = e.target;

    changeValue({[target.name]: target.value});
  }

  
  // const { uploading, fileList } = this.state;

  return (
    <Modal
      visible={visibleAddEmployee}
      title={(data.employee) ? 'Редактирование сотрудника' : 'Добавление сотрудника'}
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
          name='employee'
          fileList={data.fileList}
          onRemove={onRemove}
          beforeUpload={beforeUpload}
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