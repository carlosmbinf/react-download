import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Router } from 'react-router-dom';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    body2: {
        width: "100%",
        height: "100vh",
        background: "#607d8b",
        transition: "1s",
    },
    facebackground: {
        maxWidth: "100%",
        height: "auto",
    },
}));


export default function Download(){
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    const history = useHistory();

    const onHover = () => {
        document.getElementById("init").style.backgroundColor = "#00f3ff";
    }
    const onHoverOut = () => {
        document.getElementById("init").style.backgroundColor = "#607d8b";
    }
    const onClickEvent = () => {

        const youtubedl = require('youtube-dl')

        const url = 'http://www.youtube.com/watch?v=WKsjaOqDXgg'
        // Optional arguments passed to youtube-dl.
        const options = ['--username=user', '--password=hunter2']
        
        youtubedl.getInfo(url, options, function(err, info) {
          if (err) throw err
        
          console.log('id:', info.id)
          console.log('title:', info.title)
          console.log('url:', info.url)
          console.log('thumbnail:', info.thumbnail)
          console.log('description:', info.description)
          console.log('filename:', info._filename)
          console.log('format id:', info.format_id)
          console.log('filesize:', info.filesize)
        })
        
    }
    return (
        <Grid id="init"
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.body2}
        >
            <img src="/img/pngwing.com.png" alt="X" height="200px" width="200px" className={classes.facebackground} onMouseOver={onHover} onMouseOut={onHoverOut} onClick={onClickEvent} />
        </Grid>
    );
}