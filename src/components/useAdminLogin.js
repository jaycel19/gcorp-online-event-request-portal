import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '../context/AuthContext';

const useAdminLogin = () => {
    const { setAdminLoggedIn } = useAuthContext();

    const adminLoginMutation = useMutation(
        async (adminLoginData) => {
            const { data } = await axios.post('http://localhost/gcorp/api/admin/login.php', adminLoginData, {headers: {'Content-Type': 'application/json'}});
            return data;
        },
        {
            onSuccess: (data) => {
                localStorage.setItem('adminData', JSON.stringify(data));
                setAdminLoggedIn(data);
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