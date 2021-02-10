import React from 'react'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { makeStyles } from '@material-ui/styles';
import firebase from '../firebase';
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles(() => ({
    deleteIcon: {
        '& :hover': {
            color: 'red'
        }
    }
}))

const DeletePost = ({postId}) => {   
    const classes = useStyles();
    const history = useHistory();

    function deletePost(e){
        try {
            e.preventDefault();
            firebase.firestore().collection('posts').doc(postId).delete().then(() => {
                history.push('/userhome'); 
            }); 
        } catch (error) {
            console.log('Unable to delete post', error)
        }
    }

    return (
      <div className={classes.deleteIcon} onClick={deletePost}>
        <DeleteOutlineIcon />
      </div>
    );
}

export default DeletePost;