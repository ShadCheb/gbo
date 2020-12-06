import React from 'react';
import { Modal, message } from 'antd';
import InputMask from 'react-input-mask'


function ModalPriceInstallment(props) {
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

  const checkSend = (value, valid) => {
    const validArr = valid.split(',');
    let check = true;

    const checkFunctionList = (type, value) => {
      if (type == 'required') {
        return (value !== '')
          ? { result: true }
          : { result: false, message: 'Введены не все данные' }
        
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
      let { result, message } = checkFunctionList(type, value);

      console.log('result', result, ' - ', message);

      if (message)
        error(message);
      if (!result)
        check = false;
    });

    return check;
  };

  const send = (e) => {
    e.preventDefault();

    let formSend = formRecord.current;
    let inputList = formSend.querySelectorAll('input');
    let dataSend = {};
    let check = true;
    let btn = e.target;

    for (let i = 0; i < inputList.length; i++) {
      const valid = inputList[i].dataset && inputList[i].dataset.valid || false;
      const value = (inputList[i].type == 'checkbox')
        ? inputList[i].checked
        : inputList[i].value;

      console.log('inputList[i].name', inputList[i].name, ' : ', value);

      const result = (valid) 
        ? checkSend(value, valid) : true;

      if (!result) 
        check = false;

      dataSend[inputList[i].name] = value;
    }
    dataSend['btn'] = props.data.title;
    dataSend['page'] = props.data.page;

    // Прошла ли валидация
    if (!check) 
      return;

    btn.disabled = true;

    // if (window.ym)
    //   ym(62691718,'reachGoal','TERMO');

    // Дополнительные данные для отправки
    dataSend['type'] = props.data.type;
    dataSend['description'] = props.data.description;

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
          props.finishSend();
          afterClose();
          success(data.success);
        } else if (data.error) {
          error(data.error);
        }
      })
      .catch(err => {
        console.log('error', error);
        btn.disabled = false;

        if (err.error)
          error(err.error);
      })
  };  


  return (
    <React.Fragment>
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
              <input type="text" name="birth" data-valid="required" required />
              <span>Дата рождения</span>
            </label>
            <label className="form__input">
              <input type="text" name="addres" data-valid="required" required />
              <span>Адрес регистрации</span>
            </label>
            <label className="form__input">
              <InputMask mask="+7 (999) 999-99-999" data-valid="phone" 
                type="text" name="phone" required />
              <span>Телефон</span>
            </label>
            <label className="form__input">
              <input type="text" name="number__passport" data-valid="required" required />
              <span>Серия и номер паспорта</span>
            </label>
            <label className="form__input">
              <input type="text" name="from__passport" data-valid="required" required />
              <span>Кем и когда выдан</span>
            </label>
            <label className="form__input">
              <input type="text" name="brand" data-valid="required" required />
              <span>Марка и модель</span>
            </label>
            <label className="form__input">
              <input type="text" name="power" data-valid="required" required />
              <span>Мощность</span>
            </label>
            <label className="form__input">
              <input type="text" name="issue" data-valid="required" required />
              <span>Год выпуска</span>
            </label>
            <p className="form__text form--up">Отправляя форму, Вы соглашаетесь на обработку своих персональных данных</p>
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
    </React.Fragment>
  );
}

export default ModalPriceInstallment;
