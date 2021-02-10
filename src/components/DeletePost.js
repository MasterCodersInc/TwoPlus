import React from 'react'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {Button, IconButton} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles';
import firebase from '../firebase';
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    deleteButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.common.colorOne,
        color: 'white',
        fontFamily: 'Montserrat',
        fontWeight: '500',
        marginLeft: "1em",
        verticalAlign: 'text-top',
        '&:hover': {
            color: 'red'
        }
    },
    deleteIcon: {
        '&:hover': {
            color: 'red'
        }
    }
}))

const DeletePost = ({postId, fontSize}) => { 
    const theme = useTheme();  
    const classes = useStyles();
    const history = useHistory();

    async function deletePost(e){
        try {
            await firebase.firestore().collection('posts').doc(postId).delete()
            history.push('/userhome/deleted')
        } catch (error) {
            console.log('Unable to delete post', error)
        }
    }

    if(fontSize === 'medium'){
        return (
            <Button 
                variant='contained' 
                type='button' 
                className={classes.deleteButton} 
                onClick={deletePost}>
                  <DeleteOutlineIcon fontSize={fontSize}/> Delete &nbsp;
            </Button>
          );
    } else{
        return (
            <IconButton 
                aria-label='delete' 
                className={classes.deleteIcon} 
                onClick={deletePost}>
                    <DeleteOutlineIcon fontSize='small' />
            </IconButton>
        )
    }
}

export default DeletePost;