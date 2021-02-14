import React from 'react'
import Lottie from "react-lottie";
import animationData from "../lotties/animation_kkyxn6gq.json";
import { Box, Grid } from '@material-ui/core'

function Loading (props) {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <Box style={{ height: "100vh", width: "100vw" }}>
        <Grid
            item
            container
            justify="center"
            alignItems="center"
            style={{ marginTop: "12%" }}
        >
            <Lottie options={defaultOptions} height={400} width={400} />
        </Grid>
        </Box>
    );
}

export default Loading;