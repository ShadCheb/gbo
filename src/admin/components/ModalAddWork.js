import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Upload, Button, Input } from 'antd';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';

const { Dragger } = Upload;


function ModalAddWork({
  csrf, data, handlerChangesData, cancelAddWork, 
  visibleAddWork, changeValue, setLoading
}) {

  const uploadAvatar = async (fileAvatar) => {
    let promise = new Promise((resolve, reject) => {
      let sendForm = new FormData();
    
      sendForm.append('filedata', fileAvatar);

      fetch('/upload', {
        method: 'post',
        headers: {
          'X-XSRF-TOKEN': csrf
        },
        body: sendForm
      })
        .then(res => res.json())
        .then(data => { 
          handlerChangesData({fileAvatar: null}, true); // проверить

          if (data.success)
            resolve(data.success.filename);
        })
        .catch(e => {
          if (e.error) {
            handlerChangesData(e.error);

            reject();
          }
        });
    });

    return await promise;
  }

  const uploadGallery = (fileGallery) => {
    let result = fileGallery.map(async img => {
      let promise = new Promise((resolve, reject) => {
        let sendForm = new FormData();

        sendForm.append('filedata', img);
    
        fetch('/upload', {
          method: 'post',
          headers: {
            'X-XSRF-TOKEN': csrf
          },
          body: sendForm
        })
          .then(res => res.json())
          .then(data => {
            handlerChangesData({fileGallery: null}, true); // проверить

            if (data.success)
              resolve(data.success.filename);
          })
          .catch(e => {
            if (e.error) {
              handlerChangesData(e.error);
    
              reject();
            }
          });
      });

      return await promise;
    });

    return Promise.all(result);
  }

  const onOk = async () => {
    setLoading(true);

    let avatar = (data.avatarFileList && data.avatarFileList.length) 
      ? data.avatarFileList[0].name
      : '';
    let gallery = data.gallery;

    // сначала загружаем картинку, если она есть
    if (data.fileAvatar) 
      avatar = await uploadAvatar(data.fileAvatar);

    if (data.fileGallery) {
      let newGallery = await uploadGallery(data.fileGallery);

      if (newGallery) 
        gallery = (gallery && gallery.length)
          ? gallery.concat(newGallery)
          : newGallery;
    }

    // Теперь сохраняем данный в БД
    let sendForm = new FormData();
    let established = (data.established) ? data.established : [];
    let additionally = (data.additionally) ? data.additionally : [];

    if (data.id) {
      sendForm.append('id', data.id);
    }
    sendForm.append('name', data.name);
    sendForm.append('mileage', parseInt(data.mileage));
    sendForm.append('saving', parseInt(data.saving));
    sendForm.append('avatar', avatar);
    sendForm.append('established', established.join(','));
    sendForm.append('additionally', additionally.join(','));
    sendForm.append('gallery', gallery.join(','));
    sendForm.append('city_list_id', data.cityListId);

    fetch('/admin/work', {
      method: 'post',
      headers: {
        'X-XSRF-TOKEN': csrf
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

          handlerChangesData({work: data.result});
        }
      })
      .catch(e => {
        if (e.error)
          handlerChangesData(e.error);
      });

    setLoading(false);
    cancelAddWork();
  }

  const beforeUploadAvatar = (file) => {
    let avatarFileList = [{
      uid: '-1',
      name: file.name,
      status: 'done',
      url: file.name,
    }];

    changeValue({avatarFileList});
  }

  const beforeUploadGallery = (file) => {
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

    changeValue({galleryFileList});
  }

  const onRemoveAvatar = file => {
    const index = data.avatarFileList.indexOf(file);
    const newFileList = data.avatarFileList.slice();

    newFileList.splice(index, 1);

    changeValue({avatarFileList: newFileList}); 
  }
  const onRemoveGallery = file => {
    const index = data.galleryFileList.indexOf(file);
    const newFileList = data.galleryFileList.slice();
    const newGallery = data.gallery.slice();

    newFileList.splice(index, 1);
    newGallery.splice(index, 1);

    changeValue({
      galleryFileList: newFileList,
      gallery: newGallery
    }); 
  }
  
  const onChange = () => {
    return;
  }

  const handleChange = e => {
    let target = e.target;

    changeValue({[target.name]: target.value});
  }

  // Если добавили новый файл
  const customRequestAvatar = value => {
    changeValue({fileAvatar: value.file});
  }
  const customRequestGallery = value => {
    let fileGallery = (data.fileGallery)
      ? data.fileGallery
      : [];

    fileGallery.push(value.file);

    changeValue({fileGallery});
  }

  const addRowEstablished = e => {
    let row = e.target.closest('.a-form__row');
    let value = row.querySelector('#js-input-established').value;
    let established = (data.established) 
      ? data.established.slice()
      : [];

    established.push(value);
    value = '';

    changeValue({established});
  }

  const addRowAdditionally = e => {
    let row = e.target.closest('.a-form__row');
    let value = row.querySelector('#js-input-additionally').value;
    let additionally = (data.additionally) 
      ? data.additionally.slice()
      : [];

    additionally.push(value);
    value = '';
    
    changeValue({additionally});
  }

  return (
    <Modal
      visible={visibleAddWork}
      title={(data.id) ? 'Редактирование статьи' : 'Добавление статьи'}
      okText="Сохранить"
      cancelText="Отмена"
      onCancel={cancelAddWork}
      onOk={onOk}
    >
      <form>
        <Dragger 
          name='avatarFileList'
          fileList={data.avatarFileList}
          onRemove={onRemoveAvatar}
          onChange={onChange}
          beforeUpload={beforeUploadAvatar}
          customRequest={customRequestAvatar}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            className="required"
          />
          <span className="a-form__required">Заполните поле</span>
        </label>
        

        <span className="a-form__label-name">Установлено:</span>
        {
          data.established && data.established.map((item, idx) => 
            (<label className="a-form__label" key={idx}>
              <Input 
                defaultValue={item}
              />
              <span className="a-form__required">Заполните поле</span>
            </label>)) || (<p>Нет информации</p>)
        }
        <div className="a-form__row">
          <label className="a-form__label">
            <Input id="js-input-established" />
            <span className="a-form__required">Заполните поле</span>
          </label>
          <Button 
            type="primary"
            onClick={addRowEstablished}
            icon={<PlusOutlined />}
          ></Button>
        </div>

        <span className="a-form__label-name">Дополнительно:</span>
        {
          data.additionally && data.additionally.map((item, idx) => 
            (<label className="a-form__label" key={idx}>
              <Input 
                value={item}
              />
              <span className="a-form__required">Заполните поле</span>
            </label>)) || (<p>Нет информации</p>)
        }
        <div className="a-form__row">
          <label className="a-form__label">
            <Input id="js-input-additionally" />
            <span className="a-form__required">Заполните поле</span>
          </label>
          <Button 
            type="primary"
            onClick={addRowAdditionally}
            icon={<PlusOutlined />}
          ></Button>
        </div>

        {/* <hr className="form__shift" /> */}

        <Dragger 
          multiple={true}
          name='galleryFileList'
          fileList={data.galleryFileList}
          onRemove={onRemoveGallery}
          onChange={onChange}
          beforeUpload={beforeUploadGallery}
          customRequest={customRequestGallery}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">Галерея</p>
          <p className="ant-upload-hint">Выберите или переместите файл для загрузки</p>
        </Dragger>
        
      </form>
    </Modal>
  );
};

export default ModalAddWork;