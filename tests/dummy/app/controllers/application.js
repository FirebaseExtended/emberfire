import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import firebase from 'firebase/app';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @service session;
  @service firebaseApp;
  @service firebaseSecondApp;

  @action
  logout() {
    return this.session.invalidate();
  }

  @action
  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.firebaseApp
      .auth()
      .then((auth) => auth.signInWithPopup(provider));
  }
}
