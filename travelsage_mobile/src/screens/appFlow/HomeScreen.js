import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card, ActivityIndicator } from 'react-native-paper';
import { Icon } from '@rneui/themed';

const BlogPost = ({ post, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
    <Card style={styles.card}>
      {post.images?.[0] && (
        <Image
          source={{ uri: `http://192.168.0.101:8000/${post.images[0]}` }}
          style={styles.cardImage}
        />
      )}
      <Card.Content style={styles.cardContent}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}...</Text>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

export const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://192.168.0.101:8000/api/blogs');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      const data = await response.json();
      setPosts(data.blogs.reverse());
      setError(false);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
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
        <ActivityIndicator animating={true} size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load blog posts. Please check your internet connection and try again.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Icon name="account-circle" type="material" color="white" size={24} />
        </TouchableOpacity>
        <Text style={styles.header}>humsafar</Text>
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B6B" />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
   // padding:10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF1E6',
  },
  profileButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    padding: 8,
    elevation: 4,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    marginLeft: 12,
    color: '#444',
    fontFamily: 'sans-serif-medium',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    paddingTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
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

export default HomeScreen;
