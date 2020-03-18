import React from 'react';
import { Modal } from 'antd';

import InputMask from 'react-input-mask'


function ModalRecord(props) {
  const afterClose = () => {
    props.close();
  };
  const send = () => {
    console.log('Отправка сообщения');
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
        <form className="form modal__form">
            <label className="form__input">
              <input type="text" name="name" required />
              <span>Имя</span>
            </label>
            <label className="form__input">
              {/* <input type="text" name="phone" required /> */}
              <InputMask mask="+7 (999) 999-99-999" type="text" name="phone" required />
              <span>Телефон</span>
            </label>
            <label className="input__check license">
              <input type="checkbox" data-valid="check" className="input__required" />
              <span></span>
              <p>Я даю свое согласие на обработку персональных данных</p>
            </label>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <div className="install__btn">
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
