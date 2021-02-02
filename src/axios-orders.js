import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-builder-65b06-default-rtdb.europe-west1.firebasedatabase.app/'
})

export default instance;