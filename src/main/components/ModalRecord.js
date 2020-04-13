import React from 'react';
import { Modal, message } from 'antd';
import InputMask from 'react-input-mask'


function ModalRecord(props) {
  let formRecord = React.createRef();

  const afterClose = () => {
    props.close();
  };

  const error = (msg) => {
    message.error(msg);
  };

  const generationMessage = (input) => {
    let typeStr = input.dataset.valid;
    let typeArr = typeStr.split(',');
    let result = true;
    let message = '';

    const checkFunctionList = (type, value) => {
      if (type == 'required') {
        if (value !== '') {
          message = 'Введены не все данные';
          result = false;
        };

        return true;
      } else if (type == 'phone') {
        let phone = value.replace(/[^_0-9]/gim,'');

        console.log('phone', phone);
        if (phone.length < 6) {
          message = 'Введите номер телефона правильно';
          result = false;
        }

        return true;
      } else {
          console.log('Не известный тип проверки');
          message = 'Произошла ошибка. попробуйте позже';
          result = false;
      }
    }

    typeArr.map(type => {
      message = '';
      checkFunctionList(type, input.value);

      if (message)
        error(message);
    });

    return result;
  };

  const getInputValue = (data) => {
    let result = {};

    data.forEach(input => {
      if (input.dataset.valid) {
        let check = generationMessage(input);

        if (!check)
          return {result: false};
      }

      result[input.name] = input.value;
    });

    result['result'] = true;

    return result;
  };

  const send = () => {
    console.log('Отправка сообщения');

    let formSend = formRecord.current;
    let inputList = formSend.querySelectorAll('input');

    console.log('dataSend', dataSend);
    let dataList = getInputValue(inputList);

    return;

    fetch('/mail/request', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': this.state.csrf
      },
      body: JSON.stringify({dataSend})
    })
      .then(res => res.json())
      .then(data => {
        this.setState({data});
      })
      .catch(e => {
        if (e.error)
          this.error(e.error);
      })
  };

  
  


  return (
    <Modal
      visible={props.data.visible}
      title={props.data.title}
      footer={null}
      onCancel={afterClose}
      destroyOnClose={true}
    >
      <div>
        <p className="modal__p">Заплните форму и наш сотрудник свяжется с вами:</p>
        <form className="form modal__form" ref={formRecord}>
            <label className="form__input">
              <input type="text" name="name" required />
              <span>Имя</span>
            </label>
            <label className="form__input">
              <InputMask mask="+7 (999) 999-99-999" data-valid="required, phone" 
                type="text" name="phone" required />
              <span>Телефон</span>
            </label>
            <label className="input__check license">
              <input type="checkbox" data-valid="check" className="input__required" />
              <span></span>
              <p>Я даю свое согласие на обработку персональных данных</p>
            </label>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <div className="modal__btn">
              <button className="btn-1 btn--blue" 
                aria-label="Отправить заявку"
                type="submit"
                onClick={send}
              >Отправить</button>
            </div>
        </form>
      </div>
    </Modal>
  );
}

export default ModalRecord;
