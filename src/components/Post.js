import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import EditorUID from './EditorUID'
import {useAuth} from '../contexts/AuthContext'
import ChatRoom from './ChatRoom'
import firebase from '../firebase'
import {Typography, Button, Grid} from '@material-ui/core'

const Post = (props) => {
    const {currentUser} = useAuth();
    const {postId} = useParams();
    const [post, setPost] = useState('');
    const buttonName = post.isActive ? "Close Post" : "Open Post";
    //get post's doc reference
    const postRef = firebase.firestore().collection('posts').doc(`${postId}`);

    useEffect(() => {
        //get post from database
       async function getPostData(){
            const postFromDb = await postRef.get();
            const postData = postFromDb.data();
            setPost(postData);
        }
        getPostData();
    },[])

    function toggleActive(){
        postRef.update({isActive: !post.isActive});
        setPost({...post, isActive: !post.isActive});
    }

    return (
        <div>
            <Grid
                container
                direction='row'
                justify='space-between'
                alignItems='center'>
                <Typography variant='h5'>{post?.title || ''}</Typography>
                <Button variant='contained' color='secondary' onClick={toggleActive}>{buttonName}</Button>
            </Grid>
            <Typography>{post.description || ''}</Typography>
            <EditorUID uid={currentUser.uid} disabled={!post?.isActive}/>
            <ChatRoom disabled={!post?.isActive}/>
        </div>
    )
}

export default Post;