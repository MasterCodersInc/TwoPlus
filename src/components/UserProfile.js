import React from "react";
import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function UserProfile() {
  return (
    <Grid container>
      <Grid item container>
        <Grid item>
          <Typography variant="h1"> THIS IS THE USER PROFILE</Typography>
        </Grid>
        <Grid item>
          <Button variant="filled" component={Link} to="/updateprof">
            Edit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
