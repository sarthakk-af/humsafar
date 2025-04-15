import { Icon } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { saveFormData, loadFormData } from '../../../utils/blogLocalStorage'; // Adjust the path if necessary

export default function AddNewBlog({ navigation, route }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [images, setImages] = useState([]);
    const [tagAndOther, setTagAndOther] = useState({});
    const [travelTips, setTravelTips] = useState({});
    const [dateTime, setDateTime] = useState('');

    useEffect(() => {
        // Load saved form data when the component mounts
        loadFormData('AddNewBlog').then((data) => {
            if (data) {
                setTitle(data.title || '');
                setBody(data.body || '');
                setImages(data.images || []);
                setTagAndOther(data.tagAndOther || {});
                setTravelTips(data.travelTips || {});
                setDateTime(data.dateTime || new Date().toLocaleString());
            } else {
                setDateTime(new Date().toLocaleString());
            }
        })
    }, []);

    const handleNext = () => {
        if (!title || !body) {
            Alert.alert('Error', 'Please fill in both the title and body');
            return;
        }

        const formData = {
            title,
            body,
            dateTime,
            images,
            tagAndOther,
            travelTips,
        };

        // Save form data
        saveFormData('AddNewBlog', formData).then(() => {
            navigation.navigate('UploadPictureScreen', formData);
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={title}
                    multiline
                    onChangeText={setTitle}
                    placeholder="Title"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.dateTime}>{dateTime}</Text>
            </View>
            <View style={styles.inputContainer}>
                <ScrollView style={[styles.input, styles.multilineInput]}>
                    <TextInput
                        value={body}
                        onChangeText={setBody}
                        placeholder="Blog begins here!!!"
                        multiline
                        textAlignVertical="top"
                        style={{ flex: 1, fontSize: 20 }}
                    />
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.floatingButton} onPress={handleNext}>
                <Icon name="arrow-forward" color="white" size={24} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    inputContainer: {
        marginBottom: 1,
    },
    input: {
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
        fontSize: 30,
    },
    multilineInput: {
        minHeight: 100,
        maxHeight: '90%',
    },
    dateTime: {
        fontSize: 16,
        padding: 10,
        backgroundColor: '#fff',
        color: '#333',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#008080',
        borderRadius: 30,
        padding: 15,
        elevation: 5,
    },
});
