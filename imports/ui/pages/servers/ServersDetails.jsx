import React, { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper, Box, Grid, Icon, IconButton, Zoom, Dialog, CircularProgress, Divider } from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import { Link, useParams } from "react-router-dom";
import Rotate from 'react-reveal/Rotate';
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import { FormControl, TextField, InputAdornment } from "@material-ui/core";
import MailIcon from "@material-ui/icons/Mail";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SendIcon from "@material-ui/icons/Send";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";


import { ServersCollection } from "../collections/collections"
import ServerTable from "./ServerTable";
const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    // maxWidth: 275,
    borderRadius: 20,
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

export default function ServersDetails() {
  
  const [domain, setDomain] = useState();
  const [ip, setIp] = useState();
  const [active, setActive] = useState();
  const [details, setDetails] = useState();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [transition, setTransition] = useState(undefined);
  const [load, setLoad] = useState(false);
  
  const server = useTracker(() => {
    Meteor.subscribe("server", useParams().id)
    return ServersCollection.findOne(useParams().id)
  });

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
  function handleSubmit(event) {
    event.preventDefault();
    // console.log( 'Email:', email, 'Password: ', password, 'firstName: ', firstName);

    // You should see email and password in console.
    // ..code to submit form to backend here...

    async function makePostRequest() {
      setLoad(true);
      let serverData={}
      domain&&(serverData["domain"] = domain)
      ip&&(serverData["ip"] = ip)
      active==true&&(serverData["active"] = active)
      active==false&&(serverData["active"] = active)
      details&&(serverData["details"] = details)
      console.log(serverData);
      try {
        ServersCollection.update(server._id, {
          $set: serverData,
        });
        setMessage(`Servidor ${server&&server.ip} Actualizado`),
        handleClick(TransitionUp),
        setLoad(false),
        setOpen(true)
      } catch (error) {
        setMessage(`Ocurrió un Error al insertar el server con IP: ${server&&server.ip}`),
        console.log(error);
          handleClick(TransitionUp),
          setLoad(false),
          setOpen(true)
      }

      // var http = require("http");
      // http.post = require("http-post");
      // http.post("/hello", user, (opciones, res, body) => {
      //   if (!opciones.headers.error) {
      //     // console.log(`statusCode: ${res.statusCode}`);
      //     console.log("error " + JSON.stringify(opciones.headers));

      //     setMessage(opciones.headers.message);
      //     handleClick(TransitionUp);
      //     setLoad(false);
      //     setOpen(true);

      //     return;
      //   } else {
      //     console.log(opciones.headers);
      //     setMessage(opciones.headers.message);
      //     handleClick(TransitionUp);
      //     setLoad(false);
      //     setOpen(true);
      //     return;
      //   }
      // });
    }

    makePostRequest();
  }


  const classes = useStyles();
  return (
    server?<>
      <div className={classes.drawerHeader}>
        <IconButton
          color="primary"
          aria-label="delete"
          className={classes.margin}
        >
          <Link to={"/servers"}>
            <ArrowBackIcon fontSize="large" color="secondary" />
          </Link>
        </IconButton>
      </div>
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4" color="secondary" component="h2">
                      Server
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <form
                      action="/"
                      method="post"
                      className={classes.root}
                      onSubmit={handleSubmit}
                      // noValidate
                      autoComplete="true"
                    >
                      <Grid container className={classes.margin}>
                        <h3>Actualizar Server</h3>
                      </Grid>
                      <Grid container>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth variant="outlined">
                            <TextField
                              
                              className={classes.margin}
                              id="domain"
                              name="domain"
                              label="Dominio del Server"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              defaultValue={server.domain}
                              value={domain}
                              onInput={(e) => setDomain(e.target.value)}
                              // InputProps={{
                              //   startAdornment: (
                              //     <InputAdornment position="start">
                              //       <AccountCircle />
                              //     </InputAdornment>
                              //   ),
                              // }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth variant="outlined">
                            <TextField
                              
                              className={classes.margin}
                              id="ip"
                              name="ip"
                              label="IP del Server"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              defaultValue={server.ip}
                              value={ip}
                              onInput={(e) => setIp(e.target.value)}
                              // InputProps={{
                              //   startAdornment: (
                              //     <InputAdornment position="start">
                              //       <AccountCircle />
                              //     </InputAdornment>
                              //   ),
                              // }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl
                          fullWidth
                            variant="outlined"
                            className={classes.formControl}
                            
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              Estado
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={active}
                              onChange={(e) => setActive(e.target.value)}
                              label="Estado"
                              defaultValue={server.active}
                            >
                              {/* <MenuItem value="">
                              <em>None</em>
                            </MenuItem> */}
                              <MenuItem value={true}>Activo</MenuItem>
                              <MenuItem value={false}>Inactivo</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            className={classes.margin}
                            id="details"
                            name="details"
                            label="Detalles del Server"
                            variant="outlined"
                            color="secondary"
                            type="text"
                            defaultValue={server.details}
                            value={details}
                            multiline
                            rowsMax={4}
                            rows={4}
                            onInput={(e) => setDetails(e.target.value)}
                            // InputProps={{
                            //   startAdornment: (
                            //     <InputAdornment position="start">
                            //       <AccountCircle />
                            //     </InputAdornment>
                            //   ),
                            // }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} className={classes.flex}>
                        <Button
                          variant="contained"
                          type="submit"
                          color="secondary"
                        >
                          <SendIcon />
                          Actualizar
                        </Button>
                      </Grid>
                    </form>
                  </Grid>
                  <Divider />
                  {/* <ServerTable /> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Rotate>
    </>:""
  );
}
