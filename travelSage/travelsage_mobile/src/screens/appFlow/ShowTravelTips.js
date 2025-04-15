import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/base'

export default function ShowTravelTips({ navigation, route }) {

    const [travelTip, setTravelTip] = useState({})
    const [locationObj, setLocationObj] = useState({})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')
    const [refreshing, setRefreshing] = useState('')

    const fetchTip = async () => {
        try {
            const response = await fetch(`http://10.0.7.255:8000/api/travel-tips/${route.params.blogId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch blog posts');
            }
            const data = await response.json();
            setTravelTip(data.travelTip);
            setLocationObj(!data?.travelTip?.locationObj ? null : JSON.parse(data.travelTip.locationObj));
            setError(false);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTip()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" color="white" size={24} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={{
                    borderBottomWidth: 2,
                    borderBottomColor: 'black',
                    paddingVertical: 10,
                    padding: 5
                }}>
                    {!locationObj ? null :
                        <View style={{
                            borderBottomWidth: 2,
                            borderBottomColor: 'black',
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-end',
                                paddingVertical: 10
                            }}>
                                <Text style={{
                                    fontFamily: 'Sansita-Bold',
                                    fontSize: 30,
                                    color: 'black'
                                }}>
                                    {locationObj.name}
                                </Text>
                                <Text style={{
                                    fontFamily: 'Sansita-Bold',
                                    fontSize: 20,
                                    paddingHorizontal: 10
                                }}>
                                    ({locationObj.class})
                                </Text>
                            </View>
                            <Text style={{
                                fontFamily: 'Sansita-Bold',
                                fontSize: 20,
                            }}>
                                {locationObj.display_name}
                            </Text>
                        </View>
                    }
                    <View>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: 'Sansita-Bold',
                            color: 'black'
                        }}>Tags</Text>
                        <View style={{
                            paddingVertical: 10
                        }}>{travelTip.tags?.map((t, i) => (
                            <Text key={i} style={{
                                fontFamily: 'Sansita-Regular',
                                fontSize: 18
                            }}>{t}</Text>
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
                            }}> {travelTip.category}</Text>
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
                        }}>{travelTip.necessaryItems?.map((n, i) => (
                            <Text key={i} style={{
                                fontFamily: 'Sansita-Regular',
                                fontSize: 18
                            }}>{n}</Text>
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
                            }}> {travelTip.typeOfWear}</Text>
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
                        }}> {travelTip.nativeLanguage}</Text>
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
                        }}>{travelTip.languageCommunication}</Text>
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
                        }}>{travelTip.localCuisine}</Text>
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
                        }}>{travelTip.cultureInsights}</Text>
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
                        }}>{travelTip.nearestCommute}</Text>
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
                        }}>{travelTip.travelChallenges}</Text>
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
                        }}>{travelTip.solutions}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    floatingButton: {
        backgroundColor: '#008080',
        borderRadius: 30,
        padding: 10,
        elevation: 5,
    },
});
