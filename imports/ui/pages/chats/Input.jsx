import React, {useState} from 'react';
import { makeStyles,createStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { useHistory } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import { MensajesCollection } from "../collections/collections";
import { Meteor } from "meteor/meteor";

//ICONS
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import GroupIcon from '@material-ui/icons/Group';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { AppBar, Container, Grid, IconButton, TextField, Toolbar, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
const useStyles = makeStyles((theme) =>
createStyles({
    root: {
        width: "100%",
      position: "fixed",
      bottom: 0,
      color:"white",
      boxShadow: "0 0 20px 0px rgb(0 0 0 / 46%);",
      backgroundColor: 'black',
      zIndex: "1",
      backdropFilter: "blur(30px)",
      [theme.breakpoints.up('sm')]: {
        display:"none",
      },
       "&$selected": {
            color: theme.palette.secondary.main,
          },
      },
      selected: {
        color: "white",
         "&$selected": {
            color: "white",
          },
          
          
      },
  input: {
    position: 'fixed',
    bottom: 0,
    backdropFilter: 'blur(30px)',
    backgroundColor: '#343e6b;',
    width: '100%',
    maxHeight: '100px'
  },
  margin: {
    margin: 5
  }
}));

export default function Input() {
   
  
    const history = useHistory();
    const classes = useStyles();
    const [mensaje, setMensaje] = useState("");
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { id } = useParams();

 

    const handleSubmit = (event) => {
      event.preventDefault();
      // console.log(mensaje)
      mensaje != "" && (
      MensajesCollection.insert({
              from: Meteor.userId(),
              to: id,
              mensaje: mensaje
            }),
            setMensaje("")
            )
    };
  
  return <form autoComplete="off" onSubmit={handleSubmit} className={classes.input}>
    <Grid container style={{padding:"2px 40px 2px 40px"}} spacing={2}>
      <Grid item xs >
        <TextField
          id="outlined"
          label="Mensaje"
          value={mensaje}
          onChange={event => setMensaje(event.target.value)}
          // className={classes.text}
          color="secondary"
          // InputProps={{
          //   className: classes.text
          // }}
          // margin="normal"
          // variant="outlined"
          required
          fullWidth
          // multiline
          // maxRows={4}
        />
      </Grid>
      <Grid item xs={2} md={1}>
        <IconButton disabled={mensaje == "" ? true : false} type='submit' aria-label="delete" className={classes.margin}>
          <SendRoundedIcon />
        </IconButton>
      </Grid>
    </Grid>


  </form>
}