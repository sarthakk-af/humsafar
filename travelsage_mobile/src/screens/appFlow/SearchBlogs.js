import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Card, Text, Searchbar } from 'react-native-paper';

const BlogPost = ({ post, onPress }) => (
    <TouchableOpacity onPress={onPress} underlayColor="#ffffff">
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <Image
                    source={{
                        uri: post.image && post.image.startsWith('http')
                            ? post.image
                            : 'https://via.placeholder.com/70',
                    }}
                    style={styles.thumbnail}
                />
                <View style={styles.textContent}>
                    <Text style={styles.title}>{post.title}</Text>
                    <Text style={styles.description}>{post.description}</Text>
                </View>
            </View>
        </Card>
    </TouchableOpacity>
);

export default function SearchBlogs({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://192.168.0.101:8000/api/blogs');
            if (!response.ok) throw new Error('Failed to fetch blog posts');

            const data = await response.json();
            const reversedPosts = data.blogs.reverse();
            setPosts(reversedPosts);
            setFilteredPosts(reversedPosts);
            setError(false);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        if (query === '') {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter((post) =>
                post.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" color="#e86f6f" />
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
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.searchbar}
                iconColor="#e86f6f"
                inputStyle={{ color: '#000' }}
            />
            {filteredPosts.length === 0 ? (
                <View style={styles.noPostsContainer}>
                    <Text style={styles.noPostsText}>No blog posts found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPosts}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <BlogPost
                            post={item}
                            onPress={() => navigation.navigate('SingleBlog', { blog: item })}
                        />
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef6f1',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fef6f1',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fef6f1',
        paddingHorizontal: 20,
    },
    searchbar: {
        margin: 15,
        borderRadius: 25,
        backgroundColor: '#f6edff',
    },
    card: {
        marginVertical: 8,
        marginHorizontal: 15,
        backgroundColor: '#fcf5ff',
        borderRadius: 16,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    thumbnail: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 15,
        backgroundColor: '#eee',
    },
    textContent: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    loadingText: {
        fontSize: 20,
        color: '#777',
        marginTop: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
    noPostsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noPostsText: {
        fontSize: 18,
        color: '#777',
    },
});
