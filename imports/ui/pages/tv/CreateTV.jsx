import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  Paper,
  Box,
  Grid,
  Icon,
  IconButton,
  Zoom,
  Dialog,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import { Link, useParams } from "react-router-dom";
import Rotate from "react-reveal/Rotate";

//Collections
import { TVCollection } from "../collections/collections";

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

const useStyles = makeStyles((theme) => ({
  w100: {
    width: "100%",
  },
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

export default function CreateTV() {
  const [nombreTV, setnombreTV] = useState("");
  const [urlTV, seturlTV] = useState("");
  const [urlBackground, seturlBackground] = useState("");
  const [descripcion, setdescripcion] = useState("");
  const [tamano, settamano] = useState("");
  const [subtitulo, setsubtitulo] = useState("");
  const [mostrar, setmostrar] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [transition, setTransition] = React.useState(undefined);
  const [load, setLoad] = React.useState(false);

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

  function createArch() {
       
    idPeli = TVCollection.insert({
      nombreTV: nombreTV,
      urlTV: urlTV,
      urlBackground: urlBackground,
      descripcion: descripcion,
      mostrar: mostrar,
    });

    setMessage("Agregado Correctamente");
              handleClick(TransitionUp);
              setLoad(false);
              setOpen(true);

  }

  function handleSubmit(event) {
    event.preventDefault();
    // console.log( 'Email:', email, 'Password: ', password, 'firstName: ', firstName);

    // You should see email and password in console.
    // ..code to submit form to backend here...

    createArch();
    setnombreTV("");
    seturlTV("");
    seturlBackground("");
    setdescripcion("");
    setmostrar(false);
    // makePostRequest();
  }

  const handleChange = (event) => {
    setmostrar(event.target.checked);
  };

  const classes = useStyles();

  return (
    <>
      <div className={classes.drawerHeader}>
        <IconButton
          color="primary"
          aria-label="delete"
          className={classes.margin}
        >
          <Link to={"/tv"}>
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
                    <Typography variant="h4" color="primary" component="h2">
                      Agregar TV
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <form
                      // action="/hello"
                      method="post"
                      className={classes.root}
                      onSubmit={handleSubmit}
                      // noValidate
                      autoComplete="true"
                    >
                      <Grid container className={classes.margin}>
                        Datos de la Peli
                      </Grid>
                      <Grid container>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl required variant="outlined">
                            <TextField
                              required
                              className={classes.margin}
                              id="nombreTV"
                              name="nombreTV"
                              label="Nombre de la Peli"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              value={nombreTV}
                              onInput={(e) => setnombreTV(e.target.value)}
                              InputProps={
                                {
                                  // startAdornment: (
                                  //   // <InputAdornment position="start">
                                  //   //   <AccountCircle />
                                  //   // </InputAdornment>
                                  // ),
                                }
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl required variant="outlined">
                            <TextField
                              required
                              className={classes.margin}
                              id="urlTV"
                              name="urlTV"
                              label="URL de la Peli"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              value={urlTV}
                              onInput={(e) => seturlTV(e.target.value)}
                              InputProps={
                                {
                                  // startAdornment: (
                                  //   // <InputAdornment position="start">
                                  //   //   <AccountCircle />
                                  //   // </InputAdornment>
                                  // ),
                                }
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl required variant="outlined">
                            <TextField
                              className={classes.margin}
                              id="urlBackground"
                              name="URL de la Imagen"
                              label="urlBackground"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              value={urlBackground}
                              onInput={(e) => seturlBackground(e.target.value)}
                              InputProps={
                                {
                                  // startAdornment: (
                                  //   // <InputAdornment position="start">
                                  //   //   <AccountCircle />
                                  //   // </InputAdornment>
                                  // ),
                                }
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl required variant="outlined">
                            <TextField
                              className={classes.margin}
                              id="descripcion"
                              name="descripcion"
                              label="Descripcion"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              multiline
                              rows={4}
                              value={descripcion}
                              onInput={(e) => setdescripcion(e.target.value)}
                              InputProps={
                                {
                                  // startAdornment: (
                                  //   // <InputAdornment position="start">
                                  //   //   <AccountCircle />
                                  //   // </InputAdornment>
                                  // ),
                                }
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={mostrar}
                                onChange={handleChange}
                                name="checkedA"
                              />
                            }
                            label="mostrar"
                          />
                        </Grid>
                      </Grid>

                      <Grid item xs={12} className={classes.flex}>
                        <Button
                          variant="contained"
                          type="submit"
                          color="secondary"
                        >
                          <SendIcon />
                          Send
                        </Button>
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Rotate>
    </>
  );
}
