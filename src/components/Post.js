import React from 'react'
import EditorUID from './EditorUID'
import {useAuth} from '../contexts/AuthContext'

const Post = (props) => {
    const {currentUser} = useAuth();
    console.log(currentUser)
    return (
        <div>
            <div>
                {/* Div with users inside post */}
            </div>
            <EditorUID uid={currentUser.uid}/>
            {/* <Chat /> */}
        </div>
    )
}

export default Post;