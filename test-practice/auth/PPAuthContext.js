import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://192.168.1.58:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registerToken, setRegisterToken] = useState(null); // store temporary register token

    // load token on startup
    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('userToken');
                const storedUser = await AsyncStorage.getItem('userData');
                if (storedToken) {
                    setToken(storedToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                }
                if (storedToken) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null)
                }
            } catch (e) {
                console.error('Failed to load storage data', e)
                setUser(null);
                setToken(null);

            } finally {
                setLoading(false)
            }
        };
        loadStorageData();
    }, []);



    // login with password

    const login = async (identifier, password) => {
        try {
            const response = await axios.post(
                `${API_URL}/auth/login`,
                { identifier, password }

            );
            const { token, user } = response.data;
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(user));

            setToken(token);
            setUser(user);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            }

        }
    }

    // send login otp
    const sendLoginOtp = async (identifier) => {
        try {
            const response = await axios.post(
                `${API_URL}/auth/login/otp/send`,
                { identifier }
            )
            return {
                success: true,
                message: response.data?.message || "OTP sent succesfully"
            };

        } catch (error) {

            return {
                success: false,
                message: error.response?.message || "Failed to send the otp"

            }

        }
    }

    // login with otp(verify)
    const loginWithOtp = async (identifier, otp) => {
        try {
            const response = await axios.post(
                `${API_URL}/auth/login/otp/verify`,
                { identifier, otp }
            )

            const { token, user } = response.data;
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(user));

            setToken(token);
            setUser(user);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return {
                success: true
            }

        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'OTP Login failed'
            }


        }
    }

    // PHASE 1: INITIAL REGISTRATION
    const signup = async (name, email, mobile, password, rm_referral, confirmpass) => {
        try {
            const response = await axios.post(
                `${API_URL}/auth/register`,
                {
                    name,
                    email,
                    mobile,
                    password,
                    confirm_password: confirmpass,
                    rm_referral: rm_referral || ""

                }

            );
            return {
                success: true,
                message: response.data?.message || 'OTP verification required.',
                data: response.data

            };


        }


        catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            // If backend says OTP verification required, treat as success
            if (errorMessage.toLowerCase().includes('otp') ||
                errorMessage.toLowerCase().includes('verification required')) {
                return {
                    success: true,
                    message: 'OTP verification required.'

                }
            }
            return {
                success: false,
                message: errorMessage

            }
        }





    }

    // phase 2 - send otp to mobile

    const sendOtp = async (mobile) => {
        try {
            const response = await axios.post(
                `${API_URL}/auth/register/send-otp`,
                {mobile}
            );

            return{
                success:true,
                message:response.data?.message || 'OTP sent successfullu',
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send OTP';
            // handle mobile already exsits case
            if (errorMessage.toLowerCase().includes('already in use') || errorMessage.toLowerCase().includes('already exists')) {
                return{
                    success:false,
                    message:"This mobile number is already registered . please use a differnt number or login",
                    stopFlow:true // Flag to stop the registration flow
                }
            }
            return{
                success:false,
                message:errorMessage
            }

        }
    }

    // phase 3 - verify otp 

    const verifyOtp = async (mobile , otp) => {
        
    }
}

    //     // PHASE 3: VERIFY OTP
    //     const verifyOtp = async (mobile, otp) => {
    //         try {
    //             const response = await axios.post(
    //                 `${API_URL}/auth/register/verify-otp`,
    //                 { mobile, otp }
    //             );

    //             const { message, registerToken } = response.data;

    //             if (!registerToken) {
    //                 throw new Error('No register token received from server');
    //             }

    //             // Store registerToken temporarily (not as auth token)
    //             setRegisterToken(registerToken);

    //             return {
    //                 success: true,
    //                 message: message || 'OTP verified successfully',
    //                 registerToken
    //             };
    //         } catch (error) {
    //             return {
    //                 success: false,
    //                 message: error.response?.data?.message || 'Invalid OTP'
    //             };
    //         }
    //     };

    //     // PHASE 4: FINAL REGISTRATION WITH REGISTER TOKEN
    //     // PHASE 4: FINAL REGISTRATION (REGISTER TOKEN = AUTH TOKEN)
    //     const completeRegistration = async (userData, registerToken) => {
    //         try {
    //             const response = await axios.post(
    //                 `${API_URL}/auth/register`,
    //                 {
    //                     ...userData,
    //                     registerToken
    //                 }
    //             );

    //             const { message, user: registeredUser } = response.data;

    //             if (!registerToken) {
    //                 throw new Error('Register token missing');
    //             }

    //             // ✅ Treat registerToken as auth token
    //             await AsyncStorage.setItem('userToken', registerToken);
    //             await AsyncStorage.setItem('userData', JSON.stringify(registeredUser));

    //             setToken(registerToken);
    //             setUser(registeredUser);
    //             setRegisterToken(null); // clear temp token

    //             axios.defaults.headers.common[
    //                 'Authorization'
    //             ] = `Bearer ${registerToken}`;

    //             return {
    //                 success: true,
    //                 message: message || 'Registration successful!',
    //                 user: registeredUser,
    //                 token: registerToken
    //             };

    //         } catch (error) {
    //             return {
    //                 success: false,
    //                 message:
    //                     error.response?.data?.message ||
    //                     'Failed to complete registration'
    //             };
    //         }
    //     };

    //     // FETCH FULL PROFILE
    //     const fetchUserProfile = async () => {
    //         try {
    //             const response = await axios.get(`${API_URL}/auth/me`);
    //             const { user } = response.data;

    //             await AsyncStorage.setItem('userData', JSON.stringify(user));
    //             setUser(user);

    //             return { success: true, user };
    //         } catch (error) {
    //             return {
    //                 success: false,
    //                 message: 'Failed to fetch user profile'
    //             };
    //         }
    //     };

    //     // LOGOUT
    //     const logout = async () => {
    //         await AsyncStorage.removeItem('userToken');
    //         await AsyncStorage.removeItem('userData');
    //         setToken(null);
    //         setUser(null);
    //         setRegisterToken(null);
    //         delete axios.defaults.headers.common['Authorization'];
    //     };

    //     return (
    //         <AuthContext.Provider
    //             value={{
    //                 user,
    //                 token,
    //                 loading,
    //                 registerToken,
    //                 login,
    //                 signup,
    //                 loginWithOtp,
    //                 sendLoginOtp,
    //                 logout,
    //                 sendOtp,
    //                 verifyOtp,
    //                 completeRegistration,
    //                 fetchUserProfile
    //             }}
    //         >
    //             {children}
    //         </AuthContext.Provider>
    //     );
    // };



    export const useAuth = () => useContext(AuthContext);