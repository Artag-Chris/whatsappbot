import axios from 'axios';


export const getPhones = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/whatsapp/getphones');
      console.log('Response data:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };
  
  getPhones();