import {TimerModel} from './timer-model';

describe('Timer model', () => {
  const model = new TimerModel();
  model.getTimeFromFB();

  beforeEach(() => {
    let task = {
      id: '1221',
      title: 'Test title',
      description: 'Test description',
      categoryId: 'hobby',
      priority: 'low',
      estimation: '5',
      deadline: '11.03.2020',
      status: 'DAILY_LIST',
      createDate: 1584378828790,
      completedCount: 0,
      failedPomodoros: 0,
      completeDate: 0
    };

    model.task = task;
  });

  test('it should change completedCount', () => {
    model.changePomodoros('done');
    expect(model.task.completedCount).toBe(1);
  });

  test('it should change failedPomodoros', ()  => {
    model.changePomodoros('fail');
    expect(model.task.failedPomodoros).toBe(1);
  });

  // test('it should return object with params', () => {
  //   // model.getTimeFromFB();
  //   expect(model.workTime).toBe(25);
  // });

  test('it should complete task and reset iteration', () => {
    model.completeTask(6);
    expect(model.task.status).toBe('COMPLETED');
    expect(model.task.estimation).toBe(6);
    expect(model.iteration).toBe(0);
  });

  test('it should increment observers length', () => {
    model.registerObserver({});
    expect(model.observers.length).toBe(1);
  });

  // test('dsdsd', () => {
  //   // model.getTimeFromFB();

  //   // expect(model.timer).toHaveBeenCalled();
  // });

});