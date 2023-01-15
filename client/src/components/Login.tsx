import React, {useState} from 'react';
import axios, { AxiosResponse } from 'axios';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

type APIResponse = {
    status: string,
    token: string
}

const Login = () => {
    const signIn = useSignIn();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({email: "", password: ""})
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await axios.post('http://localhost:3050/api/gateway/login/', formData)
            .then((res: AxiosResponse<APIResponse>) => {
                if (res.status === 200) {
                    if (signIn(
                        {
                            token: res.data.token,
                            expiresIn: 3600,
                            tokenType: "Bearer",
                            authState: { email: formData.email }
                        }
                    )) {
                        navigate('/secure');
                    }
                }
            })
    }

    return (
        <form onSubmit={onSubmit}>
            <input type={"email"} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type={"password"} onChange={(e) => setFormData({...formData, password: e.target.value})} />

            <button>Submit</button>
        </form>
    );
};

export default Login;