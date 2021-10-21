import React, { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Paper, Box, Grid, Icon, IconButton, Zoom, Dialog, CircularProgress, Divider, Button } from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";


import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import { Link, useParams } from "react-router-dom";
import Rotate from 'react-reveal/Rotate';
//icons
import CancelIcon from '@material-ui/icons/Cancel';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    // maxWidth: 275,
    borderRadius: 20,
    margin: "2em",
    padding: "2em",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  createUser: {
    color: "#114c84",
  },
  margin: {
    margin: theme.spacing(1),
  },
  flex: {
    display: "flex",
    justifyContent: "flex-end",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  load: {
    width: 50,
    height: 50,
  },
}));

export default function StateServers() {
  
  const [domain, setDomain] = useState();
  const [ip, setIp] = useState();
  const [active, setActive] = useState();
  const [details, setDetails] = useState();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [transition, setTransition] = useState(undefined);
  const [load, setLoad] = useState(false);
  

  // useEffect(() => {
  //   console.log(useParams().id)
  //   console.log(server);
  //   server&&(
  //   setDomain(server.domain),
  //   setIp(server.ip),
  //   setActive(server.active),
  //   setDetails(server.details)
  // )
  // });
  // Meteor.subscribe("server", useParams().id).ready&&(
  //   setDomain(ServersCollection.findOne(useParams().id)&&ServersCollection.findOne(useParams().id).domain),
  //   setIp(ServersCollection.findOne(useParams().id)&&ServersCollection.findOne(useParams().id).ip),
  //   setActive(ServersCollection.findOne(useParams().id)&&ServersCollection.findOne(useParams().id).active),
  //   setDetails(ServersCollection.findOne(useParams().id)&&ServersCollection.findOne(useParams().id).details)
  // )
   

  function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
  }
  const handleClick = (Transition) => () => {
    setTransition(() => Transition);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };
  async function makePostRequest(value) {
    setLoad(true);
   

    // try {
      
    //   setMessage(`Servidor ${server&&server.ip} Actualizado`),
    //   handleClick(TransitionUp),
    //   setLoad(false),
    //   setOpen(true)
    // } catch (error) {
    //   setMessage(`Ocurrió un Error al insertar el server con IP: ${server&&server.ip}`),
    //   console.log(error);
    //     handleClick(TransitionUp),
    //     setLoad(false),
    //     setOpen(true)
    // }
    value ?
      $.post("/listen")
        .done(function (data) {
          setMessage(data);
          handleClick(TransitionUp);
          setLoad(false);
          setOpen(true);
        })
        .fail(function (data) {
          setMessage(data);
          handleClick(TransitionUp);
          setLoad(false);
          setOpen(true);
        })
      :
      $.post("/close")
        .done(function (data) {
          setMessage(data);
          handleClick(TransitionUp);
          setLoad(false);
          setOpen(true);
        })
        .fail(function (data) {
          setMessage(data);
          handleClick(TransitionUp);
          setLoad(false);
          setOpen(true);
        })


  }
  function handleSubmit(event) {
    event.preventDefault();
    // console.log( 'Email:', email, 'Password: ', password, 'firstName: ', firstName);

    // You should see email and password in console.
    // ..code to submit form to backend here...

    

    makePostRequest();
  }


  const classes = useStyles();
  return (
    <>
      <Dialog aria-labelledby="simple-dialog-title" open={load}>
        <Grid className={classes.load}>
          <CircularProgress />
        </Grid>
      </Dialog>
      <Rotate top left>
        <Paper elevation={5} className={classes.root}>
          <Snackbar
            autoHideDuration={3000}
            open={open}
            onClose={handleClose}
            TransitionComponent={transition}
            message={message}
            key={transition ? transition.name : ""}
            style={{zIndex:1}}
          />
          {/* <Button onClick={handleClick(TransitionUp)}>Up</Button> */}
          <h3>Proxy:</h3>
          <IconButton onClick={()=>makePostRequest(0)} aria-label="play">
            <CancelIcon />
          </IconButton >
          <IconButton onClick={()=>makePostRequest(1)} aria-label="cancel">
            <PlayCircleFilledIcon />
          </IconButton>
        </Paper>
      </Rotate>
    </>
  );
}
