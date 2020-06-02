import 'core-js/stable'; // for ie
import 'cross-fetch/polyfill';
import '@babel/polyfill';
import { firebaseDB } from '../../firebase-api';

/**
 * Voter class
 * @namespace Voter
 */
export class Voter {
  /**
   * constructor of Voter class
   * @constructs Voter
   * @memberof Voter
   * @param {Objects} options 
   */
  constructor(options) {
    this.elem = options.elem;
    this.step = options.step;
    this.min = options.min;
    this.max = options.max;
    this.render = options.render;
    this.value = this.elem.getElementsByClassName('quantity')[0];
    this.decreaseBtn = this.elem.getElementsByClassName('criteria__button')[0];
    this.increaseBtn = this.elem.getElementsByClassName('criteria__button')[1];

    this.decreaseBtn.addEventListener('click', this.decrease.bind(this));
    this.increaseBtn.addEventListener('click', this.increase.bind(this));
  }

  /**
   * method that increases current criteria
   */
  increase() {
    const newQuantity = +this.value.textContent + this.step;

    if (newQuantity <= this.max) {
      this.value.textContent = newQuantity;
      this.render();
    }
  }

  /**
   * method that decreases current criteria
   */
  decrease() {
    const newQuantity = +this.value.textContent - this.step;

    if (newQuantity >= this.min) {
      this.value.textContent = newQuantity;
      this.render();
    }
  }
}

export function renderingGraph() {
  const workTimeValue = document.querySelector('#workTimeQuantity');
  const workIterationValue = document.querySelector('#workIterQuantity');
  const shortBreakValue = document.querySelector('#shortBreakQuantity');
  const longBreakValue = document.querySelector('#longBreakQuantity');

  firebaseDB.getInfo('settings/', (data) => {
    workTimeValue.textContent = data.workTime;
    workIterationValue.textContent = data.workIteration;
    shortBreakValue.textContent = data.shortBreak;
    longBreakValue.textContent = data.longBreak;

    renderGraph();
  });

  // Render func for creating blocks
  function renderGraphBlocks(workTime, workIteration, shortBreak, longBreak) {
    const cycleList = document.querySelector('.graph');

    cycleList.innerHTML = '';

    for (var i = 0; i < workIteration; i++) {
      var workTimeBlock = document.createElement('div');

      workTimeBlock.style.cssText = `width: ${workTime}px; order: ${i}; flex-grow: ${workTime}`;

      workTimeBlock.classList.add('work-time-part');
      cycleList.appendChild(workTimeBlock);
    }

    for (var j = 0; j < workIteration - 1; j++) {
      var shortBreakBlock = document.createElement('div');

      shortBreakBlock.style.cssText = `width: ${
        shortBreak
      }px; order: ${
        j
      }; flex-grow: ${
        shortBreak}`;
      shortBreakBlock.classList.add('short-break-part');
      cycleList.appendChild(shortBreakBlock);
    }

    const longBreakBlock = document.createElement('div');

    longBreakBlock.style.cssText = ` width: ${longBreak}px; order: ${j}; flex-grow: ${longBreak}`;
    longBreakBlock.classList.add('long-break-part');

    const longBreakText = document.createElement('span');

    longBreakText.classList.add('long-break__text');
    longBreakBlock.appendChild(longBreakText);

    cycleList.appendChild(longBreakBlock);

    for (var i = workIteration; i < workIteration * 2; i++) {
      var workTimeBlock = document.createElement('div');

      workTimeBlock.style.cssText = `width: ${workTime}px; order: ${i}; flex-grow:${workTime}`;
      workTimeBlock.classList.add('work-time-part');
      cycleList.appendChild(workTimeBlock);
    }

    for (var j = workIteration; j < workIteration * 2 - 1; j++) {
      var shortBreakBlock = document.createElement('div');

      shortBreakBlock.style.cssText = `width: ${
        shortBreak
      }px; order: ${
        j
      }; flex-grow: ${
        shortBreak}`;
      shortBreakBlock.classList.add('short-break-part');
      cycleList.appendChild(shortBreakBlock);
    }
  }

  // render functions for creatingtimeline
  function genTimeLine() {
    const totalTime = (+workTimeValue.textContent * +workIterationValue.textContent
          + +shortBreakValue.textContent
            * (+workIterationValue.textContent - 1))
          * 2
        + +longBreakValue.textContent;
    const firstCycle = +workTimeValue.textContent * +workIterationValue.textContent
        + +shortBreakValue.textContent * (+workIterationValue.textContent - 1)
        + +longBreakValue.textContent;
    const timeLine = document.querySelector('.timeline');
    const timeLineItemLast = document.createElement('li');
    const timeLineItemLastSpan = document.createElement('span');
    const longBreakText = document.querySelector('.long-break__text');
    const hoursFullCycle = parseInt(firstCycle / 60, 0);
    const minutesFullCycle = firstCycle - hoursFullCycle * 60;

    timeLineItemLast.classList.add('total-time');
    timeLine.innerHTML = '';

    longBreakText.innerHTML = `Full cycle: ${hoursFullCycle}h ${minutesFullCycle}m`;

    for (let t = 0; t < totalTime; t += 30) {
      var timeLineItem = document.createElement('li');
      var timeLineItemSpan = document.createElement('span');

      timeLineItem.classList.add('timeline__item');

      if (t === 0) {
        timeLineItemSpan.innerHTML = '0m';
      } else if (t === 30) {
        timeLineItemSpan.innerHTML = '30m';
      } else if (t % 60) {
        timeLineItemSpan.innerHTML = `${Math.floor(t / 60)}h 30m`;
      } else {
        timeLineItemSpan.innerHTML = `${Math.floor(t / 60)}h`;
      }
      timeLineItem.append(timeLineItemSpan);
      timeLine.append(timeLineItem);
    }

    const timelineitems = document.getElementsByClassName('timeline__item');
    const lastItemIndex = timelineitems.length;

    timelineitems[lastItemIndex - 1].style.width = `${totalTime % 60}px`;
    timelineitems[lastItemIndex - 1].style.flexGrow = totalTime % 60;

    const calc = totalTime % 60;

    if (totalTime % 60 > 30) {
      timelineitems[lastItemIndex - 1].style.width = `${calc - 30}px`;
      timelineitems[lastItemIndex - 1].style.flexGrow = calc - 30;
    }

    if (totalTime % 60 == 0) {
      timelineitems[lastItemIndex - 1].style.width = `${30}px`;
      timelineitems[lastItemIndex - 1].style.flexGrow = 30;
    }

    timeLineItem.appendChild(timeLineItemSpan);
    timeLine.appendChild(timeLineItem);

    timeLineItemLastSpan.innerHTML = `${parseInt(totalTime / 60)}h ${totalTime % 60}m`;

    timeLineItemLast.appendChild(timeLineItemLastSpan);
    timeLine.appendChild(timeLineItemLast);
  }

  // RENDER
  function renderGraph() {
    renderGraphBlocks(
      +workTimeValue.textContent,
      +workIterationValue.textContent,
      +shortBreakValue.textContent,
      +longBreakValue.textContent,
    );

    genTimeLine();
  }

  const workTimeOptions = {
    min: 15,
    max: 25,
    step: 5,
    elem: document.querySelector('#work-time'),
    render: renderGraph,
  };

  const workTimeVoter = new Voter(workTimeOptions);

  const workIteration = {
    min: 2,
    max: 5,
    step: 1,
    elem: document.querySelector('#work-iteration'),
    render: renderGraph,
  };

  const workIterationVoter = new Voter(workIteration);

  const shortBreak = {
    min: 3,
    max: 5,
    step: 1,
    elem: document.querySelector('#short-break'),
    render: renderGraph,
  };

  const shortBreakVoter = new Voter(shortBreak);

  const longBreak = {
    min: 15,
    max: 30,
    step: 5,
    elem: document.querySelector('#long-break'),
    render: renderGraph,
  };

  const longBreakVoter = new Voter(longBreak);
}
