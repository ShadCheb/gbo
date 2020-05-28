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
  
  const success = (msg) => {
    message.success(msg);
  };

  // const generationMessage = (input) => {
  const checkSend = (value, valid) => {
    const validArr = valid.split(',');
    let check = true;

    const checkFunctionList = (type, value) => {
      if (type == 'required') {
        return (value !== '')
          ? {result: false, message: 'Введены не все данные'}
          : {result: true}
        
      } else if (type == 'phone') {
        let phone = value.match(/\d/g);
        
        if (!phone) {
          return {result: false, message: 'Введите номер телефона'};
        } else if (phone.length < 6) {
          return {result: false, message: 'Введите номер телефона правильно'}
        } else {
          return {result: true};
        }
      } else if (type == 'check') {
        return (!value) 
          ? {result: false, message: 'Вы не дали согласия на обработку персональных данных'}
          : {result: true}
      } else {
        console.log('Не известный тип проверки');
        return {result: false, message: 'Произошла ошибка. Попробуйте позже'};
      }
    }

    validArr.map(type => {
      let {result, message} = checkFunctionList(type, value);

      if (message)
        error(message);
      if (!result)
        check = false;
    });

    return check;
  };

  const send = (e) => {
    e.preventDefault();

    let target = props.data.target;
    let formSend = formRecord.current;
    let inputList = formSend.querySelectorAll('input');
    let dataSend = {};
    let check = true;
    let btn = e.target;

    btn.disabled = true;

    for (let i = 0; i < inputList.length; i++) {
      let valid = inputList[i].dataset && inputList[i].dataset.valid;
      let value = (inputList[i].type == 'checkbox')
        ? inputList[i].checked
        : inputList[i].value;
      let result = (valid) 
        ? checkSend(value, valid) : true;

      if (!result) 
        check = false;

      dataSend[inputList[i].name] = value;
    }
    dataSend['btn'] = props.data.title;
    dataSend['page'] = props.data.page;

    // Прошла ли валидация
    if (!check) {
      btn.disabled = false;

      return;
    }

    if (window.ym) {
      let pageBrief = props.data.pageBrief;

      switch (pageBrief) {
        case 'register':
          ym(62691718,'reachGoal','REG')
          break;
        case 'variator':
          ym(62691718,'reachGoal','VARIATOR')
          break;
        case 'metan':
          ym(62691718,'reachGoal','METAN')
          break;
        case 'dizel':
          ym(62691718,'reachGoal','GAZDIZEL')
          break;
        default:
          ym(62691718,'reachGoal','ZAYVKA');
      }      
    }

    // Дополнительные данные для отправки
    if (target && target.dataset) {
      if (target.dataset.type)
        dataSend['type'] = target.dataset.type;
      if (target.dataset.description)
        dataSend['description'] = target.dataset.description;
    }

    fetch('/mail', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-XSRF-TOKEN': props.csrf
      },
      body: JSON.stringify(dataSend)
    })
      .then(res => res.json())
      .then(data => {
        btn.disabled = false;

        if (data.success) {
          afterClose();
          success(data.success);
        }
      })
      .catch(err => {
        btn.disabled = false;

        if (err.error)
          error(err.error);
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
        <p className="modal__p">Заполните форму и наш сотрудник свяжется с вами:</p>
        <form className="form modal__form" ref={formRecord}>
            <label className="form__input">
              <input type="text" name="name" required />
              <span>Имя</span>
            </label>
            <label className="form__input">
              <InputMask mask="+7 (999) 999-99-999" data-valid="phone" 
                type="text" name="phone" required />
              <span>Телефон</span>
            </label>
            {/* <label className="input__check license">
              <input type="checkbox" name="treatment" data-valid="check" className="input__required" />
              <span></span>
              <p>Я даю свое согласие на обработку персональных данных</p>
            </label> */}
            <p className="form__text">Отправляя форму, Вы соглашаетесь на обработку своих персональных данных</p>
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
