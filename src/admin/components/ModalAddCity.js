import React from 'react';
import { Modal, Form, Input } from 'antd';


const ModalAddCity = ({ visibleAddCity, addCity, cancelAddCity }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        addCity(values);
      })
      .catch(info => {
        console.log('Ошибка валидации: ', info);
      });
  }

  return (
    <Modal
      visible={visibleAddCity}
      title="Добавить город"
      okText="Добавить"
      cancelText="Отмена"
      onCancel={cancelAddCity}
      onOk={onOk}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="name"
          label="Название (Чебоксары)"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="brief"
          label="Brief (cheboksary)"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddCity;