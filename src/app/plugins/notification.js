import $ from 'jquery';

/**
 * jQuery plugin for showing notification 
 * @param {string} type Which type of notification will be shown
 * @param {string} text Which text need to be shown
 * @param {number} showTime How long notification will be shown
 */
$.fn.notification = (type, text, showTime) => {
  const template = `
    <div class="wrapper-notification">
      <div class="notification ${type}">
        <div class="notification-image">
          <i class="icon-tomato-warning"></i>
        </div>
        <p class="notification-text">${text}</p>
        <button><i class="icon-close" id="closeNotification"></i></button>
      </div>
    </div>
  `;

  const time = showTime * 1000;

  $('#wrapper').append(template);

  setTimeout(() => {
    $('.wrapper-notification').fadeOut('slow', () => {
      $('.wrapper-notification').remove();
    });
  }, time);

  $('#closeNotification').on('click', () => {
    $('.wrapper-notification').fadeOut('slow', () => {
      $('.wrapper-notification').remove();
    });
  });
};
