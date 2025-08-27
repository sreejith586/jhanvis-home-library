// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCtnmvWRc9Lvt3GVcFnr8QfhXd2XCZnSqU',
  authDomain: 'jhanvi-home-library-751e0.firebaseapp.com',
  projectId: 'jhanvi-home-library-751e0',
  storageBucket: 'jhanvi-home-library-751e0.appspot.com',
  messagingSenderId: '275379850704',
  appId: '1:275379850704:web:19b8de0cd496c946b07dd5',
  measurementId: 'G-BG79SB687E' // 👈 Required for Analytics
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics };