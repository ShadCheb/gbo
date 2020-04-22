import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Popconfirm } from 'antd';
import { FormOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import ModalAddAddress from './ModalAddAddress';

class Address extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      visibleAddAddress: false,
      openMapData: {},
      placemark: null
    }
  }


  deleteAddress = (address) => {
    let id = address.id;

    fetch('/admin/address/' + id, {
      method: 'delete',
      headers: {
        'X-XSRF-TOKEN': this.props.csrf
      }
    })
      .then(() => {
        let addresses = this.props.data.addresses.slice();

        addresses = addresses.filter(a => a.id !== id);
        this.props.handlerChangesData({addresses});
      })
      .catch(e => {
        if (e.error)
          this.props.handlerChangesData(e.error);
      })
  }

  openModalAddAddress = (address) => {
    if (address) {
      address['city'] = this.props.data.city;
    } else {
      address = {
        cityListId: this.props.data.id,
        city: this.props.data.city,
      }
    }

    address['nameAddress'] = address.address;

    this.setState(() =>
      ({
        openMapData: address,
        visibleAddAddress: true
      })
    );
    this.renderMap(address);
  }

  closeModalAddAddress = () => {
    this.setState({visibleAddAddress: false});
  }

  renderMap = (openMapData) => {
    let mapThis = this.state.map;
    let timerId;
    let coordParse = (openMapData.coords)
      ? JSON.parse(openMapData.coords)
      : null;

    const renderMapInternal = () => {
      clearInterval(timerId);

      if (!mapThis) {
        mapThis = new ymaps.Map('map-modal', {
          center: coordParse || [55.753994, 37.622093],
          zoom: 17,
          controls: ['zoomControl']
        });

        this.changeValue({map: mapThis});
      }

      // Если есть предыдущая точка на карте, то удаляем ее
      if (this.state.placemark)
        mapThis.geoObjects.remove(this.state.placemark);

      if (!coordParse) {
        let coords;

        ymaps.geocode(this.props.data.city, {
          results: 1
        }).then((res) => {
          let firstGeoObject = res.geoObjects.get(0);
          
          coords = firstGeoObject.geometry.getCoordinates();

          const setCoordPoint = (e) => {
            mapThis.events.remove("click", setCoordPoint);
            let newCoords = e.get('coords');

            ymaps.geocode(newCoords).then((res) => {
              let names = [];
              
              res.geoObjects.each((obj) => {
                names.push(obj.properties.get('name'));
              });

              if (names) 
                this.changeValue({
                  nameAddress: names[0],
                  coords: newCoords
                });
            });

            this.setPoint(newCoords);
          }
          
          mapThis.setCenter(coords, 17);
          mapThis.events.add('click', setCoordPoint);

          this.changeValue({map: mapThis});
        });
      } else {
        this.setPoint(coordParse);
        mapThis.setCenter(coordParse, 17);
      }
    }

    timerId = setInterval(() => {
      if (document.querySelector('#map-modal'))
        renderMapInternal();
    }, 400);
  }

  setPoint = (c) => {
    let plcmark = this.state.placemark;

    if (!plcmark) {
      plcmark = new ymaps.Placemark(c, {
        iconColor: '#00c2ff',
      }, {
        preset: 'islands#blueDotIcon',
        draggable: true
      });

      this.changeValue({placemark: plcmark});
    } else {
      plcmark.geometry.setCoordinates(c);
    }

    this.state.map.geoObjects.add(plcmark);
    plcmark.events.add('drag', () => {
      let coordPopint = plcmark.geometry.getCoordinates();

      ymaps.geocode(coordPopint).then((res) => {
        let names = [];
        
        res.geoObjects.each((obj) => {
          names.push(obj.properties.get('name'));
        });

        if (names) 
          this.changeValue({
            nameAddress: names[0],
            coord: coordPopint
          });
      });
    });
  }

  serachAddress = (text) => {
    let city = this.props.data.city || '';
    let geocoder = ymaps.geocode(`${city} ${text}`);

    geocoder.then(
      (res) => {
        let coord = res.geoObjects.get(0).geometry.getCoordinates();

        if (coord)
          this.state.map.setCenter(coord, 17);
      }
    );
  }

  changeValue = (obj) => {
    let openMapData = this.state.openMapData;

    for(let key in obj) {
      Object.assign(openMapData, {[key]: obj[key]})
    }
    this.setState(openMapData);
  }

  render() {
    return (
      <section>
        {this.props.data.addresses.map((address, idx) => {
          return (
            <div key={idx}>
              <div className="a-row a-row--border">
                <div className="a-col__1"><p>Адрес {idx + 1}:</p></div>
                <div className="a-col__2"><p className="text__p--blue">{address.address}</p></div>
                <Button 
                  type="primary"
                  onClick={this.openModalAddAddress.bind(this, address)}
                  icon={<FormOutlined />}
                />
                <Popconfirm title="Удалить?" 
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  okText="Да" 
                  cancelText="Нет"
                  onConfirm={this.deleteAddress.bind(this, address)}
                >
                  <Button 
                    type="primary"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>  
              </div>
            </div>
          )
        })}
        <div className="a-btn">
          <Button 
            type="primary"
            onClick={this.openModalAddAddress.bind(this, null)}
          >Добавить адрес</Button>
        </div>
        
        <ModalAddAddress 
          visibleAddAddress={this.state.visibleAddAddress}
          data={this.state.openMapData}
          csrf={this.props.csrf}
          cancelAddAddress={this.closeModalAddAddress}
          handlerChangesData={this.props.handlerChangesData}
          serachAddress={this.serachAddress}
        />
      </section>
    );
  }
}

export default Address;