import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button } from 'antd';

function Social({csrf, data, handlerChangesData}) {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  const onFinish = values => {
    values['id'] = data.id;
    values['socialId'] = data.socialId;

    fetch('/admin/social', {
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
          handlerChangesData({social: data.result});
      })
      .catch(e => {
        if (e.error)
          handlerChangesData(e.error);
      })
  }

  form.setFieldsValue({
    vk:  data.vk,
    instagram: data.instagram,
    youtube: data.youtube
  });

  return (
    <section>
      <Form
        form={form} 
        name="form-social"
        onFinish={onFinish}
      >
        <Form.Item 
          {...formItemLayout}
          name="vk"
          label="Вконтакте:"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input 
            placeholder="vk" 
            className="required" 
          />
        </Form.Item>
        <Form.Item 
          {...formItemLayout}
          name="instagram"
          label="Instagram:"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input placeholder="instagram" className="required" />
        </Form.Item>
        <Form.Item 
          {...formItemLayout}
          name="youtube"
          label="Youtube:"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input placeholder="youtube" className="required" />
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

export default Social;