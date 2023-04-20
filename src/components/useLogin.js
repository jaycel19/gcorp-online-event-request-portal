import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '../context/AuthContext';

const useLogin = () => {
    const { setLoggedIn, loggedIn } = useAuthContext();
  const loginMutation = useMutation(
    async (loginData) => {
      const { data } = await axios.post('http://localhost:80/gcorp/api/user/login.php', loginData,{headers: {'Content-Type': 'application/json'}});
      return data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('userData', JSON.stringify(data));
        setLoggedIn(data);
        console.log(loggedIn)
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
