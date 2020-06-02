import * as firebase from 'firebase/app';
import jQuery from 'jquery';
import notification from './plugins/notification';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA_VkkSqqKwlbxgxECqIoXMPWjT0KAsUkM',
  authDomain: 'pomodoro-the3d.firebaseapp.com',
  databaseURL: 'https://pomodoro-the3d.firebaseio.com',
  projectId: 'pomodoro-the3d',
  storageBucket: 'pomodoro-the3d.appspot.com',
  messagingSenderId: '1014943265441',
  appId: '1:1014943265441:web:c3b9f14ac3397dc782b6e0',
  measurementId: 'G-C0V56G0P4V',
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

/**
 * Class for setting, getting, delete data at Firebase Service
 * @namespace Firebase
 */

class Firebase {
  /**
   * constructor of Firebase class
   * @constructs Firebase
   * @memberof Firebase
   */
  constructor() {}

  /**
   * Method for setting data to FB
   * @param {string} where path to database collection
   * @param {Object} info Data in Object
   * @param {string} type Type of notification which will be shown
   */
  setInfo(where, info, type) {
    db.ref(where)
      .set(info, (error) => {
        if (type === 'settings') {
          if (error) {
            throw new Error(
              jQuery('#wrapper').notification(
                'error',
                'Unable to save settings. Try again later',
                4,
              ),
            );
          } else {
            jQuery('#wrapper').notification(
              'success',
              'Settings was successfully saved',
              4,
            );
          }
        } else if (type === 'task') {
          if (error) {
            jQuery('#wrapper').notification(
              'error',
              'Unable to save your task. Try again later',
              4,
            );
          } else {
            jQuery('#wrapper').notification(
              'success',
              'Your task was successfully saved',
              4,
            );
          }
        } else if (type === 'daily') {
          if (error) {
            jQuery('#wrapper').notification(
              'error',
              'Unable to move to the daily task list. Try again later',
              4,
            );
          } else {
            jQuery('#wrapper').notification(
              'info',
              'You task was moved to the daily task list',
              4,
            );
          }
        } else if (type === 'completed') {
          if (error) {
            jQuery('#wrapper').notification(
              'error',
              'Unable to mark pomodoro/task as completed. Try again later',
              4,
            );
          } else {
            jQuery('#wrapper').notification(
              'success',
              'You finished pomodoro!',
              4,
            );
          }
        } else if (type === 'long-break') {
          jQuery('#wrapper').notification(
            'warning',
            'Long break started, please have a rest!',
            4,
          );
        }
      })
      .then();
  }

  /**
   * Method for getting Data from FB
   * @param {string} where path to database collection 
   * @param {Object} callback You will get all objects from path 
   */
  getInfo(where, callback) {
    db.ref(where)
      .once('value')
      .then((snapshot) => snapshot.val())
      .then(callback);
  }

  /**
   * Method for deleting tasks from collection
   * @param {string} where path to database collection  
   */
  deleteInfo(where) {
    db.ref(where)
      .remove()
      .then(() => {
        jQuery('#wrapper').notification(
          'success',
          'Your task was successfully removed',
          4,
        );
      })
      .catch(() => {
        jQuery('#wrapper').notification(
          'error',
          'Unable to remove task. Try again later',
          4,
        );
      });
  }
}

export const firebaseDB = new Firebase();
