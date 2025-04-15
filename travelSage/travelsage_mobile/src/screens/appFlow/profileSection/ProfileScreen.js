import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Icon } from '@rneui/base';
// import RNStorage from 'rn-secure-storage';
import { useAuth } from '../../../contexts/Auth';
import { Card } from 'react-native-paper';

const ProfileScreen = ({ navigation }) => {
    const [profileData, setProfileData] = useState({});
    const [blogs, setBlogs] = useState([]);

    const { authData, loading, signOut } = useAuth()

    console.log(authData)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Example of retrieving profile data and blogs from secure storage
                const response = await fetch(`http://10.0.7.255:8000/api/get-user-blogs/${authData._id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch blog posts');
                }
                const data = await response.json();
                setBlogs(data.blogs.reverse())
            } catch (error) {
                console.error('Error retrieving data from secure storage:', error);
            }
        };

        fetchData();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.blogContainer} onPress={() => navigation.navigate('SingleBlog', { blog: item })}>
            <Card>
                <Card.Cover source={{ uri: `http://10.0.7.255:8000/${item.images[0]}` }} />
                <Card.Content>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}...</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" color="white" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{authData.firstName}</Text>
                <TouchableOpacity style={styles.floatingButton}>
                    <Icon name="edit" color="white" size={24} />
                </TouchableOpacity>
            </View>
            <View style={{
                alignItems: 'flex-end'
            }}>
                <TouchableOpacity onPress={() => signOut()}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
                {authData.profilePicture ? (
                    <Image source={{ uri: profileData.profilePicture }} style={styles.profileImage} />
                ) : (
                    <Icon name="user" type="font-awesome" size={80} color="#ddd" />
                )}
                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{blogs.length}</Text>
                        <Text style={styles.statLabel}>Blogs</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{profileData?.followersCount}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{profileData?.followingCount}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>
            </View>
            <View style={styles.bioContainer}>
                <Text style={styles.username}>{profileData?.username}</Text>
                <Text style={styles.bio}>{profileData?.bio}</Text>
            </View>
            {/* <Text>{JSON.stringify(blogs)}</Text> */}
            <FlatList
                data={blogs}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.blogsList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Sansita-Bold',
    },

    floatingButton: {
        backgroundColor: '#008080',
        borderRadius: 30,
        padding: 10,
        elevation: 5,
    },
    profileInfo: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontFamily: 'Sansita-Bold',
    },
    statLabel: {
        fontSize: 14,
        color: '#888',
        fontFamily: 'Sansita-Regular',
    },
    bioContainer: {
        paddingHorizontal: 20,
    },
    username: {
        fontSize: 18,
        fontFamily: 'Sansita-Bold',
    },
    bio: {
        fontSize: 14,
        color: '#888',
        fontFamily: 'Sansita-Regular',
    },
    blogsList: {
        flex: 1,
        paddingHorizontal: 10
    },
    blogContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        alignSelf: 'center',
        paddingBottom: 10,
        width: '100%'
    },
    blogImage: {
        width: 80,
        height: 80,
        marginRight: 10,
    },
    blogContent: {
        flex: 1,
        justifyContent: 'center',
    },
    blogTitle: {
        fontSize: 16,
        fontFamily: 'Sansita-Bold',
    },
    blogExcerpt: {
        fontSize: 14,
        color: '#555',
        fontFamily: 'Sansita-Regular',
    },
    card: {
        marginVertical: 10,
        marginHorizontal: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    description: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
});

export default ProfileScreen;
