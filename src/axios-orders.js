import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-230b4.firebaseio.com/'
})

export default instance;