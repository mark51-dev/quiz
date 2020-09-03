import axios from 'axios';

export default axios.create({
  baseURL: 'https://react-quiz-e0bc4.firebaseio.com/'
});