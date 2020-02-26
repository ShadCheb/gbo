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
      OnCancel={afterClose}
    >
      <div>
        <p class="modal__p">Заплните форму и наш сотрудник свяжется с вами:</p>
        <form class="form modal__form">
            <label class="form__input">
              <input type="text" name="name" required />
              <span>Имя</span>
            </label>
            <label class="form__input">
              {/* <input type="text" name="phone" required /> */}
              <InputMask mask="+7 (999) 999-99-999" type="text" name="phone" required />
              <span>Телефон</span>
            </label>
            <label class="input__check license">
              <input type="checkbox" data-valid="check" class="input__required" />
              <span></span>
              <p>Я даю свое согласие на обработку персональных данных</p>
            </label>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <div class="install__btn">
              <button class="btn-1 btn--blue" 
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
