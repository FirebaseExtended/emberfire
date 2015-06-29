import Firebase from 'emberfire/services/firebase';
import config from '../config/environment';

Firebase.config = config;

export default Firebase;
