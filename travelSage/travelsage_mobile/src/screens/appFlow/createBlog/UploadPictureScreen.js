import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Icon } from '@rneui/base';
import { saveFormData, loadFormData } from '../../../utils/blogLocalStorage'; // Adjust the path if necessary

export default function UploadScreen({ navigation, route }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Load saved form data when the component mounts
        loadFormData('UploadScreen').then((data) => {
            if (data) {
                setImages(data.images || []);
            }
        });
    }, []);

    const handleChoosePhotos = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setImages([...images, ...response.assets]);
            }
        });
    };

    const handleRemoveImage = (uri) => {
        setImages(images.filter(image => image.uri !== uri));
    };

    const handleNext = () => {
        if (images.length === 0) {
            Alert.alert('Error', 'Please select at least one image');
            return;
        }

        const formData = {
            ...route.params,
            images,
        };

        // Save form data
        saveFormData('UploadScreen', formData).then(() => {
            navigation.navigate('AddTagsAndLocation', formData);
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" color="black" size={24} />
                </TouchableOpacity>
            </View>
            <Text style={styles.headerTitle}>Upload Images</Text>
            <View style={styles.imageContainer}>
                <ScrollView horizontal>
                    {images.map((image, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri: image.uri }} style={styles.image} />
                            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(image.uri)}>
                                <Icon name="close" color="white" size={16} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.uploadButton} onPress={handleChoosePhotos}>
                <Icon name="add-a-photo" color="white" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Icon name="arrow-forward" color="white" size={24} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    backButton: {
        backgroundColor: '#008080',
        borderRadius: 30,
        padding: 10,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        textAlign: 'center',
        fontFamily: 'Sansita-Bold',
        fontSize: 25,
    },
    imageContainer: {
        flexDirection: 'row',
        marginVertical: 20,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
    },
    image: {
        width: 100,
        height: 100,
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 12,
        padding: 2,
    },
    uploadButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        padding: 15,
        backgroundColor: '#008080',
        borderRadius: 30,
    },
    nextButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        padding: 15,
        backgroundColor: '#008080',
        borderRadius: 30,
    },
});
