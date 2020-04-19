import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';


function General({csrf, data, handlerChangesData}) {
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  const onFinish = values => {
    values['id'] = data.id;

    fetch('/admin/general', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': csrf
      },
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(data => {
        if (data.result)
          handlerChangesData(data.result);
      })
      .catch(e => {
        if (e.error)
          handlerChangesData(e.error);
      })
  };


  return (
    <section>
      <Form 
        name="form-general"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        fields={data.data}
      >
        <Form.Item 
          {...formItemLayout}
          name="name"
          label="Город:"
          rules={[ { required: true, message: 'Заполните поле' } ]}
        >
          <Input placeholder="Город" className="required" />
        </Form.Item>
        <Form.Item 
          {...formItemLayout}
          name="brief"
          label="Brief:"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input placeholder="Brief" className="required" />
        </Form.Item>
        <Form.Item 
          {...formItemLayout}
          name="name2"
          label="В городе:"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input placeholder="В городе" className="required" />
        </Form.Item>
        <Form.Item 
          {...formItemLayout}
          name="email"
          label="Почта:"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input placeholder="Почта" className="required" />
        </Form.Item>
        
        <Form.Item 
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Button type="primary" htmlType="submit">Сохранить</Button>
        </Form.Item>
      </Form>
    </section>
  );
}

export default General;