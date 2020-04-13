import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { 
  Form, 
  Input, 
  Button, 
  Checkbox,
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined 
} from '@ant-design/icons';


const error = (msg) => {
  message.error(msg);
};

const FormAuth = ({data}) => {
  const onFinish = async(values) => {
    const container = document.getElementById('page-auth');
    const csrf = container && container.dataset.csrf;

    if (values.remember) {
      document.cookie = encodeURIComponent('login') + '=' + encodeURIComponent(values.login);
      document.cookie = encodeURIComponent('password') + '=' + encodeURIComponent(values.password);

      document.cookie = 'path=/admin; expires=2000000; samesite=strict'; 
    }
    else {
      document.cookie = "login=''; password=''; max-age=0";
    }

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
      fields={data}
    >
      <Form.Item
        name="login"
        rules={[{ required: true, message: 'Введите Лоин!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} 
          value={data.login}
          placeholder="Логин" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          value={data.password}
          placeholder="Пароль"
        />
      </Form.Item>

      <Form.Item
        valuePropName="checked"
        name="remember"
      >
        <Checkbox>Запомнить</Checkbox>
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
  state = {
    data: [
      {
        name: 'login',
        value: ''
      },
      {
        name: 'password',
        value: ''
      }
    ]
  }

  componentDidMount = () => {
    if (!document.cookie) 
      return;

    let login = document.cookie.match(new RegExp(
      "(?:^|; )" + 'login'.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    let password = document.cookie.match(new RegExp(
      "(?:^|; )" + 'password'.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));    

    if (login && password) {
      login = login[1] ;
      password = password[1] ;

      let data = [{
        name: 'login',
        value: decodeURIComponent(login),
        },
        {
          name: 'password',
          value: decodeURIComponent(password)
        }
      ];

      this.setState({data});
    }
  }

  
  render() {
    let {data} = this.state;

    return (
      <div>
        <div className="auth__form">
          <p className="auth__p">Авторизируйтесь для входа в панель управления</p>
          <FormAuth 
            data={data}
          />
        </div>
      </div>
    )
  };
}

ReactDOM.render(<Auth/>, document.getElementById('page-auth'));

