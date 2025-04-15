import { Icon } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { saveFormData, loadFormData } from '../../../utils/blogLocalStorage'; // Adjust the path if necessary

export default function TravelTips({ navigation, route }) {
    const [necessaryItems, setNecessaryItems] = useState('');
    const [nativeLanguage, setNativeLanguage] = useState('');
    const [nearestCommute, setNearestCommute] = useState('');
    const [localCuisine, setLocalCuisine] = useState('');
    const [languageCommunication, setLanguageCommunication] = useState('');
    const [culturalInsights, setCulturalInsights] = useState('');
    const [typeOfWear, setTypeOfWear] = useState('');
    const [travelChallenges, setTravelChallenges] = useState('');
    const [solutions, setSolutions] = useState('');

    const [currentGroup, setCurrentGroup] = useState(0);

    const { title, body, dateTime, images, tagAndOther } = route.params;

    const groups = [
        {
            title: 'Travel Essentials',
            questions: [
                {
                    label: 'Necessary Items to Carry (comma-separated)',
                    value: necessaryItems,
                    onChangeText: setNecessaryItems,
                },
                {
                    label: 'Type of Wear to Carry',
                    value: typeOfWear,
                    onChangeText: setTypeOfWear,
                },
            ],
        },
        {
            title: 'Language & Communication',
            questions: [
                {
                    label: 'Native Language',
                    value: nativeLanguage,
                    onChangeText: setNativeLanguage,
                },
                {
                    label: 'Language and Communication',
                    value: languageCommunication,
                    onChangeText: setLanguageCommunication,
                },
            ],
        },
        {
            title: 'Cultural Insights',
            questions: [
                {
                    label: 'Local Cuisine',
                    value: localCuisine,
                    onChangeText: setLocalCuisine,
                },
                {
                    label: 'Cultural Insights',
                    value: culturalInsights,
                    onChangeText: setCulturalInsights,
                },
            ],
        },
        {
            title: 'Travel Logistics',
            questions: [
                {
                    label: 'Nearest Commute',
                    value: nearestCommute,
                    onChangeText: setNearestCommute,
                },
                {
                    label: 'Travel Challenges',
                    value: travelChallenges,
                    onChangeText: setTravelChallenges,
                },
                {
                    label: 'Solutions',
                    value: solutions,
                    onChangeText: setSolutions,
                },
            ],
        },
    ];

    useEffect(() => {
        // Load saved form data when the component mounts
        loadFormData('TravelTips').then((data) => {
            if (data) {
                setNecessaryItems(data?.necessaryItems.join(', ') || '');
                setNativeLanguage(data?.nativeLanguage || '');
                setNearestCommute(data?.nearestCommute || '');
                setLocalCuisine(data?.localCuisine || '');
                setLanguageCommunication(data?.languageCommunication || '');
                setCulturalInsights(data?.culturalInsights || '');
                setTypeOfWear(data?.typeOfWear || '');
                setTravelChallenges(data?.travelChallenges || '');
                setSolutions(data?.solutions || '');
            }
        });
    }, []);

    const handleNext = () => {
        if (currentGroup < groups.length - 1) {
            setCurrentGroup(currentGroup + 1);
        } else {
            const updatedBlogData = {
                necessaryItems: necessaryItems?.split(',').map(item => item.trim()),
                nativeLanguage,
                nearestCommute,
                localCuisine,
                languageCommunication,
                culturalInsights,
                typeOfWear,
                travelChallenges,
                solutions,
            };

            // Save form data
            saveFormData('TravelTips', updatedBlogData).then(() => {
                navigation.navigate('BlogPreviewScreen', { title, body, dateTime, images, tagAndOther, travelTips: updatedBlogData });
            });
        }
    };

    const handlePrevious = () => {
        if (currentGroup > 0) {
            setCurrentGroup(currentGroup - 1);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>{groups[currentGroup].title}</Text>
                {groups[currentGroup].questions.map((question, index) => (
                    <View key={index}>
                        <Text style={styles.label}>{question.label}</Text>
                        <TextInput
                            style={styles.input}
                            value={question.value}
                            onChangeText={question.onChangeText}
                        />
                    </View>
                ))}
                <View style={currentGroup === 0 ? styles.buttonContainer : styles.dualButtonContainer}>
                    {currentGroup > 0 && (
                        <TouchableOpacity style={styles.nextButton} onPress={handlePrevious}>
                            <Icon name="arrow-back" color="white" size={24} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        {currentGroup === groups.length - 1 ? <Text style={{ color: 'white', paddingHorizontal: 10 }}>Preview</Text> : null}<Icon name="arrow-forward" color="white" size={24} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 60,
    },
    sectionTitle: {
        textAlign: 'center',
        fontFamily: 'Sansita-Bold',
        fontSize: 25,
        marginVertical: 20,
    },
    label: {
        fontSize: 16,
        paddingHorizontal: 10,
        fontFamily: 'Sansita-Bold',
        marginVertical: 0,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 20,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    dualButtonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: '#008080',
        borderRadius: 30,
        padding: 10,
        elevation: 5,
    },
    backButton: {
        backgroundColor: '#008080',
        borderRadius: 30,
        padding: 10,
        elevation: 5,
    },
});
