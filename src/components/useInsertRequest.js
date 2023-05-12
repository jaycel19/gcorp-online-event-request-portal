import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const useInsertRequest = () => {
  const insertRequest = async (requestData) => {
    const response = await axios.post('https://capstone23.com/gcorp/gcorp-backend/api/request/insert.php', requestData);
    return response.data;
  };

  return useMutation(insertRequest);
};

export default useInsertRequest;
