const keys = require('../keys')

module.exports = function(email, data) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Сообщение с сайта ' + keys.NAME_SITE,
    html: `
      <h1>Заявка с сайта ${keys.NAME_SITE} ${data.city && (' | ' + data.city) || ''}</h1>
      <hr />
      <p><b>Тип заявки</b>: ${data.type || '-'}</p>
      <p><b>Описание</b>: ${data.description || '-'}</p>
      <p><b>Со страницы сайта</b>: ${data.page || '-'}</p>
      <p><b>При нажатии на кнопку</b>: ${data.btn || '-'}</p>
      <hr />
      <p><b>Имя</b>: ${data.name || '-'}</p>
      <p><b>Телефон</b>: ${data.phone || '-'}</p>
      <p><b>Город</b>: ${data.city || '-'}</p>
    `
  }
}