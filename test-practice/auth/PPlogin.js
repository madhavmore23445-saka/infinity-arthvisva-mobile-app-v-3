import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import theme from '../constants/theme';

const { width } = Dimensions.get('window');

const LoginScreen = ({navigation})=>{
    const [loginMethod , setLoginMethod] = useState('otp') // "otp" or "pasword"
    const [showOTPInput , setShowOTPInput] = useState(false);
    // form states

    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [phoneNumber , setPhoneNumber] = useState('');
    const [otp , setOtp] = useState('');

    const[error , setError]= useState('');
    const[loading , setLoading]= useState(false);
    const[successMessage , setSuccessMessage]= useState('');
    const[timer, setTimer]=useState(0);
    const[login,sendLoginOtp , loginWithOtp]= useAuth();
    // timer logic
    React.useEffect(()=>{
        let interval;
        if (timer>0) {
            interval = setInterval(()=>{
                setTimer((prev)=>prev-1)
            },1000)
        }else{
            clearInterval(interval)
        }
        return()=>clearImmediate(interval)
    } , [timer])

    const startTimer = async()=>setTimer(45);

const handleLogin = async () => {
    setError('');
    setSuccessMessage('');

    if (loginMethod === 'password') {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const result = await login(email, password);
            
           
        } catch (err) {
            setError(err?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }
};

}

// const LoginScreen = ({ navigation }) => {

//         if (loginMethod === 'password') {
//             if (!email || !password) {
//                 setError('Please fill in all fields');
//                 return;
//             }
//             setLoading(true);
//             const result = await login(email, password);
//             setLoading(false);
//             if (!result.success) {
//                 setError(result.message);
//             }
//         } else {
//             // OTP Login Flow
//             if (!showOTPInput) {
//                 if (!phoneNumber || phoneNumber.length !== 10) {
//                     setError('Please enter a valid 10-digit phone number');
//                     return;
//                 }

//                 setLoading(true);
//                 const result = await sendLoginOtp(phoneNumber);
//                 setLoading(false);

//                 if (result.success) {
//                     setShowOTPInput(true);
//                     setSuccessMessage('OTP sent successfully');
//                     startTimer();
//                 } else {
//                     setError(result.message);
//                 }
//             } else {
//                 if (!otp || otp.length !== 6) {
//                     setError('Please enter a 6-digit OTP');
//                     return;
//                 }

//                 setLoading(true);
//                 const result = await loginWithOtp(phoneNumber, otp);
//                 setLoading(false);

//                 if (!result.success) {
//                     setError(result.message);
//                 } else {
//                     setSuccessMessage('Login successful! Redirecting...');
//                 }
//             }
//         }
//     };

//     const handleResend = async () => {
//         if (!phoneNumber || phoneNumber.length !== 10) {
//             setError('Please enter a valid 10-digit phone number');
//             return;
//         }

//         setLoading(true);
//         setError('');
//         setSuccessMessage('');

//         const result = await sendLoginOtp(phoneNumber);
//         setLoading(false);

//         if (result.success) {
//             setSuccessMessage('OTP resent successfully');
//             startTimer();
//         } else {
//             setError(result.message);
//         }
//     };

//     const renderTabSwitcher = () => (
//         <View style={styles.tabContainer}>
//             <TouchableOpacity
//                 style={[styles.tab, loginMethod === 'otp' && styles.activeTab]}
//                 onPress={() => {
//                     setLoginMethod('otp');
//                     setError('');
//                 }}
//             >
//                 <Ionicons
//                     name="phone-portrait-outline"
//                     size={20}
//                     color={loginMethod === 'otp' ? theme.colors.tabTextActive : theme.colors.tabTextInactive}
//                 />
//                 <Text style={[styles.tabText, loginMethod === 'otp' && styles.activeTabText]}>With OTP</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={[styles.tab, loginMethod === 'password' && styles.activeTab]}
//                 onPress={() => {
//                     setLoginMethod('password');
//                     setError('');
//                     setShowOTPInput(false);
//                 }}
//             >
//                 <Ionicons
//                     name="key-outline"
//                     size={20}
//                     color={loginMethod === 'password' ? theme.colors.tabTextActive : theme.colors.tabTextInactive}
//                 />
//                 <Text style={[styles.tabText, loginMethod === 'password' && styles.activeTabText]}>With Password</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     const renderOTPFlow = () => (
//         <View style={styles.flowContainer}>
//             {!showOTPInput ? (
//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Phone Number</Text>
//                     <View style={styles.inputWrapper}>
//                         <Ionicons name="call-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Enter 10-digit number"
//                             value={phoneNumber}
//                             onChangeText={setPhoneNumber}
//                             keyboardType="phone-pad"
//                             maxLength={10}
//                         />
//                     </View>
//                 </View>
//             ) : (
//                 <View style={styles.inputContainer}>
//                     <View style={styles.otpHeader}>
//                         <Text style={styles.label}>Enter 6-digit OTP</Text>
//                         <TouchableOpacity onPress={() => setShowOTPInput(false)}>
//                             <Text style={styles.changeText}>Change Number</Text>
//                         </TouchableOpacity>
//                     </View>
//                     <View style={styles.otpContainer}>
//                         {[...Array(6)].map((_, index) => (
//                             <TextInput
//                                 key={index}
//                                 style={styles.otpBox}
//                                 keyboardType="number-pad"
//                                 maxLength={1}
//                                 value={otp[index] || ''}
//                                 onChangeText={(val) => {
//                                     if (val) {
//                                         const newOtp = otp + val;
//                                         if (newOtp.length <= 6) setOtp(newOtp);
//                                     } else {
//                                         setOtp(otp.slice(0, -1));
//                                     }
//                                 }}
//                             />
//                         ))}
//                     </View>
//                     <TouchableOpacity
//                         style={styles.resendContainer}
//                         onPress={handleResend}
//                         disabled={loading || timer > 0}
//                     >
//                         <Text style={[styles.resendText, (loading || timer > 0) && { color: theme.colors.disabled }]}>
//                             {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             )}

//             <TouchableOpacity
//                 style={[styles.button, loading && styles.buttonDisabled]}
//                 onPress={handleLogin}
//                 disabled={loading}
//             >
//                 {loading ? (
//                     <ActivityIndicator color={theme.colors.white} />
//                 ) : (
//                     <>
//                         <Text style={styles.buttonText}>{!showOTPInput ? 'Get OTP' : 'Login'}</Text>
//                         <Ionicons name="arrow-forward" size={20} color={theme.colors.white} style={styles.buttonIcon} />
//                     </>
//                 )}
//             </TouchableOpacity>
//         </View>
//     );

//     const renderPasswordFlow = () => (
//         <View style={styles.flowContainer}>
//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Email</Text>
//                 <View style={styles.inputWrapper}>
//                     <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter your email"
//                         value={email}
//                         onChangeText={setEmail}
//                         keyboardType="email-address"
//                         autoCapitalize="none"
//                     />
//                 </View>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Password</Text>
//                 <View style={styles.inputWrapper}>
//                     <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter your password"
//                         value={password}
//                         onChangeText={setPassword}
//                         secureTextEntry
//                     />
//                 </View>
//             </View>

//             <TouchableOpacity
//                 style={[styles.button, loading && styles.buttonDisabled]}
//                 onPress={handleLogin}
//                 disabled={loading}
//             >
//                 {loading ? (
//                     <ActivityIndicator color={theme.colors.white} />
//                 ) : (
//                     <Text style={styles.buttonText}>Login</Text>
//                 )}
//             </TouchableOpacity>
//         </View>
//     );

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={styles.container}
//         >
//             <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//                 <View style={styles.header}>
//                     <View style={styles.iconContainer}>
//                         <MaterialCommunityIcons name="cellphone-check" size={40} color={theme.colors.primary} />
//                     </View>
//                     <Text style={styles.title}>Welcome Back</Text>
//                     <Text style={styles.subtitle}>Select your preferred login method.</Text>
//                 </View>

//                 {renderTabSwitcher()}

//                 <View style={styles.form}>
//                     {error ? (
//                         <View style={styles.errorContainer}>
//                             <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
//                             <Text style={styles.errorText}>{error}</Text>
//                         </View>
//                     ) : null}

//                     {successMessage ? (
//                         <View style={styles.successContainer}>
//                             <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
//                             <Text style={styles.successText}>{successMessage}</Text>
//                         </View>
//                     ) : null}

//                     {loginMethod === 'otp' ? renderOTPFlow() : renderPasswordFlow()}

//                     <View style={styles.footer}>
//                         <Text style={styles.footerText}>Don't have an account? </Text>
//                         <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//                             <Text style={styles.linkText}>Sign Up</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.inactiveTab,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.text,
        textAlign: 'center',
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.xs,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.inactiveTab,
        borderRadius: theme.borderRadius.md,
        padding: 4,
        marginBottom: theme.spacing.xl,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: theme.borderRadius.sm,
        gap: 8,
    },
    activeTab: {
        backgroundColor: theme.colors.white,
        ...theme.shadow,
    },
    tabText: {
        ...theme.typography.caption,
        color: theme.colors.tabTextInactive,
        fontWeight: '600',
    },
    activeTabText: {
        color: theme.colors.tabTextActive,
    },
    form: {
        width: '100%',
    },
    flowContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: theme.spacing.lg,
    },
    otpHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    label: {
        ...theme.typography.label,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    changeText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
    },
    inputIcon: {
        marginRight: theme.spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.text,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing.sm,
    },
    otpBox: {
        width: (width - theme.spacing.lg * 2 - 50) / 6,
        height: 50,
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    button: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
        ...theme.shadow,
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
    buttonIcon: {
        marginLeft: theme.spacing.sm,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.md,
        gap: 8,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 14,
        fontWeight: '500',
    },
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.md,
        gap: 8,
    },
    successText: {
        color: theme.colors.success,
        fontSize: 14,
        fontWeight: '500',
    },
    buttonDisabled: {
        backgroundColor: theme.colors.disabled,
        opacity: 0.7,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xxl,
    },
    resendContainer: {
        marginTop: theme.spacing.md,
        alignItems: 'center',
    },
    resendText: {
        color: theme.colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    footerText: {
        color: theme.colors.textSecondary,
        fontSize: 15,
    },
    linkText: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 15,
    },
});

export default LoginScreen;