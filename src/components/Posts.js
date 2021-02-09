import React, { useEffect, useState } from 'react'
import { Grid, Typography, makeStyles } from '@material-ui/core'
import { useLocation, Link } from 'react-router-dom'
import firebase from '../firebase'
import theme from './theme'

const useStyles = makeStyles((theme) => ({
    searchPage: {
        padding: '2%',
        margin: '2%'
    }
}))

const Posts = (props) => {
    //styling
    const classes = useStyles();

    //refs
    const postsRef = firebase.firestore().collection('posts')

    //states
    const [posts, setPosts] = useState([])

    //query
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const tag = urlParams.get('tag');

    //hooks
    useEffect(() => {
        if(tag){
            getPostsByTag(tag)
        }
    },[])

    //functions
    async function getPostsByTag (tag) {
        try {
            const postsColl = await postsRef.where("tags", "array-contains", "passport").get();
            const posts = await postsColl.docs.map(postDoc => {
                return {... postDoc.data(), postId: postDoc.id};
            })
            setPosts(posts);
        } catch (error) {
            console.log(`Unable to get posts with tag ${tag}`, error)
        }
        
    } 

    return(
        <Grid className={classes.searchPage}>
            <Typography variant='h2'>Search Results: {tag}</Typography>
            {
                posts.map((post) => (
                    <Grid key={post.postId} direction='column'>
                            <Typography 
                                component={Link}
                                to={`/posts/${post.postId}`}
                                variant="h5">
                                    {post.title}
                            </Typography>
                            <Grid direction='row'>
                                <Typography
                                    component={Link}
                                >

                                </Typography>
                            </Grid>
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default Posts;