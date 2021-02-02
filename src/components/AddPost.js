import React, {useState} from 'react';
import {TextField, Button} from '@material-ui/core'
import {useAuth} from '../contexts/AuthContext'
import firebase from '../firebase';
import {Redirect} from 'react-router-dom'

const AddPost = ({history}) => {
    const {currentUser} = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const postsRef = firebase.firestore().collection('posts');

    console.log('all posts',postsRef )

    const onSubmitHandler = (e) => {
        e.preventDefault();
        postsRef.add({title:title, description, editorData: 'Start Coding Here!'}).then((docRef) => {
            // return <Redirect to={{
            //     pathname: `/posts/${docRef.id}`,
            //     state: {
            //         doc: docRef
            //     }
            // }} />
            console.log('DOCREF:',docRef)
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