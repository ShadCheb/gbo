const fs = require('fs');
const path = require('path');

class Apifile {
  constructor(file) {
    this.file = file
  }

  async save() {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'data.txt'),
        JSON.stringify(this.file),
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  static read() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'data.txt'),
        'utf8',
        (err, content) => {
          if (err) {
            reject(err)
          } else {
            resolve(content)
          }
        }
      )
    })
  }
}

module.exports = Apifile