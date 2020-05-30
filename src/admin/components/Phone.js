import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button } from 'antd';

function Phone({csrf, data, handlerChangesData, setLoading}) {
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  const onFinish = values => {
    values['id'] = data.id;
    values['phoneId'] = data.phoneId;

    setLoading(true);

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
        setLoading(false);

        if (data.result)
          handlerChangesData({phone: data.result});
      })
      .catch(e => {
        setLoading(false);
        
        if (e.error)
          handlerChangesData(e.error);
      })
  }

  return (
    <section>
      <Form
        name="form-phone"
        onFinish={onFinish}
        fields={data.data}
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
          <Input placeholder="Код" className="required" />
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
          {...formItemLayout}
          name="whatsup"
          label="WhatsUp (79998887777):"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input placeholder="WhatsUp" className="required" />
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