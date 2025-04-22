import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, FlatList, TextInput, Button, Modal, TouchableWithoutFeedback } from 'react-native';
import { Icon } from '@rneui/base';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

export default function SingleBlogScreen({ navigation, route }) {
    const { blog } = route.params;
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [refresh]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://192.168.83.1:8000/api/get-comments/${blog._id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (result.success) {
                console.log(result)
                setComments(result.comments.reverse());
            } else {
                console.error('Failed to fetch comments:', result.message);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const renderComment = ({ item }) => (
        <View style={styles.commentContainer}>
            <Text style={styles.commentUser}>{item.userId.firstName} {item.userId.lastName}</Text>
            <Text style={styles.commentText}>{item.comment}</Text>
        </View>
    );

    const handlePostComment = async () => {
        if (newComment.trim() === '') return;

        try {
            const response = await fetch('http://192.168.83.1:8000/api/post-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    userId: authData._id,
                    comment: newComment,
                    dateTime: new Date().toISOString(),
                    blogId: blog._id
                })
            });
            const result = await response.json();
            if (result.success) {
                setNewComment('');
                setRefresh(!refresh); // Trigger a refresh
            } else {
                console.error('Failed to post comment:', result.message);
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleOpenPanel = () => {
        setIsPanelVisible(true);
    };

    const handleClosePanel = () => {
        setIsPanelVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" color="white" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.floatingButton, styles.floatingButton2]} onPress={() => navigation.navigate('ShowTravelTips', { blogId: blog._id })}>
                    <Text style={styles.travelTipsText}>Travel Tips</Text>
                    <Icon name="file-image-marker" type='material-community' color="white" size={24} />
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
                <ScrollView stickyHeaderIndices={[1]}>
                    <Swiper style={styles.wrapper} showsButtons={true}>
                        {blog.images.map((image, index) => (
                            <View key={index} style={styles.slide}>
                                <Image source={{ uri: `http://192.168.83.1:8000/${image}` }} style={styles.image} />
                            </View>
                        ))}
                    </Swiper>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{blog.title}</Text>
                    </View>
                    <Text style={styles.dateTime}>{blog.dateTime}</Text>
                    <Text style={styles.body}>{blog.body}</Text>
                    <View style={styles.header2}>
                        <TouchableOpacity style={[styles.floatingButton, styles.floatingButton2]} onPress={handleOpenPanel}>
                            <Text style={styles.travelTipsText}>Comments</Text>
                            <Icon name="comment" type='material' color="white" size={24} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {/* Bottom Sheet for comments */}
            <Modal
                transparent={true}
                visible={isPanelVisible}
                animationType="slide"
                onRequestClose={handleClosePanel}
            >
                <TouchableWithoutFeedback onPress={handleClosePanel}>
                    <View style={styles.modalBackground}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={styles.bottomSheetContainer}>
                                <Text style={styles.commentsTitle}>Comments</Text>
                                <FlatList
                                    data={comments}
                                    renderItem={renderComment}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                <TextInput
                                    style={styles.commentInput}
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChangeText={setNewComment}
                                />

                                <TouchableOpacity style={[styles.floatingButton, styles.floatingButton2]} onPress={handlePostComment}>
                                    <Text style={styles.travelTipsText}>Post Comment</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    header2: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    titleContainer: {
        backgroundColor: 'white',
    },
    title: {
        fontFamily: 'Sansita-Bold',
        fontSize: 30,
        justifyContent: 'flex-start',
    },
    dateTime: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    body: {
        fontFamily: 'Sansita-Regular',
        fontSize: 20,
        marginBottom: 20,
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
    floatingButton2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    travelTipsText: {
        color: 'white',
        fontFamily: 'Sansita-Bold',
        paddingHorizontal: 5,
    },
    wrapper: {
        height: 250,
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheetContainer: {
        backgroundColor: 'white',
        padding: 16,
        height: 450,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    commentsTitle: {
        fontSize: 24,
        marginBottom: 10,
    },
    commentContainer: {
        marginVertical: 10,
        padding: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentText: {
        marginTop: 5,
    },
    commentInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});