import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
export default function AuthHome() {
    const navigation = useNavigation();
    
    
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#FFFBF0', // Cream white background
            paddingHorizontal: 20
        }}>
            <View style={{ paddingLeft: 10, flex: 2, justifyContent: 'center' }}>
                <Text style={{
                    fontFamily: 'Sansita-Regular',
                    color: '#333333', // Rich black text
                    fontSize: 50
                }}>
                    Explore places with
                </Text>
                <Text style={{
                    fontFamily: 'Sansita-Bold',
                    color: '#FF6F61', // Coral red title
                    fontSize: 70
                }}>
                    humSafar
                </Text>
            </View>
    
            <View style={{ flex: 1, alignItems: 'center', paddingTop: 20 }}>
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: '#FF6F61', // Coral red button
                            paddingVertical: 12,
                            paddingHorizontal: 30,
                            borderRadius: 12,
                            marginVertical: 10,
                            width: '80%',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={{
                            fontFamily: 'Sansita-Bold',
                            fontSize: 28,
                            color: '#FFFBF0' // Cream white text on coral
                        }}>
                            LOGIN
                        </Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: '#FFF0EC', // Pale coral background
                            paddingVertical: 12,
                            paddingHorizontal: 30,
                            borderRadius: 12,
                            marginVertical: 10,
                            
                            width: '80%',
                            alignItems: 'center',
                            borderColor: '#E94E77', // Pink-red border
                            borderWidth: 2,
                        }}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={{
                            fontFamily: 'Sansita-Bold',
                            fontSize: 28,
                            color: '#E94E77' // Accent pink-red
                        }}>
                            REGISTER
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
    
    
}