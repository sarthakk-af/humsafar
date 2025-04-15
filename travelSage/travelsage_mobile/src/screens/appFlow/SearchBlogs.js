import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Text, Searchbar } from 'react-native-paper';

const BlogPost = ({ post, onPress }) => (
    <TouchableOpacity onPress={onPress} underlayColor="#ffffff">
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.description}>{post.description}</Text>
            </Card.Content>
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
            const response = await fetch('http://10.0.7.255:8000/api/blogs');
            if (!response.ok) {
                throw new Error('Failed to fetch blog posts');
            }
            const data = await response.json();
            setPosts(data.blogs.reverse());
            setFilteredPosts(data.blogs.reverse());
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
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.searchbar}
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
    searchbar: {
        margin: 15,
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
    loadingText: {
        fontSize: 20,
        color:'#777',
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
    }
});
