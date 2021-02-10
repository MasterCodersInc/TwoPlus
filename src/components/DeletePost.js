import React from 'react'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(() => ({
    deleteIcon: {
        '& :hover': {
            color: 'red'
        }
    }
}))

const DeletePost = (props) => {   
    const classes = useStyles();

    return (
      <div className={classes.deleteIcon}>
        <DeleteOutlineIcon />
      </div>
    );
}

export default DeletePost;