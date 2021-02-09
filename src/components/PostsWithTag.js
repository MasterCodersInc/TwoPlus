import React from 'react'
import { Grid, Typography } from '@material-ui/core'

const PostsWithTag = ({tag}) => {
    return(
        <Grid>
            <Typography variant='h2'>{tag.name}</Typography>
        </Grid>
    )
}

export default PostsWithTag;