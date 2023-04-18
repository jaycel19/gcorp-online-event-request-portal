import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '../context/AuthContext';

const useAdminLogin = () => {
    const { setAdminLoggedIn, setIsAdminLogged } = useAuthContext();

    const adminLoginMutation = useMutation(
        async (adminLoginData) => {
            const { data } = await axios.post('http://localhost/gcorp/api/admin/login.php', adminLoginData, {headers: {'Content-Type': 'application/json'}});
            return data;
        },
        {
            onSuccess: (data) => {
                if (data.login) {
                    setAdminLoggedIn(data);
                } else {
                    setAdminLoggedIn({ login: false });
                    setIsAdminLogged({ login: false });
                }
            },
            onError: (error) => {
                // handle login error
            }
        }
    );

    return {
        adminLogin: adminLoginMutation.mutate,
        isLoading: adminLoginMutation.isLoading,
        error: adminLoginMutation.error
    };
};

export default useAdminLogin;