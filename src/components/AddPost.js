import React, {useState} from 'react';
import {TextField, Button} from '@material-ui/core'
import {useAuth} from '../contexts/AuthContext'
import firebase from '../firebase';

const AddPost = ({history}) => {
    const {currentUser} = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const postsRef = firebase.firestore().collection('posts');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        postsRef.add({
            userRef: currentUser.uid,
            title:title, 
            description, 
            editorData: 'Start Coding Here!',
            docChanges: [{changeID: ''}]
        }).then((docRef) => {
            history.push({pathname: `/posts/${docRef.id}`})
        });  
    }

    return(
        <div>
            <form onSubmit={onSubmitHandler}>
                <TextField 
                    label='title' 
                    name='title' 
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)} />
                <TextField 
                    label='description' 
                    name='description' 
                    multiline rows={4} 
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}/>
                <Button type='submit'>Submit</Button>
            </form>
        </div>
    )
}

export default AddPost;