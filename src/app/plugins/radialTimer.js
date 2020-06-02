import $ from 'jquery';

/**
 * jQuery plugin for radial timer
 * Counts in seconds
 * 
 * @returns {Object} with two methods:
 * start timer and stop current timer!!! 
 * -------------------------
 * start method 
 * @param {number} time How many seconds will be shown animation
 * @param {function} callback call callback function if need
 * -------------------------
 * clear method
 * @param {*} interval Clear current inteval
 */
$.fn.radialTimer = () => {
  function startTimer(time, callback) {
    if ($('.timer-border')[0].classList.contains('full')) { $('.timer-border')[0].classList.remove('full'); }

    const timerOutput = $('.timer-block');

    const template = `<div class="radial-timer">
                        <div class="pie spinner"></div>
                        <div class="pie filler"></div>
                        <div class="mask"></div>
                      </div>`;

    timerOutput.append(template);

    const minutes = $('.timer-minutes')[0];
    const spinner = $('.spinner')[0];
    const filler = $('.filler')[0];
    const mask = $('.mask')[0];

    minutes.textContent = time;

    spinner.style.animationDuration = `${time}s`;
    filler.style.animationDuration = `${time}s`;
    mask.style.animationDuration = `${time}s`;

    const interval = setInterval(() => {
      time--;
      minutes.textContent = time;

      if (time === 0) {
        clearTimer(interval);
        if (callback) callback();
      }
    }, 1000);

    return interval;
  }

  function clearTimer(interval) {
    if ($('.radial-timer')[0]) $('.radial-timer')[0].remove();
    $('.timer-border')[0].classList.add('full');
    clearInterval(interval);
  }

  return {
    start: startTimer,
    clear: clearTimer,
  };
};
