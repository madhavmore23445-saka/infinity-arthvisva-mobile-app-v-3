import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import theme from '../constants/theme';


/**  */

const SignupScreen = ({ navigation }) => {
    // registration filed
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [rm_referral, setRm_referral] = useState('');
    const [confirmpass, setConfirmpass] = useState('');

    // otp fileds
    const [otp, setOtp] = useState('');

    // ui state
    const [step, setStep] = useState(1);// 1-registration 2- otp verification 3-final registration
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [timer, setTimer] = useState(0);
    const [userData, setUserData] = useState(null); // store user data for the final registration

    const { signup, sendOtp, verifyOtp, completeRegistration, token } = useAuth();

    // timer logic

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000)
        } else {
            clearInterval(interval);

        } return () => clearInterval(interval);
    }, [timer]);
    const startTimer = () => setTimer(45);

    // auto redirext wehen token is availabel (after final registration)
    useEffect(() => {
        if (token) {
            console.log("token available , registration complete or no need");
            setSuccessMessage('Registration succesfull ! redirectiong to the app....');
            // reset form data after delay
            setTimeout(() => {
                resetForm();
                //navigation is handled by app.js based on the token

            }, 1500)

        }
    }, [token]);

    const resetForm = () => {
        setStep(1);
        setName('');
        setEmail('');
        setMobile('');
        setPassword('');
        setConfirmpass('');
        setRm_referral('');
        setOtp('');
        setSuccessMessage('');
        setUserData(null);
    };

    // validation functions

    const validateStep1 = () => {
        setError('');
        setSuccessMessage('');
        if (!name.trim()) {
            setError('please enter your name');
            return false;
        }
        if (!email.trim()) {
            setError('please enter your name');
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("please enter a valid email");
            return false;
        }
        if (!mobile.trim()) {
            setError("please enter your mobile number")
        }
        if (mobile.length !== 10) {
            setError("MOBILE MUST BE 10 DIGITS");
            return false;
        }
        if (!/^\d{10}$/.test(mobile)) {
            setError("PLEASE ENTER A valid 10 digits mobile number");
            return false;
        }
        if (!password) {
            setError("please enter a passwprd");
            return false;
        }
        if (password.length < 6) {
            setError('password must be atleast ');
            return false;
        }
        if (password !== confirmpass) {
            setError('password do not match');
            return false;
        }
        return true;
    };

    // validation step 2

    const validateStep2 = () => {
        setError('');
        if (!otp.trim()) {
            setError("please enter a otp");
            return false;
        }
        if (!otp.length !== 6) {
            setError("otp must be 6 digits");
            return false
        }
        if (!/^\d{6}$/.test(otp)) {
            setError('Please enter a valid 6-digit OTP');
            return false;

        }
        return true;
    };

    const handleSignup = async () => {
        if (step === 1) {
            // validate registration form
            if (!validateStep1) {
                return
            }

            setLoading(true);
            setError('');
            setSuccessMessage('');
            try {
                // step 1 initial regsitration

                console.log("starting registration......");
                const result = await signup(name, email, mobile, password, rm_referral, confirmpass);
                if (!result.success) {
                    setError(result.message);
                    setLoading(false);
                    return;
                }
                // store user data for thr final registration
                const userRegistrationData = {
                    name,
                    email,
                    mobile,
                    password,
                    confirm_password: confirmpass,
                    rm_referral: rm_referral || ""
                };
                setUserData(userRegistrationData);
                // step2: send otp to mobile
                console.log("sending otp..................");
                const otpResult = await sendOtp(mobile);
                console.log(otpResult);
                if (!otpResult.success) {
                    // check if we should stop the flow (mobile already exists)
                    if (otpResult.stopFlow) {
                        Alert.alert(
                            "mobile number exits",
                            otpResult.message,
                            [
                                [{
                                    Text: "OK", onPress: () => {
                                        navigation.navigate('login');
                                    }
                                }]
                            ]
                        )
                    } else {
                        setError(otpResult.message);
                    }
                    setLoading(false);
                    return;
                }
                //move to otp verification step
                setStep(2);
                setSuccessMessage('otp sent to your mobile number , please verify to complete registration');
                startTimer()


            } catch (error) {
                console.error('Registration process error:', error);
                setError('An unexpected error occurred. Please try again.');


            }
            setLoading(false);
        } else if (step === 2) {
            // validate otp
            if (!validateStep2) {
                return;
            }
            setLoading(true);
            setError('');
            setSuccessMessage('');
            try {
                // step 3 : verify otp
                console.log("verifying otp");
                const result = await verifyOtp(mobile, otp);
                if (!result.success) {
                    setError(result.message);
                    setLoading(false);
                    return;
                }
                // otp verification succesfull , get register token
                const registerToken = result.registerToken;
                // setp4: complete regiostrration with register token
                console.log("completing registration with register token....");
                const finalResult = await completeRegistration(userData, registerToken);
                if (!finalResult.success) {
                    setError(finalResult.message);
                    setLoading(false);
                    return;
                }

                // registration completed succesfully
                // authcontext will update token , useEffect will handele redirect
                setSuccessMessage("registration completed succesfully");


            } catch (error) {
                console.error('Registration error:', error);
                setError('Failed to complete registration. Please try again.');
                setLoading(false);
            }
        }
    };

    const handleResendOtp = async () => {
        if (!mobile || !mobile.length !== 10) {
            setError("please enter a valid mobile number");
            return
        }
        setLoading(true);
        setError('');
        try {
            const result = await sendOtp(mobile);
            if (!result.success) {
                setError(result.message);
            } else {
                setSuccessMessage('otp resend succesfully!');
                startTimer();
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            console.error('Resend OTP error:', error);
        }
        setLoading(false);
    };

    const renderStep1 = () => (
        <>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Full name</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your naem'
                        value={name}
                        onChangeText={setName}
                        autoCapitalize='words'
                    />

                </View>

            </View>

            {/* second input field  */}

            <View style={styles.infoContainer}>
                <Text style={styles.label}>email</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your naem'
                        value={name}
                        onChangeText={setName}
                        autoCapitalize='words'
                    />

                </View>

            </View>

            {/* third input field */}

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Full name</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your naem'
                        value={name}
                        onChangeText={setName}
                        autoCapitalize='words'
                    />

                </View>

            </View>




            {/* third input field */}
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Full name</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your naem'
                        value={name}
                        onChangeText={setName}
                        autoCapitalize='words'
                    />

                </View>

            </View>


            {/* third input field */}
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Full name</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your naem'
                        value={name}
                        onChangeText={setName}
                        autoCapitalize='words'
                    />

                </View>

            </View>


            {/* third input field */}
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Full name</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your naem'
                        value={name}
                        onChangeText={setName}
                        autoCapitalize='words'
                    />

                </View>

            </View>



            {/* third input field */}
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Full name</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your naem'
                        value={name}
                        onChangeText={setName}
                        autoCapitalize='words'
                    />

                </View>

            </View>


            {/* third input field */}















        </>
    )
}

//     const renderStep1 = () => (
//         <>
//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Full Name</Text>
//                 <View style={styles.inputWrapper}>
//                     <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter your name"
//                         value={name}
//                         onChangeText={setName}
//                         autoCapitalize="words"
//                     />
//                 </View>
//             </View>

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
//                 <Text style={styles.label}>Phone Number</Text>
//                 <View style={styles.inputWrapper}>
//                     <Ionicons name="call-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter your 10-digit mobile number"
//                         value={mobile}
//                         onChangeText={setMobile}
//                         keyboardType="phone-pad"
//                         maxLength={10}
//                     />
//                 </View>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>RM Referral Code (Optional)</Text>
//                 <View style={styles.inputWrapper}>
//                     <Ionicons name="gift-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter referral code if any"
//                         value={rm_referral}
//                         onChangeText={setRm_referral}
//                         autoCapitalize="characters"
//                     />
//                 </View>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Password</Text>
//                 <View style={styles.inputWrapper}>
//                     <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Create a secure password"
//                         value={password}
//                         onChangeText={setPassword}
//                         secureTextEntry
//                     />
//                 </View>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Confirm Password</Text>
//                 <View style={styles.inputWrapper}>
//                     <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Confirm your password"
//                         value={confirmpass}
//                         onChangeText={setConfirmpass}
//                         secureTextEntry
//                     />
//                 </View>
//             </View>
//         </>
//     );

//     const renderStep2 = () => (
//         <>
//             <View style={styles.stepIndicator}>
//                 <Text style={styles.stepText}>Step 2 of 2: OTP Verification</Text>
//             </View>

//             <View style={styles.infoContainer}>
//                 <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
//                 <Text style={styles.infoText}>
//                     A 6-digit OTP has been sent to {mobile}. Please enter it below to verify your account.
//                 </Text>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Enter OTP</Text>
//                 <View style={styles.inputWrapper}>
//                     <Ionicons name="key-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter 6-digit OTP"
//                         value={otp}
//                         onChangeText={setOtp}
//                         keyboardType="number-pad"
//                         maxLength={6}
//                         autoFocus
//                     />
//                 </View>
//             </View>

//             <TouchableOpacity
//                 style={styles.resendContainer}
//                 onPress={handleResendOtp}
//                 disabled={loading || timer > 0}
//             >
//                 <Text style={[styles.resendText, (loading || timer > 0) && { color: theme.colors.disabled }]}>
//                     {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
//                 </Text>
//             </TouchableOpacity>
//         </>
//     );

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={styles.container}
//         >
//             <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//                 <View style={styles.header}>
//                     <View style={styles.iconContainer}>
//                         <MaterialCommunityIcons name="account-plus-outline" size={40} color={theme.colors.primary} />
//                     </View>
//                     <Text style={styles.title}>
//                         {step === 1 ? 'Create Account' : 'Verify Mobile'}
//                     </Text>
//                     <Text style={styles.subtitle}>
//                         {step === 1 ? 'Join us to get started with your journey.' : 'Enter OTP to verify your mobile number'}
//                     </Text>
//                 </View>

//                 <View style={styles.form}>
//                     {/* Error Message */}
//                     {error ? (
//                         <View style={styles.errorContainer}>
//                             <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
//                             <Text style={styles.errorText}>{error}</Text>
//                         </View>
//                     ) : null}

//                     {/* Success Message */}
//                     {successMessage ? (
//                         <View style={styles.successContainer}>
//                             <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
//                             <Text style={styles.successText}>{successMessage}</Text>
//                         </View>
//                     ) : null}

//                     {/* Step Content */}
//                     {step === 1 ? renderStep1() : renderStep2()}

//                     {/* Action Button */}
//                     <TouchableOpacity
//                         style={[styles.button, loading && styles.buttonDisabled]}
//                         onPress={handleSignup}
//                         disabled={loading}
//                     >
//                         {loading ? (
//                             <ActivityIndicator color={theme.colors.white} />
//                         ) : (
//                             <>
//                                 <Text style={styles.buttonText}>
//                                     {step === 1 ? 'Sign Up' : 'Verify & Complete Registration'}
//                                 </Text>
//                                 <Ionicons name="arrow-forward" size={20} color={theme.colors.white} style={styles.buttonIcon} />
//                             </>
//                         )}
//                     </TouchableOpacity>

//                     {/* Back Button for OTP Step */}
//                     {step === 2 && (
//                         <TouchableOpacity
//                             style={styles.backButton}
//                             onPress={() => {
//                                 setStep(1);
//                                 setOtp('');
//                                 setError('');
//                                 setSuccessMessage('');
//                             }}
//                             disabled={loading}
//                         >
//                             <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
//                             <Text style={styles.backButtonText}>Back to Registration</Text>
//                         </TouchableOpacity>
//                     )}

//                     <View style={styles.footer}>
//                         <Text style={styles.footerText}>Already have an account? </Text>
//                         <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//                             <Text style={styles.linkText}>Login</Text>
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
    form: {
        width: '100%',
    },
    stepIndicator: {
        backgroundColor: theme.colors.primaryLight,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.md,
        alignItems: 'center',
    },
    stepText: {
        color: theme.colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.lg,
        gap: 10,
    },
    infoText: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 14,
        lineHeight: 20,
    },
    inputContainer: {
        marginBottom: theme.spacing.md,
    },
    label: {
        ...theme.typography.label,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
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
    resendContainer: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing.lg,
    },
    resendText: {
        color: theme.colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    button: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
        ...theme.shadow,
    },
    buttonDisabled: {
        backgroundColor: theme.colors.disabled,
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
    buttonIcon: {
        marginLeft: theme.spacing.sm,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },
    backButtonText: {
        color: theme.colors.primary,
        fontWeight: '600',
        fontSize: 16,
        marginLeft: theme.spacing.xs,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
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

export default SignupScreen;