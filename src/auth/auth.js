import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { 
  Form, 
  Input, 
  Button, 
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined 
} from '@ant-design/icons';


const error = (msg) => {
  message.error(msg);
};

const FormAuth = () => {
  const onFinish = async(values) => {
    const container = document.getElementById('page-auth');
    const csrf = container && container.dataset.csrf;

    fetch('/auth', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': csrf
      },
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(msg => {
        if (msg.error)
          error(msg.error);
        else 
          window.location = '/admin';
      })
      .catch(e => {
        error(e.error);
      })
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="login"
        rules={[{ required: true, message: 'Введите Лоин!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Логин" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Пароль"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
};

class Auth extends Component {
  render() {
    return (
      <div>
        <div className="auth__form">
          <p className="auth__p">Авторизируйтесь для входа в панель управления</p>
          <FormAuth />
        </div>
      </div>
    )
  };
}

ReactDOM.render(<Auth/>, document.getElementById('page-auth'));

