import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { 
  Modal, 
  Popover, 
  Input, 
  Checkbox, 
  Button, 
  Upload 
} from 'antd';
import { 
  BoldOutlined, 
  UnorderedListOutlined,
  PlusOutlined, 
  MinusOutlined ,
  UploadOutlined 
} from '@ant-design/icons';

const { TextArea } = Input;
const temlpateCompositions = {
  compositionMain: {
    name: '',
    composition_type: 'main'
  },
  compositionAdd: {
    name: '',
    price: '',
    composition_type: 'additional'
  }
}


class ModalAddEquipment extends Component {
  constructor(props) {
    super(props);

    this.textDescription = React.createRef(),
    this.textDescriptionHTML = React.createRef(),

    this.state = {
      showEditor: false,
      compositionMain: temlpateCompositions.compositionMain,
      compositionAdd: temlpateCompositions.compositionAdd,
      compositionType: {
        main: 'compositionMain',
        add: 'compositionAdd'
      },
      delListIdCompositions: [],
      visibleGallery: false,
      selectImage: null,
      galleryForComposition: null,
      loadGallery: false,
      galleryList: []
    }
  }

  componentDidMount = () => {
    document.execCommand('defaultParagraphSeparator', false, 'p'); // Установка по умолчанию
  }

  uploadImage = async (file) => {
    let promise = new Promise((resolve, reject) => {
      let sendForm = new FormData();

      sendForm.append('filedata', file);
  
      fetch('/upload', {
        method: 'post',
        headers: {
          'X-XSRF-TOKEN': this.props.csrf
        },
        body: sendForm
      })
        .then(res => res.json())
        .then(data => { 
          if (data.success) 
            resolve({ image: data.success.filename });
        })
        .catch(e => {
          if (e.error) {
            console.log('error', error);  
            reject();
          }
        });
    });

    return await promise;
  }

  onCancel = () => {

    this.setState({
      compositionMain: temlpateCompositions.compositionMain,
      compositionAdd: temlpateCompositions.compositionAdd,
     });
    this.props.cancelAddEquipment();
  }

  onOk = async () => {
    let sendForm = new FormData();
    let { data } = this.props;
    let description = (this.state.showEditor)
      ? this.textDescriptionHTML.current.textContent
      : this.textDescription.current.innerHTML;
    let cylinder = data.cylinder && data.cylinder.join(',') || null;
    const compositionMain = data.compositionMain || [];
    const compositionAdd = data.compositionAdd || [];

    this.props.setLoading(true);

    // сначала загружаем картинку, если она есть
    const resultUpload = [ ...compositionMain, ...compositionAdd ].map(async (composition) => (
      new Promise(async (resolve, reject) => {
        if (composition.fileCustom) {
          const res = await this.uploadImage(composition.fileCustom);
  
          if (res.image) {  
            composition['image'] = {
              ...composition.image
            }
            composition.image.name = res.image;
            composition.image['update'] = true;
            delete composition.fileCustom;
            delete composition.fileBefore;
          }
        }
        resolve();
      })
    ));

    await Promise.all(resultUpload);

    if (data.id) {
      sendForm.append('id', data.id);
    }
    sendForm.append('name', data.name || '');
    sendForm.append('tagline', data.tagline || '');
    sendForm.append('summary', data.summary || '');
    sendForm.append('description', description || '');
    sendForm.append('cylinder', cylinder || '');
    sendForm.append('cityListId', data.cityListId || '');
    sendForm.append('compositionMain', JSON.stringify(compositionMain));
    sendForm.append('compositionAdd', JSON.stringify(compositionAdd));
    sendForm.append('deleteList', this.state.delListIdCompositions 
      && JSON.stringify(this.state.delListIdCompositions) || JSON.stringify([]));

    fetch('/admin/equipment', {
      method: 'post',
      headers: {
        'X-XSRF-TOKEN': this.props.csrf
      },
      body: sendForm
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ delListIdCompositions: [] });

        const equipments = data.result;

        if (equipments) {
          const result = equipments.map(item => {
            item.cylinder = item.cylinder.split(','); // Строку в массив
            while (item.cylinder.length < 3) {
              item.cylinder.push('');
            }

            const composition_main = [];
            const composition_add = [];
            const compositions = [ ...item.compositions];

            compositions.map(composition => {
              if (composition.composition_type === 'main') {
                const template = {
                  id:    composition.composition_id,
                  name:  composition.name,
                  image: null
                }

                if (composition.image) {
                  template['image'] = {
                    ...composition.image
                  };
                  template['fileBefore'] = {
                    uid:    '-1',
                    name:   composition.image.name,
                    status: 'done',
                    url:    composition.image.name,
                  };
                }
                composition_main.push(template);
              } else if (composition.composition_type === 'additional') {
                const template = {
                  id:    composition.composition_id,
                  name:  composition.name,
                  price: composition.price,
                  image: null
                }
                if (composition.image) {
                  template['image'] = {
                    ...composition.image
                  };
                  template['fileBefore'] = {
                    uid:    '-1',
                    name:   composition.image.name,
                    status: 'done',
                    url:    composition.image.name,
                  };
                }
                composition_add.push(template);
              }
            });
            delete item.compositions;
            item['compositionMain'] = composition_main;
            item['compositionAdd'] = composition_add;
  
            return item;
          });

          this.props.handlerChangesData({ equipment: result });
        }

        this.props.setLoading(false);
      })
      .catch(e => {
        this.props.setLoading(false);
        
        if (e.error)
          this.props.handlerChangesData({ error: e.error });
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

  selectCylinder = (id, e) => {
    const target = e.target;
    const value = target.value || target.contentText;
    const cylinder = [ ...this.props.data.cylinder];

    cylinder[id] = value;
    this.props.changeValue({ cylinder });
  }

  onChangeText = (e) => {
    this.props.changeValue({ description: e.target.value });
  }

  addRowComposition = (type) => {
    const typeName = this.state.compositionType[type];
    let data = this.props.data;
    let compositions = (data[typeName]) 
      ? [ ...data[typeName] ]
      : [];

    compositions.push({ ...this.state[typeName] });
    this.props.changeValue({ [typeName]: compositions });
    this.setState({ [typeName]: temlpateCompositions[typeName] });
  }

  deleteRowComposition = (idx, type) => {
    const typeName = this.state.compositionType[type];
    let compositions = [ ...this.props.data[typeName] ];
    const delListIdCompositions = [ ...this.state.delListIdCompositions ];

    delListIdCompositions.push(compositions[idx].id);
    compositions.splice(idx, 1);
    this.props.changeValue({ [typeName]: compositions });
    this.setState({ delListIdCompositions });
  }


  onChangeComposition = (idx, type, key, e) => {
    const value = e.target.value;
    const typeName = this.state.compositionType[type];
    let compositions = [ ...this.props.data[typeName] ];

    compositions[idx][key] = value;
    compositions[idx]['update'] = true; // Обновляем файл
    this.props.changeValue({ [typeName]: compositions });
  }

  onChangeNewComposition = (type, key, e) => {
    const value = e.target.value;
    const typeName = this.state.compositionType[type];
    let composition;

    if (!key || !type || !this.state[typeName].hasOwnProperty(key)) {
      return;
    }

    composition = { ...this.state[typeName] };
    composition[key] = value;
    this.setState({ [typeName]: composition });
  }


  // Если добавили новый файл
  customRequest = (idx, type, data) => {
    const typeName = this.state.compositionType[type];
    let compositions = [ ...this.props.data[typeName] ];

    compositions[idx]['fileCustom'] = data.file;
    compositions[idx]['update'] = true;
    this.props.changeValue({ [typeName]: compositions });
  }

  beforeUpload = (idx, type, image) => {
    const typeName = this.state.compositionType[type];
    let compositions = [ ...this.props.data[typeName] ];
    let img = [{
      uid: '-1',
      name: image.name,
      status: 'done',
      url:  image.name,
    }];

    compositions[idx]['fileBefore'] = img;
    this.props.changeValue({ [typeName]: compositions });
  }

  onChangeUpload = () => {
    return;
  }

  onOpenModalGallery = async(idx, type) => {
    this.setState({
      visibleGallery: true,
      loadGallery: true,
      galleryForComposition: {
        idx,
        type
      }
    });

    const gallery = await this.getGallery();

    if (gallery.result) {
      this.setState({ 
        galleryList: gallery.result,
        loadGallery: false
      });
    } else {
      this.setState({ loadGallery: false });
    }
  }

  getGallery = async () => {
    let result = [];
    let error;

    await fetch('/admin/equipment/gallery', {
      method: 'post',
      headers: {
        'X-XSRF-TOKEN': this.props.csrf
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          result = data.result;
        }
      })
      .catch(e => {
        console.error(e);
        this.props.setLoading(false);
        
        if (e.error) {
          this.props.handlerChangesData(e.error);
          error = e.error;
        }
      });

    return ({ result, error });
  }

  onCancelGallery = async () => {
    this.setState({
      galleryForComposition: null,
      selectImage:           null,
      visibleGallery:        false 
    });
  }

  onOkGallery = () => {
    const image = this.state.selectImage && this.state.selectImage.name;
    const { idx, type } = this.state.galleryForComposition;

    if (!image) {
      return;
    }

    const typeName = this.state.compositionType[type];
    let compositions = [ ...this.props.data[typeName] ];
    let img = [{
      uid:     '-1',
      name:    image,
      status:  'done',
      url:     image,
    }];

    compositions[idx]['fileBefore'] = img;
    compositions[idx]['image'] = {
      name:      image,
      table:     'composition',
      type:      'repeat',
      update:    true,
      image_id:  compositions[idx].id
    }
    compositions[idx]['update'] = true;
    delete compositions[idx]['fileCustom'];

    this.props.changeValue({ [typeName]: compositions });
    this.onCancelGallery();
  }

  onSelectFromGallery = (image, e) => {
    e.preventDefault();
    this.setState({ selectImage: image });
  }


  render() {
    const { data, visibleAddEquipment } = this.props;

    return (
      <>
        <Modal
          visible={visibleAddEquipment}
          title={(data.id) ? 'Редактирование оборудования' : 'Добавление оборуования'}
          okText="Сохранить"
          cancelText="Отмена"
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <form>
            <div className="a-form__block">
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
                <span className="a-form__label-name">Слоган:</span>
                <Input 
                  name="tagline"
                  value={data.tagline}
                  defaultValue={data.tagline}
                  onChange={this.handleChange}
                />
                <span className="a-form__required">Заполните поле</span>
              </label>
              <label className="a-form__label">
                <span className="a-form__label-name">Краткое описание:</span>
                <TextArea
                  name="summary"
                  value={data.summary}
                  defaultValue={data.summary}
                  onChange={this.handleChange}
                >
                </TextArea>
                <span className="a-form__required">Заполните поле</span>
              </label>
            </div>

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

            {data.cylinder
              ? (
                <div className="a-form__block">
                  <div className="a-form__row a-childrens__row">
                    <div className="a-childrens__col">
                      <label className="a-form__label">
                        <span className="a-form__label-name">4 цилиндра:</span>
                        <Input 
                          name="cylinder4"
                          value={data.cylinder[0]}
                          defaultValue={data.cylinder[0]}
                          onChange={(e) => this.selectCylinder(0, e)}
                          className="required"
                        />
                        <span className="a-form__required">Заполните поле</span>
                      </label>
                    </div>
                    <div className="a-childrens__col">
                      <label className="a-form__label">
                        <span className="a-form__label-name">6 цилиндров:</span>
                        <Input 
                          name="cylinder6"
                          value={data.cylinder[1]}
                          defaultValue={data.cylinder[1]}
                          onChange={(e) => this.selectCylinder(1, e)}
                          className="required"
                        />
                        <span className="a-form__required">Заполните поле</span>
                      </label>
                    </div>
                    <div className="a-childrens__col">
                      <label className="a-form__label">
                        <span className="a-form__label-name">8 цилиндров:</span>
                        <Input 
                          name="cylinder8"
                          value={data.cylinder[2]}
                          defaultValue={data.cylinder[2]}
                          onChange={(e) => this.selectCylinder(2, e)}
                          className="required"
                        />
                        <span className="a-form__required">Заполните поле</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : null }

              <div className="a-form__block">
                <span className="a-form__label-name">Комплектация:</span>
                {
                  data.compositionMain && data.compositionMain.map((item, idx) => 
                  (
                    <div key={idx}>
                      <div className="a-form__row">
                        <div className="a-form__row a-composition__img">
                          {
                            (item.fileCustom)
                              ? <img src="/images/new-photo.jpg" />
                              : <img src={item.image ? '/images/' + item.image.name : '/images/not-photo.jpg'} />
                          }
                        </div>
                        <div className="a-row__length">
                          <div className="a-form__row">
                            <Upload 
                              multiple={false}
                              fileList={item.fileBefore}
                              showUploadList={false}
                              onChange={this.onChangeUpload}
                              beforeUpload={this.beforeUpload.bind(this, idx, 'main')}
                              customRequest={this.customRequest.bind(this, idx, 'main')}
                            >
                              <Button>
                                <UploadOutlined />Загрузить новую
                              </Button>
                            </Upload>
                            <Button 
                              type="default"
                              onClick={() => this.onOpenModalGallery(idx, 'main')}
                            >Выбрать из применяемых</Button>
                          </div>
                          <div className="a-form__row">
                            <label className="a-form__label">
                              <Input 
                                value={item.name}
                                defaultValue={item.name}
                                onChange={this.onChangeComposition.bind(this, idx, 'main', 'name' )}
                                placeholder="Название"
                              />
                              <span className="a-form__required">Заполните поле</span>
                            </label>
                            <Button 
                              className="a-form__btn-icon"
                              type="primary"
                              onClick={this.deleteRowComposition.bind(this, idx, 'main')}
                              icon={<MinusOutlined />}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || (<p>Нет информации</p>)
                }
                <div className="a-form__row">
                  <label className="a-form__label">
                    <Input
                      value={this.state.compositionMain.name}
                      onChange={this.onChangeNewComposition.bind(this, 'main', 'name')}
                      placeholder="Название"
                    />
                    <span className="a-form__required">Заполните поле</span>
                  </label>
                  <Button 
                    className="a-form__btn-icon"
                    type="primary"
                    onClick={this.addRowComposition.bind(this, 'main')}
                    icon={<PlusOutlined />}
                  ></Button>
                </div>
              </div>
              <div className="a-form__block">
                <span className="a-form__label-name">Дополнительное оборудование:</span>
                {
                  data.compositionAdd && data.compositionAdd.map((item, idx) => 
                  (
                    <div key={idx}>
                      <div className="a-form__row">
                        <div className="a-form__row a-composition__img">
                          {
                            (item.fileCustom)
                              ? <img src="/images/new-photo.jpg" />
                              : <img src={item.image ? '/images/' + item.image.name : '/images/not-photo.jpg'} />
                          }
                        </div>
                        <div className="a-row__length">
                          <div className="a-form__row">
                            <Upload 
                              multiple={false}
                              fileList={item.fileBefore}
                              showUploadList={false}
                              onChange={this.onChangeUpload}
                              beforeUpload={this.beforeUpload.bind(this, idx, 'add')}
                              customRequest={this.customRequest.bind(this, idx, 'add')}
                            >
                              <Button>
                                <UploadOutlined />Загрузить новую
                              </Button>
                            </Upload>
                            <Button 
                              type="default"
                              onClick={() => this.onOpenModalGallery(idx, 'add')}
                            >Выбрать из применяемых</Button>
                          </div>
                          <div className="a-form__row">
                          <label className="a-form__label">
                            <Input 
                              value={item.name}
                              defaultValue={item.name}
                              onChange={this.onChangeComposition.bind(this, idx, 'add', 'name' )}
                              placeholder="Название"
                            />
                            <span className="a-form__required">Заполните поле</span>
                          </label>
                          <label className="a-form__label">
                            <Input 
                              value={item.price}
                              defaultValue={item.price}
                              onChange={this.onChangeComposition.bind(this, idx, 'add', 'price' )}
                              placeholder="Цена"
                            />
                            <span className="a-form__required">Заполните поле</span>
                          </label>
                          <Button 
                            className="a-form__btn-icon"
                            type="primary"
                            onClick={this.deleteRowComposition.bind(this, idx, 'add')}
                            icon={<MinusOutlined />}
                          />
                        </div>
                        </div>
                      </div>
                    </div>
                  )) || (<p>Нет информации</p>)
                }
                <div className="a-form__row">
                  <label className="a-form__label">
                    <Input
                      value={this.state.compositionAdd.name}
                      onChange={this.onChangeNewComposition.bind(this, 'add', 'name')}
                      placeholder="Название"
                    />
                    <span className="a-form__required">Заполните поле</span>
                  </label>
                  <label className="a-form__label">
                    <Input
                      value={this.state.compositionAdd.price}
                      onChange={this.onChangeNewComposition.bind(this, 'add', 'price')}
                      placeholder="Цена"
                    />
                    <span className="a-form__required">Заполните поле</span>
                  </label>
                  <Button 
                    className="a-form__btn-icon"
                    type="primary"
                    onClick={this.addRowComposition.bind(this, 'add')}
                    icon={<PlusOutlined />}
                  ></Button>
                </div>
              </div>
          </form>
        </Modal>

        <Modal
          visible={this.state.visibleGallery}
          title="Галерея"
          okText="Выбрать"
          cancelText="Отмена"
          onCancel={this.onCancelGallery}
          onOk={this.onOkGallery}
        >
          <div className="a-gallery__content">
            {
              this.state.galleryList.map(image => (
                <div 
                  key={image.image_id}
                  className={(this.state.selectImage && image.image_id === this.state.selectImage.image_id) ? 'a-gallery__img active' : 'a-gallery__img'}
                >
                  <a onClick={(e) => this.onSelectFromGallery(image, e)}>
                    <img src={'/images/' + image.name} />
                  </a>
                </div>
              ))
            }
          </div>
        </Modal>
      </>
    );
  }
};

export default ModalAddEquipment;