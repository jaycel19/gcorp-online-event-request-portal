import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '../context/AuthContext';

const useLogin = () => {
    const { isLogged, setIsLogged } = useAuthContext();
  const loginMutation = useMutation(
    async (loginData) => {
      const { data } = await axios.post('http://localhost:80/gcorp/api/user/login.php', loginData,{headers: {'Content-Type': 'application/json'}});
      return data;
    },
    {
      onSuccess: (data) => {
        setIsLogged(data);
      },
      onError: (error) => {
        // handle login error
      },
    }
  );

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isLoading,
    error: loginMutation.error,
  };
};

export default useLogin;
