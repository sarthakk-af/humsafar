import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function AuthHome() {
    const navigation = useNavigation();
    
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F2EFE7', // Soft natural background
            padding: 20,
        }}>
            {/* Title Section */}
            <View style={{ alignItems: 'center', marginBottom: 50 }}>
                <Text style={{
                    fontFamily: 'Poppins-Regular',
                    color: '#317B83', // Deep teal for text
                    fontSize: 42,
                    textAlign: 'center',
                }}>Discover Your</Text>
                <Text style={{
                    fontFamily: 'Poppins-Bold',
                    color: '#226B6F', // Richer teal accent
                    fontSize: 50,
                    textAlign: 'center',
                }}>Next Journey</Text>
            </View>

            {/* Buttons Section */}
            <View style={{ width: '100%', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#76B4BD', // Soft blue-green button
                        paddingVertical: 15,
                        paddingHorizontal: 40,
                        borderRadius: 15,
                        marginBottom: 20,
                        width: '80%',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.2,
                        shadowRadius: 5,
                        elevation: 3,
                    }}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={{
                        fontFamily: 'Poppins-Bold',
                        fontSize: 22,
                        color: '#F2EFE7', // Matching soft white
                    }}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#3D9CA8', // Deeper teal for register button
                        paddingVertical: 15,
                        paddingHorizontal: 40,
                        borderRadius: 15,
                        width: '80%',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.2,
                        shadowRadius: 5,
                        elevation: 3,
                    }}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={{
                        fontFamily: 'Poppins-Bold',
                        fontSize: 22,
                        color: '#F2EFE7',
                    }}>REGISTER</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
