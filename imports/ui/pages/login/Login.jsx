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


export const Login = () => {
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    const history = useHistory();
    
    const onHover= () => {
        document.getElementById("init").style.backgroundColor = "#00f3ff";
    }
    const onHoverOut= () => {
        document.getElementById("init").style.backgroundColor = "#607d8b";
    }
    const onClickEvent= () => {
        Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, function(err){
            if (err) {
                console.log('Handle errors here: ', err);
            }else{
            }
        });

    }
    return (
        <Grid id="init" 
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.body2} 
            >
            <img src="/img/pngwing.com.png" alt="X"  height="200px" width="200px" className={classes.facebackground} onMouseOver={onHover} onMouseOut={onHoverOut} onClick={onClickEvent}/>
        </Grid>
    );
}