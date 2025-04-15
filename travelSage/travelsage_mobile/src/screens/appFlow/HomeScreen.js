import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl, TouchableHighlight, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card, ActivityIndicator } from 'react-native-paper';
import { Icon } from '@rneui/base';

const BlogPost = ({ post, onPress }) => (
    <TouchableHighlight onPress={onPress} underlayColor="#ffffff">
        <Card style={styles.card}>
            {/* <Card.Cover source={{ uri: `http://10.0.7.255:8000/${post.images[0]}` }} /> */}
            <Card.Content>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.description}>{post.description}...</Text>
            </Card.Content>
        </Card>
    </TouchableHighlight>
);

export const HomeScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://10.0.7.255:8000/api/blogs');
            if (!response.ok) {
                throw new Error('Failed to fetch blog posts');
            }
            const data = await response.json();
            setPosts(data.blogs.reverse());
            setError(false);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPosts();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchPosts();
        }, [])
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" color="#008080" />
                <Text style={styles.loadingText}>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load blog posts. Please check your internet connection and try again.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-end'
            }}>
                <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('ProfileScreen')}>
                    <Icon name="account" type='material-community' color="white" size={24} />
                </TouchableOpacity> 
                <Text style={styles.header}>humSafar</Text>
            </View>
            {posts.length === 0 ? (
                <View style={styles.noPostsContainer}>
                    <Text style={styles.noPostsText}>No blog posts available</Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <BlogPost
                            post={item}
                            onPress={() => navigation.navigate('SingleBlog', { blog: item })}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor='#008080'
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 20,
    },
    header: {
        fontFamily: 'Sansita-Bold',
        fontSize: 40,
        paddingHorizontal: 10
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    loadingText: {
        fontSize: 20,
        color: '#777',
        marginTop: 20,
    },
    errorText: {
        fontSize: 20,
        color: 'red',
        textAlign: 'center',
    },
    noPostsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noPostsText: {
        fontSize: 20,
        color: '#777',
    },
    floatingButton: {
        backgroundColor: '#008080',
        borderRadius: 30,
        padding: 10,
        elevation: 5,
    },
});

export default HomeScreen;
