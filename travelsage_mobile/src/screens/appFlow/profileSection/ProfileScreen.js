import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    LayoutAnimation,
    UIManager,
    Platform,
    TextInput,
    Alert,
    ToastAndroid,
} from 'react-native';
import { Icon } from '@rneui/base';
import { useAuth } from '../../../contexts/Auth';
import { Card } from 'react-native-paper';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileScreen = ({ navigation }) => {
    const [profileData, setProfileData] = useState({});
    const [blogs, setBlogs] = useState([]);
    const { authData, signOut } = useAuth();
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState('');

    const handleDelete = (blogId, title) => {
        Alert.alert(
            "Delete Blog",
            `Are you sure you want to delete the blog titled "${title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://192.168.83.1:8000/api/delete-blogs/${blogId}`, {
                                method: 'DELETE',
                            });

                            if (response.ok) {
                                setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
                                ToastAndroid.show(`Deleted blog: "${title}"`, ToastAndroid.SHORT);
                            } else {
                                ToastAndroid.show('Failed to delete blog', ToastAndroid.SHORT);
                            }
                        } catch (error) {
                            ToastAndroid.show('Error deleting blog', ToastAndroid.SHORT);
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://192.168.83.1:8000/api/get-user-blogs/${authData._id}`);
                if (!response.ok) throw new Error('Failed to fetch blog posts');
                const data = await response.json();
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setBlogs(data.blogs.reverse());

                // Simulate fetching profile data
                setProfileData(authData);
                setBioText(authData?.bio || '');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.blogContainer} onPress={() => navigation.navigate('SingleBlog', { blog: item })}>
            <Card style={styles.card}>
                <Card.Cover source={{ uri: `http://192.168.83.1:8000/${item.images[0]}` }} style={styles.cardImage} />
                <Card.Content>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}...</Text>
                    <TouchableOpacity
                        style={{
                            marginTop: 10,
                            backgroundColor: '#FF6B6B',
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 20,
                            alignSelf: 'flex-end'
                        }}
                        onPress={() => handleDelete(item._id, item.title)}
                    >
                        <Text style={{ color: 'white', fontWeight: '600' }}>Delete</Text>
                    </TouchableOpacity>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" type="feather" color="#fff" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
                    <Icon name="log-out" type="feather" size={16} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={() => setIsEditingBio(!isEditingBio)}>
                    <Icon name="edit-2" type="feather" color="#fff" size={18} />
                </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profileInfo}>
                {authData.profilePicture ? (
                    <Image source={{ uri: profileData.profilePicture }} style={styles.profileImage} />
                ) : (
                    <Icon name="user" type="font-awesome" size={80} color="#ddd" />
                )}
                <Text style={styles.username}>{authData?.firstName || 'Your Name'}</Text>

                {isEditingBio ? (
                    <TextInput
                        style={styles.bioInput}
                        value={bioText}
                        onChangeText={setBioText}
                        placeholder="Add your bio here"
                        placeholderTextColor="#aaa"
                        multiline
                    />
                ) : (
                    <Text style={styles.bio}>{bioText || 'Add your bio here'}</Text>
                )}

                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{blogs.length}</Text>
                        <Text style={styles.statLabel}>Blogs</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{profileData?.followersCount || 0}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{profileData?.followingCount || 0}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>
            </View>

            {/* Blog List */}
            <FlatList
                data={blogs}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ padding: 16 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF1E6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF1E6',
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 3,
    },
    iconButton: {
        backgroundColor: '#FF6B6B',
        padding: 10,
        borderRadius: 25,
        elevation: 3,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 30,
        alignSelf: 'center',
        elevation: 3,
    },
    logoutText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    profileInfo: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: '#f3d8c7',
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#eee',
        marginBottom: 12,
    },
    username: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'Sansita-Bold',
        color: '#333',
    },
    bio: {
        fontSize: 14,
        color: '#777',
        fontFamily: 'Sansita-Regular',
        textAlign: 'center',
        marginTop: 4,
    },
    bioInput: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Sansita-Regular',
        textAlign: 'center',
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderColor: '#FF6B6B',
        paddingHorizontal: 8,
        paddingVertical: 6,
        minWidth: '70%',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: '100%',
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Sansita-Bold',
    },
    statLabel: {
        fontSize: 13,
        color: '#777',
        fontFamily: 'Sansita-Regular',
    },
    blogContainer: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3,
    },
    card: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    cardImage: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
        color: '#333',
        fontFamily: 'Sansita-Bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        fontFamily: 'Sansita-Regular',
        marginBottom: 10,
    },
});

export default ProfileScreen;
