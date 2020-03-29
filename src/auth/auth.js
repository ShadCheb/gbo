import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Checkbox 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined 
} from '@ant-design/icons';


// Для теста Api
// let dataTest = [
//   [
//     {
//       person: {
//         person_id: 0,
//         name: 'Faadi Al Rahman 1',
//         post: 'Specialist',
//         avatar: '../images/avatars/avatar-1.jpg'
//       },
//       tasks: [
//         {
//           task_id: 0,
//           author: {
//             person_id: 10,
//             name: 'Song Bao 1'
//           },
//           time_start: 9,
//           duration: 1.5,
//           description: 'Haicut standard 1',
//           price: 10,
//           status: 'finish'
//         },
//         {
//           task_id: 1,
//           author: {
//             person_id: 11,
//             name: 'Song Bao 2'
//           },
//           time_start: 11,
//           duration: 2,
//           description: 'Haicut standard 2',
//           price: 10,
//           status: 'finish'
//         },
//         {
//           task_id: 2,
//           author: {
//             person_id: 12,
//             name: 'Song Bao 3'
//           },
//           time_start: 13,
//           duration: 2,
//           description: 'Haicut standard 3',
//           price: 10,
//           status: 'expect'
//         }
//       ],
//     },
//     {
//       person: {
//         person_id: 1,
//         name: 'Faadi Al Rahman 2',
//         post: 'Specialist',
//         avatar: '../images/avatars/avatar-1.jpg'
//       },
//       tasks: [
//         {
//           task_id: 3,
//           author: {
//             person_id: 13,
//             name: 'Song Bao 4'
//           },
//           time_start: 10,
//           duration: 1.5,
//           description: 'Haicut standard 4',
//           price: 10,
//           status: 'not'
//         }
//       ]
//     }
//   ],
//   [
//     {
//       person: {
//         person_id: 3,
//         name: 'Faadi Al Rahman 3',
//         post: 'Specialist',
//         avatar: '../images/avatars/avatar-1.jpg'
//       },
//       tasks: [
//         {
//           task_id: 4,
//           author: {
//             person_id: 13,
//             name: 'Song Bao 5'
//           },
//           time_start: 14,
//           duration: 1.5,
//           description: 'Haicut standard 5',
//           price: 10,
//           status: 'expect'
//         }
//       ]
//     }
//   ]
// ];
// const container = document.getElementById('page-auth');
// const csrf = container && container.dataset.csrf;

// dataTest = JSON.stringify(dataTest);

// fetch('/api/test', {
//   method: 'put',
//   headers: {
//     'Content-Type': 'application/json;charset=utf-8',
//     'X-XSRF-TOKEN': csrf
//   },
//   body: dataTest
// }).then(response => response.json())
//   .then(result => {
//     console.log(result);
//   })
//   .catch(e => {
//     console.log(e);
//   });


// fetch('/api/test', {
//   method: 'post',
//   headers: {
//     'Content-Type': 'application/json;charset=utf-8',
//     'X-XSRF-TOKEN': csrf
//   },
//   body: dataTest
// }).then(response => response.json())
//   .then(result => {
//     if (result && result.result)
//       console.log(JSON.parse(result.result));
//   })
//   .catch(e => {
//     console.log(e);
//   });



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

