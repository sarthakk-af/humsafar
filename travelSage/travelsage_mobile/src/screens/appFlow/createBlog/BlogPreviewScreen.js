import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { Icon } from '@rneui/base';
import Swiper from 'react-native-swiper';
import RNStorage from 'rn-secure-storage';
import { useAuth } from '../../../contexts/Auth';

const { width } = Dimensions.get('window');

export default function PreviewScreen({ navigation }) {
    const [data, setData] = useState({});
    const { authData } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve data stored in secure storage for each screen
                const addNewBlog = await RNStorage.getItem('AddNewBlog');
                const uploadScreen = await RNStorage.getItem('UploadScreen');
                const addTagsAndLocation = await RNStorage.getItem('AddTagsAndLocation');
                const travelTips = await RNStorage.getItem('TravelTips');

                // Merge all data into one object
                const mergedData = {
                    ...JSON.parse(addNewBlog),
                    ...JSON.parse(uploadScreen),
                    ...JSON.parse(addTagsAndLocation),
                    ...JSON.parse(travelTips),
                };

                console.log("lpgof6yguhijo", mergedData)

                setData(mergedData);
                console.log("data", data)
            } catch (error) {
                console.error('Error retrieving data from secure storage:', error);
            }
        };

        fetchData();
    }, []);

    const handleEdit = () => {
        navigation.navigate('AddNewBlog', { ...data });
    };

    const uploadBlog = async () => {
        try {
            const formData = new FormData();
            formData.append('userId', authData._id)
            formData.append('title', data.title);
            formData.append('body', data.body);
            formData.append('dateTime', data.dateTime);

            formData.append('necessaryItems', data.necessaryItems)
            formData.append('typeOfWear', data.typeOfWear)
            formData.append('tags', data.tags)
            formData.append('category', data.category)
            formData.append('nativeLanguage', data.nativeLanguage)
            formData.append('locationName', data.locationObj.name)
            formData.append('locationObj', JSON.stringify(data.locationObj))
            formData.append('localCuisine', data.localCuisine)
            formData.append('cultureInsights', data.cultureInsights)
            formData.append('nearestCommute', data.nearestCommute)
            formData.append('travelChallenges', data.travelChallenges)
            formData.append('solutions', data.solutions)

            data.images.forEach((image, index) => {
                formData.append('images', {
                    uri: image.uri,
                    type: image.type,
                    name: `image-${index}.jpg`,
                });
            });

            const response = await fetch('http://10.0.7.255:8000/api/create-blog', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload blog');
            }

            const responseData = await response.json();
            if (responseData.success) {
                RNStorage.removeItem('AddNewBlog');
                RNStorage.removeItem('UploadScreen');
                RNStorage.removeItem('AddTagsAndLocation');
                RNStorage.removeItem('TravelTips');
                navigation.navigate('HomeScreen');
            } else {
                Alert.alert('Error', 'There was an error in saving the blog. Please try again later.');
            }
            console.log('Blog uploaded successfully:', responseData);
        } catch (error) {
            console.error('Error uploading blog:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* <Text>{JSON.stringify(data)}</Text> */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.floatingButton} onPress={handleEdit}>
                    <Icon name="edit" color="white" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Preview Blog</Text>
                <TouchableOpacity style={styles.floatingButton} onPress={uploadBlog}>
                    <Icon name="check" solid={true} color="white" size={24} />
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
                <ScrollView stickyHeaderIndices={[1]}>
                    {data.images && data.images.length > 0 ? (
                        <Swiper style={styles.wrapper} showsButtons={true}>
                            {data.images.map((image, index) => (
                                <View key={index}>
                                    <View style={styles.slide}>
                                        <Image source={{ uri: image?.uri }} style={styles.image} />
                                    </View>
                                    <Text style={{ textAlign: 'right' }}>{data.locationObj.name}</Text>
                                </View>
                            ))}
                        </Swiper>
                    ) : (
                        <Text style={styles.noImagesText}>No images available</Text>
                    )}
                    <View style={{ backgroundColor: 'white', elevation: 12 }}>
                        <Text style={styles.title}>{data?.title}</Text>
                        <Text style={styles.dateTime}>{data?.dateTime}</Text>
                    </View>
                    <View>
                        <Text style={styles.body}>{data?.body}</Text>
                    </View>

                    <View style={{
                        borderBottomWidth: 2,
                        borderBottomColor: 'black',
                        paddingVertical: 10,
                        padding: 5
                    }}>
                        <View>
                            <Text style={{
                                fontSize: 25,
                                fontFamily: 'Sansita-Bold',
                                color: 'black'
                            }}>Tags</Text>
                            <View style={{
                                paddingVertical: 10
                            }}>{data.tags?.map((t, i) => (
                                <Text key={i} style={{
                                    fontFamily: 'Sansita-Regular',
                                    fontSize: 18
                                }}><Icon name="arrow-forward" color="black" size={15} />{t}</Text>
                            ))}</View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>
                                <Text style={{
                                    fontFamily: 'Sansita-Bold',
                                    fontSize: 18,
                                }}>Category:</Text>
                                <Text style={{
                                    fontFamily: 'Sansita-Regular',
                                    fontSize: 18
                                }}> {data.category}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        borderBottomWidth: 2,
                        borderBottomColor: 'black',
                        paddingVertical: 10,
                        padding: 5
                    }}>
                        <View>
                            <Text style={{
                                fontSize: 25,
                                fontFamily: 'Sansita-Bold',
                                color: 'black'
                            }}>Travel Essentials</Text>
                            <View style={{
                                paddingVertical: 10
                            }}>{data.necessaryItems?.map((n, i) => (
                                <Text key={i} style={{
                                    fontFamily: 'Sansita-Regular',
                                    fontSize: 18
                                }}><Icon name="arrow-forward" color="black" size={15} />{n}</Text>
                            ))}</View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>
                                <Text style={{
                                    fontFamily: 'Sansita-Bold',
                                    fontSize: 18
                                }}>Type Of wear:</Text>
                                <Text style={{
                                    fontFamily: 'Sansita-Regular',
                                    fontSize: 18
                                }}> {data.typeOfWear}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        borderBottomWidth: 2,
                        borderBottomColor: 'black',
                        paddingVertical: 10,
                        padding: 5
                    }}>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: 'Sansita-Bold',
                            color: 'black'
                        }}>Language and Communication</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                        }}>
                            <Text style={{
                                fontFamily: 'Sansita-Bold',
                                fontSize: 18
                            }}>Native language Spoken:</Text>
                            <Text style={{
                                fontFamily: 'Sansita-Regular',
                                fontSize: 18
                            }}> {data.nativeLanguage}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap'
                        }}>
                            <Text style={{
                                fontFamily: 'Sansita-Bold',
                                fontSize: 18
                            }}>Languages can we communicate: </Text>
                            <Text style={{
                                fontFamily: 'Sansita-Regular',
                                fontSize: 18,
                            }}>{data.languageCommunication}</Text>
                        </View>
                    </View>
                    <View style={{
                        borderBottomWidth: 2,
                        borderBottomColor: 'black',
                        paddingVertical: 10,
                        padding: 5
                    }}>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: 'Sansita-Bold',
                            color: 'black'
                        }}>Cultural Insights</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap'
                        }}>
                            <Text style={{
                                fontFamily: 'Sansita-Bold',
                                fontSize: 18
                            }}>Local Cuisine: </Text>
                            <Text style={{
                                fontFamily: 'Sansita-Regular',
                                fontSize: 18
                            }}>{data.localCuisine}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap'
                        }}>
                            <Text style={{
                                fontFamily: 'Sansita-Bold',
                                fontSize: 18
                            }}>Cultural Insights: </Text>
                            <Text style={{
                                fontFamily: 'Sansita-Regular',
                                fontSize: 18
                            }}>{data.cultureInsights}</Text>
                        </View>
                    </View>
                    <View style={{
                        borderBottomWidth: 2,
                        borderBottomColor: 'black',
                        paddingVertical: 10,
                        padding: 5
                    }}>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: 'Sansita-Bold',
                            color: 'black'
                        }}>Travel and Logistics</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap'
                        }}>
                            <Text style={{
                                fontFamily: 'Sansita-Bold',
                                fontSize: 18
                            }}>Nearest Commute: </Text>
                            <Text style={{
                                fontFamily: 'Sansita-Regular',
                                fontSize: 18
                            }}>{data.nearestCommute}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap'
                        }}>
                            <Text style={{
                                fontFamily: 'Sansita-Bold',
                                fontSize: 18
                            }}>Travel Challenges: </Text>
                            <Text style={{
                                fontFamily: 'Sansita-Regular',
                                fontSize: 18
                            }}>{data.travelChallenges}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap'
                        }}>
                            <Text style={{
                                fontFamily: 'Sansita-Bold',
                                fontSize: 18
                            }}>Solutions: </Text>
                            <Text style={{
                                fontFamily: 'Sansita-Regular',
                                fontSize: 18
                            }}>{data.solutions}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: 'black',
        fontFamily: 'Sansita-Bold',
        fontSize: 30,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    dateTime: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    body: {
        // color: 'black',
        fontFamily: 'Sansita-Bold',
        fontSize: 20,
        marginVertical: 20,
    },
    image: {
        width,
        height: 200,
    },
    floatingButton: {
        backgroundColor: '#008080',
        borderRadius: 30,
        padding: 10,
        elevation: 5,
    },
    wrapper: {
        height: 250, // Adjust the height according to your image size
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});
