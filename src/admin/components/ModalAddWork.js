import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Upload, Button, Input, Popover, Checkbox } from 'antd';
import { 
  InboxOutlined, 
  PlusOutlined, 
  BoldOutlined, 
  UnorderedListOutlined,
  MinusOutlined 
} from '@ant-design/icons';


const { Dragger } = Upload;


class ModalAddWork extends Component {
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
  }

  uploadAvatar = async (fileAvatar) => {
    let promise = new Promise((resolve, reject) => {
      let sendForm = new FormData();
    
      sendForm.append('filedata', fileAvatar);

      fetch('/upload', {
        method: 'post',
        headers: {
          'X-XSRF-TOKEN': this.props.csrf
        },
        body: sendForm
      })
        .then(res => res.json())
        .then(data => { 
          this.props.handlerChangesData({fileAvatar: null}, true); // проверить

          if (data.success)
            resolve(data.success.filename);
        })
        .catch(e => {
          if (e.error) {
            this.props.handlerChangesData(e.error);

            reject();
          }
        });
    });

    return await promise;
  }

  uploadGallery = (fileGallery) => {
    let result = fileGallery.map(async img => {
      let promise = new Promise((resolve, reject) => {
        let sendForm = new FormData();

        sendForm.append('filedata', img);
    
        fetch('/upload', {
          method: 'post',
          headers: {
            'X-XSRF-TOKEN': this.props.csrf
          },
          body: sendForm
        })
          .then(res => res.json())
          .then(data => {
            this.props.handlerChangesData({fileGallery: null}, true); // проверить

            if (data.success)
              resolve(data.success.filename);
          })
          .catch(e => {
            if (e.error) {
              this.props.handlerChangesData(e.error);
    
              reject();
            }
          });
      });

      return await promise;
    });

    return Promise.all(result);
  }

  onOk = async () => {
    let data = this.props.data;

    this.props.setLoading(true);

    let avatar = (data.avatarFileList && data.avatarFileList.length) 
      ? data.avatarFileList[0].name
      : '';
    let gallery = data.gallery;

    // сначала загружаем картинку, если она есть
    if (data.fileAvatar) 
      avatar = await this.uploadAvatar(data.fileAvatar);

    if (data.fileGallery) {
      let newGallery = await this.uploadGallery(data.fileGallery);

      if (newGallery) 
        gallery = (gallery && gallery.length)
          ? gallery.concat(newGallery)
          : newGallery;
    }

    // Теперь сохраняем данный в БД
    let sendForm = new FormData();
    let established = (data.established) ? data.established : [];
    let additionally = (data.additionally) ? data.additionally : [];
    let description = (this.state.showEditor)
      ? this.textDescriptionHTML.current.textContent
      : this.textDescription.current.innerHTML;
    let mileage = data.mileage && parseInt(data.mileage) || null;
    let saving = data.saving && parseInt(data.saving) || null;

    if (data.id) {
      sendForm.append('id', data.id);
    }
    sendForm.append('name', data.name);
    if (mileage)
      sendForm.append('mileage', mileage);
    if (saving)
      sendForm.append('saving', saving);
    sendForm.append('avatar', avatar);
    if (established)
      sendForm.append('established', established.join(','));
    if (additionally)
      sendForm.append('additionally', additionally.join(','));
    if (gallery)
      sendForm.append('gallery', gallery.join(','));
    sendForm.append('city_list_id', data.cityListId);
    sendForm.append('description', description);

    fetch('/admin/work', {
      method: 'post',
      headers: {
        'X-XSRF-TOKEN': this.props.csrf
      },
      body: sendForm
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          data.result.map(work => {
            work.established = (work.established)
              ? work.established.split(',')
              : [];
            work.additionally = (work.additionally) 
              ? work.additionally.split(',')
              : [];
            work.gallery = (work.gallery) 
              ? work.gallery.split(',')
              : [];
          });

          this.props.handlerChangesData({work: data.result});
        }
      })
      .catch(e => {
        if (e.error)
          this.props.handlerChangesData(e.error);
      });

    this.props.setLoading(false);
    this.props.cancelAddWork();
  }

  beforeUploadAvatar = (file) => {
    let avatarFileList = [{
      uid: '-1',
      name: file.name,
      status: 'done',
      url: file.name,
    }];

    this.props.changeValue({avatarFileList});
  }

  beforeUploadGallery = (file) => {
    let data = this.props.data;

    let galleryFileList = (data.galleryFileList && data.galleryFileList.length)
      ? data.galleryFileList.slice()
      : [];
    let uid = (data.galleryFileList && data.galleryFileList.length)
      ? (+galleryFileList[galleryFileList.length - 1].uid + 1).toString()
      : '-1';

    galleryFileList.push({
      uid,
      name: file.name,
      status: 'done',
      url: file.name,
    });

    this.props.changeValue({galleryFileList});
  }

  onRemoveAvatar = file => {
    let data = this.props.data;    
    const index = data.avatarFileList.indexOf(file);
    const newFileList = data.avatarFileList.slice();

    newFileList.splice(index, 1);

    this.props.changeValue({avatarFileList: newFileList}); 
  }
  onRemoveGallery = file => {
    let data = this.props.data;
    const index = data.galleryFileList.indexOf(file);
    const newFileList = data.galleryFileList.slice();
    const newGallery = data.gallery.slice();

    newFileList.splice(index, 1);
    newGallery.splice(index, 1);

    this.props.changeValue({
      galleryFileList: newFileList,
      gallery: newGallery
    });
  }
  
  onChange = (file) => {
    if (file.file && file.file.status == 'removed') {
      this.props.changeValue({fileAvatar: null});
    } else 
      return;
  }

  onChangeGallery = (file) => {
    if (file.file && file.file.status == 'removed') {
      let data = this.props.data;
      let fileGallery = (data.fileGallery && data.fileGallery.length)
        ? data.fileGallery.slice()
        : [];
      let name = file.file.name;

      let deleteIdx = fileGallery.findIndex((element) => element.name == name);

      if (deleteIdx > -1) {
        fileGallery.splice(deleteIdx, 1);
      }

      this.props.changeValue({fileGallery});
    } else 
      return;
  }

  handleChange = e => {
    let target = e.target;

    this.props.changeValue({[target.name]: target.value});
  }

  // Если добавили новый файл
  customRequestAvatar = value => {
    this.props.changeValue({fileAvatar: value.file});
  }
  customRequestGallery = value => {
    let data = this.props.data;
    let fileGallery = (data.fileGallery)
      ? data.fileGallery
      : [];

    fileGallery.push(value.file);

    this.props.changeValue({fileGallery});
  }

  addRowEstablished = e => {
    let data = this.props.data;
    let row = e.target.closest('.a-form__row');
    let value = row.querySelector('#js-input-established').value;
    let established = (data.established) 
      ? data.established.slice()
      : [];

    established.push(value);
    value = '';

    this.props.changeValue({established});
  }

  deleteRowEstablished = (idx) => {
    let established = this.props.data.established.slice();

    established.splice(idx, 1);
    this.props.changeValue({established});
  }

  addRowAdditionally = e => {
    let data = this.props.data;
    let row = e.target.closest('.a-form__row');
    let value = row.querySelector('#js-input-additionally').value;
    let additionally = (data.additionally) 
      ? data.additionally.slice()
      : [];

    additionally.push(value);
    value = '';
    
    this.props.changeValue({additionally});
  }

  deleteRowAdditionally = (idx) => {
    let additionally = this.props.data.additionally.slice();

    additionally.splice(idx, 1);
    this.props.changeValue({additionally});
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

  onChangeText = (e) => {
    this.props.changeValue({description: e.target.value});
  }

  onChangeEstablished = (idx, e) => {
    let established = this.props.data.established;

    established[idx] = e.target.value;
    this.props.changeValue({established});
  }

  onChangeAdditionally = (idx, e) => {
    let additionally = this.props.data.additionally;

    additionally[idx] = e.target.value;
    this.props.changeValue({additionally});
  }

  render() {
    let {data, visibleAddWork, cancelAddWork} = this.props;

    return (
      <Modal
        visible={visibleAddWork}
        title={(data.id) ? 'Редактирование статьи' : 'Добавление статьи'}
        okText="Сохранить"
        cancelText="Отмена"
        onCancel={cancelAddWork}
        onOk={this.onOk}
      >
        <form>
          <Dragger 
            name='avatarFileList'
            fileList={data.avatarFileList}
            onRemove={this.onRemoveAvatar}
            onChange={this.onChange}
            beforeUpload={this.beforeUploadAvatar}
            customRequest={this.customRequestAvatar}
          >
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">Главное изображение</p>
            <p className="ant-upload-hint">Выберите или переместите файл для загрузки</p>
          </Dragger>

          <hr className="form__shift" />

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

          <label className="a-form__label">
            <span className="a-form__label-name">Пробег:</span>
            <Input 
              name="mileage"
              value={data.mileage}
              defaultValue={data.mileage}
              onChange={this.handleChange}
              className="required"
            />
            <span className="a-form__required">Заполните поле</span>
          </label>

          <label className="a-form__label">
            <span className="a-form__label-name">Экономия:</span>
            <Input 
              name="saving"
              value={data.saving}
              defaultValue={data.saving}
              onChange={this.handleChange}
              className="required"
            />
            <span className="a-form__required">Заполните поле</span>
          </label>
          

          <span className="a-form__label-name">Установлено:</span>
          {
            data.established && data.established.map((item, idx) => 
              (
                <div className="a-form__row" key={idx}>
                  <label className="a-form__label">
                    <Input 
                      value={item}
                      defaultValue={item}
                      onChange={this.onChangeEstablished.bind(this, idx)}
                    />
                    <span className="a-form__required">Заполните поле</span>
                  </label>
                  <Button 
                    type="primary"
                    onClick={this.deleteRowEstablished.bind(this, idx)}
                    icon={<MinusOutlined />}
                  ></Button>
                </div>
              )) || (<p>Нет информации</p>)
          }
          <div className="a-form__row">
            <label className="a-form__label">
              <Input id="js-input-established" />
              <span className="a-form__required">Заполните поле</span>
            </label>
            <Button 
              type="primary"
              onClick={this.addRowEstablished}
              icon={<PlusOutlined />}
            ></Button>
          </div>

          <span className="a-form__label-name">Дополнительно:</span>
          {
            data.additionally && data.additionally.map((item, idx) => 
              (
                <div className="a-form__row" key={idx}>
                  <label className="a-form__label">
                    <Input 
                      value={item}
                      defaultValue={item}
                      onChange={this.onChangeAdditionally.bind(this, idx)}
                    />
                    <span className="a-form__required">Заполните поле</span>
                  </label>
                  <Button 
                    type="primary"
                    onClick={this.deleteRowAdditionally.bind(this, idx)}
                    icon={<MinusOutlined />}
                  ></Button>
                </div>
              )) || (<p>Нет информации</p>)
          }
          <div className="a-form__row">
            <label className="a-form__label">
              <Input id="js-input-additionally" />
              <span className="a-form__required">Заполните поле</span>
            </label>
            <Button 
              type="primary"
              onClick={this.addRowAdditionally}
              icon={<PlusOutlined />}
            ></Button>
          </div>

          <Dragger 
            multiple={true}
            name='galleryFileList'
            fileList={data.galleryFileList}
            onRemove={this.onRemoveGallery}
            onChange={this.onChangeGallery}
            beforeUpload={this.beforeUploadGallery}
            customRequest={this.customRequestGallery}
          >
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">Галерея</p>
            <p className="ant-upload-hint">Выберите или переместите файл для загрузки</p>
          </Dragger>

          <div className="a-form__block">
            <div className="a-form__block-name"><p>Описание:</p></div>
            {
              (!this.state.showEditor) 
                ? (<div className="a-form__editor">
                    <div className="a-form__editor__area" 
                      contentEditable="true" 
                      ref={this.textDescription}
                      onPaste={this.pastTextToEditor}
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
          
        </form>
      </Modal>
    );
  }
};

export default ModalAddWork;