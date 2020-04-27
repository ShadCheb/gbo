import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Popover, Input, Checkbox } from 'antd';
import { BoldOutlined, UnorderedListOutlined } from '@ant-design/icons';


class ModalAddEquipment extends Component {
  constructor(props) {
    super(props);

    this.textDescription = React.createRef(),
    this.textDescriptionHTML = React.createRef(),

    this.state = {
      showEditor: false
    }
  }

  componentDidMount = () => {
    document.execCommand('defaultParagraphSeparator', false, 'p'); // Установка по умолчанию
    // this.setEditParagraph(); // Установка по умолчанию
  }  

  onOk = () => {
    let sendForm = new FormData();
    let data = this.props.data;
    let description = (this.state.showEditor)
      ? this.textDescriptionHTML.current.textContent
      : this.textDescription.current.innerHTML;
    let cylinder = data.cylinder.join(',');

    if (data.id) {
      sendForm.append('id', data.id);
    }
    sendForm.append('name', data.name);
    sendForm.append('description', description);
    sendForm.append('cylinder', cylinder);
    sendForm.append('city_list_id', data.cityListId);

    fetch('/admin/equipment', {
      method: 'post',
      headers: {
        'X-XSRF-TOKEN': this.props.csrf
      },
      body: sendForm
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          data.result = data.result.map(item => {
            item.cylinder = item.cylinder.split(','); // Строку в массив

            return item;
          });

          this.props.handlerChangesData({equipment: data.result});
        }
      })
      .catch(e => {
        if (e.error)
          this.props.handlerChangesData(e.error);
      });
    this.props.cancelAddEquipment();
  }

  handleChange = (e) => {
    let target = e.target;
    let value = target.value || target.contentText;

    this.props.changeValue({[target.name]: value});
  }

  // Редактирование
  setEditCaption = (e) => {
    if (e)
      e.preventDefault();

    document.execCommand('formatBlock', false, 'h3');

    return false;
  }

  setEditParagraph = (e) => {
    if (e)
      e.preventDefault();

    document.execCommand('formatBlock', false, 'p');

    return false;
  }

  setEditBold = (e) => {
    if (e)
      e.preventDefault();

    document.execCommand('bold', false, null);

    return false;
  }

  setEditList = (e) => {
    if (e)
      e.preventDefault();

    document.execCommand('insertUnorderedList', false, null);

    return false;
  }


  escapeText = (text) => { 
    var map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'};
    return text.replace(/[&<>"']/g, function(m) {
      return map[m];
    });
  }

  // Удаление стилей при вставке
  pastTextToEditor = (e) => {
    console.log('past');
    e.preventDefault();

    let text = (e.originalEvent || e).clipboardData.getData('text/plain');

	  document.execCommand('insertHtml', false, this.escapeText(text));
  }

  onShowEditor = (e) => {
    let description = (this.state.showEditor)
      ? this.textDescriptionHTML.current.textContent
      : this.textDescription.current.innerHTML;

    this.props.changeValue({description});
    this.setState(function(prevValue, props) {
      return ({showEditor: !prevValue.showEditor});
    });
  }

  selectCylinder = (cylinder) => {
    this.props.changeValue({cylinder});
  }

  onChangeText = (e) => {
    this.props.changeValue({description: e.target.value});
  }


  render() {
    let {data, visibleAddEquipment, cancelAddEquipment} = this.props;

    return (
      <Modal
        visible={visibleAddEquipment}
        title={(data.id) ? 'Редактирование оборудования' : 'Добавление оборуования'}
        okText="Сохранить"
        cancelText="Отмена"
        onCancel={cancelAddEquipment}
        onOk={this.onOk}
      >
        <form>
          <label className="a-form__label">
            <span className="a-form__label-name">Название:</span>
            <Input 
              name="name"
              value={data.name}
              defaultValue={data.name}
              onChange={this.handleChange}
              className="required"
            />
            <span className="a-form__required">Заполните поле</span>
          </label>
          <div className="a-form__block">
            <div className="a-form__block-name"><p>Описание:</p></div>
            {
              (!this.state.showEditor) 
                ? (<div className="a-form__editor">
                    <div className="a-form__editor__area" 
                      contentEditable="true" 
                      ref={this.textDescription}
                      onPaste={this.pastTextToEditor}
                      onFocus={this.setEditParagraph}
                      dangerouslySetInnerHTML={{__html: data.description}}
                    ></div>
                    <div className="a-form__editor__toolbar">
                      <Popover placement="left" content={<p>Заголовок</p>}>
                        <a href="#0" 
                          onClick={this.setEditCaption}>H</a>
                      </Popover>
                      <Popover placement="left" content={<p>Параграф</p>}>
                        <a href="#0" 
                          onClick={this.setEditParagraph}>P</a>
                      </Popover>
                      <Popover placement="left" content={<p>Выделение</p>}>
                        <a href="#0" 
                          onClick={this.setEditBold}><BoldOutlined /></a>
                      </Popover>
                      <Popover placement="left" content={<p>Список</p>}>
                        <a href="#0" 
                          onClick={this.setEditList}><UnorderedListOutlined /></a>
                      </Popover>
                    </div>
                  </div>)
                : (
                  <div>
                    <textarea className="a-form__editor__view" ref={this.textDescriptionHTML}
                      onChange={this.onChangeText}
                      defaultValue={data.description.toString()}
                    >
                    </textarea>
                  </div>
                )
            }
            <div>
              <Checkbox onChange={this.onShowEditor}>Показать исходный код</Checkbox>
              <span className="a-form__required">Заполните поле</span>
            </div>
          </div>
          <div className="a-form__block">
            <div className="a-form__block-name"><p>Кличество цилиндров:</p></div>
            <div className="a-form__checkbox">
              <Checkbox.Group defaultValue={data.cylinder} onChange={this.selectCylinder}>
                <Checkbox value="4">4</Checkbox>
                <Checkbox value="6">6</Checkbox>
                <Checkbox value="8">8</Checkbox>
              </Checkbox.Group>
            </div>
            <span className="a-form__required">Заполните поле</span>
          </div>
        </form>
      </Modal>
    );
  }
};

export default ModalAddEquipment;