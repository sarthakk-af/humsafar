import { TouchableOpacity, View } from 'react-native'
import { Text } from '@rneui/base'
import { TextInput } from 'react-native-paper'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../contexts/Auth';
import { ScrollView } from 'react-native'

export const Register = () => {

    const [email, setEmail] = useState('test3@gmail.com')
    const [firstName, setFirstName] = useState('test')
    const [middleName, setMiddleName] = useState('test')
    const [lastName, setLastName] = useState('test')
    const [password, setPassword] = useState('12345678')
    const [error, setError] = useState('')
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const navigation = useNavigation()

    const auth = useAuth();

    const emailRegex = /\S+@\S+\.\S+/;

    const handleSubmit = (user) => {
        if (email === '' || password === '' || firstName === '' || middleName === '' || lastName === '') {
            return setError("All fields are required")
        }

        if (emailRegex.test(email)) {
            // auth.signIn(user)
            auth.signUp(user)
            // console.log(auth.authError)
        } else {
            setError("Please Enter Valid Email")
        }
    }

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "#FAFAFA",
            width: '100%'
        }}>
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 30
            }}>
                <Text style={{ fontSize: 70, paddingVertical: 20, fontFamily: 'Sansita-Bold', color: '#2D2D2D' }}>
                    humSafar
                </Text>
                <Text style={{ fontSize: 50, paddingBottom: 10, fontFamily: 'Sansita-Bold', color: '#2D2D2D' }}>
                    Register
                </Text>
            </View>
            <ScrollView style={{ flex: 1, width: '90%' }} contentContainerStyle={{ paddingBottom: 30 }}>
                {[
                    { label: "First Name", value: firstName, setter: setFirstName },
                    { label: "Middle Name", value: middleName, setter: setMiddleName },
                    { label: "Last Name", value: lastName, setter: setLastName },
                    { label: "Email", value: email, setter: setEmail },
                ].map((field, index) => (
                    <TextInput
                        key={index}
                        style={{ backgroundColor: '#EDEDED', marginBottom: 0 }}
                        mode='outlined'
                        label={field.label}
                        autoCapitalize='none'
                        keyboardType='default'
                        value={field.value}
                        onChangeText={text => {
                            field.setter(text);
                            setError('');
                        }}
                        theme={{
                            colors: {
                                primary: '#2D2D2D',
                                underlineColor: 'transparent',
                                background: '#EDEDED',
                                text: '#1A1A1A',
                                placeholder: '#767676'
                            }
                        }}
                    />
                ))}
                <TextInput
                    style={{ backgroundColor: '#EDEDED', marginBottom: 0 }}
                    mode='outlined'
                    label="Password"
                    secureTextEntry={secureTextEntry}
                    value={password}
                    onChangeText={text => {
                        setPassword(text);
                        auth.setAuthError(null);
                        setError('');
                    }}
                    theme={{
                        colors: {
                            primary: '#2D2D2D',
                            underlineColor: 'transparent',
                            background: '#EDEDED',
                            text: '#1A1A1A',
                            placeholder: '#767676'
                        }
                    }}
                    right={
                        <TextInput.Icon
                            icon={secureTextEntry ? 'eye' : 'eye-off'}
                            onPress={() => {
                                setSecureTextEntry(!secureTextEntry);
                                return false;
                            }}
                        />
                    }
                />
                {auth.authError !== null &&
                    <View style={{ alignSelf: 'center', paddingVertical: 10 }}>
                        <Text style={{ color: 'red', fontSize: 18, fontFamily: 'Sansita-Regular' }}>
                            {auth?.authError?.message}
                        </Text>
                    </View>}
                {error !== '' &&
                    <View style={{ alignSelf: 'center', paddingVertical: 10 }}>
                        <Text style={{ color: 'red', fontSize: 18, fontFamily: 'Sansita-Regular' }}>
                            {error}
                        </Text>
                    </View>}
                <View style={{ paddingVertical: 10 }}>
                    <TouchableOpacity
                        style={{
                            borderRadius: 50,
                            borderWidth: 2,
                            borderColor: '#2D2D2D',
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            backgroundColor: '#2D2D2D',
                        }}
                        onPress={() => handleSubmit(user = { email, password, firstName, middleName, lastName })}
                    >
                        <Text style={{
                            fontFamily: 'Sansita-Bold',
                            fontSize: 26,
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{
                        fontFamily: 'Sansita-Regular',
                        fontSize: 16,
                        color: '#2D2D2D',
                        textAlign: 'center'
                    }}>
                        Already have an Account?
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
    
}