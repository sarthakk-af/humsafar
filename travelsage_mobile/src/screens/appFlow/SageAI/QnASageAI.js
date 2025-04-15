import { Icon } from '@rneui/base';
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';

export default function QnASageAI({ navigation, route }) {
    const [inputText, setInputText] = useState('');
    const [sageAns, setSageAns] = useState({});
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const { category, locationName } = route.params;

    useEffect(() => {
        if (sageAns.answer) {
            setIsTyping(true);
            displayAnswerTypewriter(sageAns.answer);
        }
    }, [sageAns.answer]);

    const displayAnswerTypewriter = (answer) => {
        let index = 0;
        const interval = setInterval(() => {
            if (index <= answer.length) {
                setDisplayedText(answer.slice(0, index));
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 50); // Adjust the interval as needed for typing speed
    };

    const handleSend = async () => {
        const payload = {
            category,
            locationName,
            question: inputText
        };

        try {
            const response = await fetch('http://192.168.0.101:8000/api/answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSageAns(data);
        } catch (error) {
            console.error('Error:', error);
        }

        // setInputText('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                {displayedText === '' ?
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start'
                    }}>
                        <Text style={{
                            fontFamily: 'Sansita-Bold',
                            fontSize: 75,
                            color: '#ddd'
                        }}>Welcome to </Text>
                        <Text style={{
                            fontFamily: 'Sansita-Bold',
                            fontSize: 100,
                            color: '#ddd'
                        }}>SageAI</Text>
                    </View> :
                    <View style={styles.displayContainer}>
                        <Text style={styles.displayText}>{displayedText}</Text>
                    </View>}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline={true}
                        placeholder="Type your question here..."
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Icon name="send" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff'
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    displayContainer: {
        marginTop: 50,
    },
    displayText: {
        fontSize: 24,
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        paddingBottom: 30,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    input: {
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        fontSize: 25,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    sendButton: {
        backgroundColor: '#008080',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
