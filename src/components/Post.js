import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import EditorUID from './EditorUID'
import {useAuth} from '../contexts/AuthContext'
import ChatRoom from './ChatRoom'
import firebase from '../firebase'
import {Typography, Button, Grid} from '@material-ui/core'
import {useTheme, withStyles} from '@material-ui/core/styles'

const Post = (props) => {
    const {currentUser} = useAuth();
    const {postId} = useParams();
    const [post, setPost] = useState('');
    const [enableCollab, setEnableCollab] = useState(false)
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

    function toggleEditor(){
        const newCollabStage = !enableCollab;
        setEnableCollab(!enableCollab)
    }

    const theme = useTheme();
    const colorToToggleActive = post?.isActive ? theme.palette.common.colorRed:theme.palette.common.colorGreen 
    const colorHoverToggle = post?.isActive ? theme.palette.common.colorRedHover : theme.palette.common.colorGreenHover
    
    const ColorButton = withStyles((theme) => ({
        root: {
          color: 'white',
          backgroundColor: `${colorToToggleActive}`,
          '&:hover': {
            backgroundColor:  `${colorHoverToggle}`,
           },
        },
      }))(Button);

    return (
        <div>
            {console.log('ON RENDER TOGGLE', enableCollab)}
            <Grid
                container
                direction='row'
                justify='space-between'
                alignItems='center' >
                <Typography variant='h5'>{post?.title || ''}</Typography>
                <div>
                    {
                        currentUser.uid === post.userRef && 
                        <Button variant='contained' color='secondary' onClick={toggleEditor}>Enable Collab</Button> 
                    }
                    <ColorButton variant='contained' onClick={toggleActive}>{buttonName}</ColorButton>
                </div>
            </Grid>
            <Typography>{post.description || ''}</Typography>
            <EditorUID uid={currentUser.uid} disabled={!post?.isActive} enableCollab={enableCollab}/>
            <ChatRoom disabled={!post?.isActive}/>
        </div>
    )
}

export default Post;