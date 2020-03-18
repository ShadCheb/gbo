import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button } from 'antd';

function Phone({csrf, data, handlerChangesData}) {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  const onFinish = values => {
    values['id'] = data.id;
    values['phoneId'] = data.phoneId;

    fetch('/admin/phone', {
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
          handlerChangesData({phone: data.result});
      })
      .catch(e => {
        if (e.error)
          handlerChangesData(e.error);
      })
  }

  form.setFieldsValue({
    kod:  data.kod,
    number: data.number,
    link: data.link
  });

  return (
    <section>
      <Form
        form={form} 
        name="form-phone"
        onFinish={onFinish}
      >
        
        <Form.Item 
          {...formItemLayout}
          name="kod"
          label="Телефон:"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input 
            placeholder="Код" 
            className="required" 
          />
        </Form.Item>
        <Form.Item 
          {...formItemLayout}
          name="number"
          label="Номер:"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input placeholder="Номер" className="required" />
        </Form.Item>
        <Form.Item 
          {...formItemLayout}
          name="link"
          label="Ссылка (+79998887777):"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input placeholder="Ссылка" className="required" />
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

export default Phone;