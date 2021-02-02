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
import {
  ArchivoCollection,
} from "../collections/collections";

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
  w100:{
    width:"100%",
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

export default function CreateArchivo() {
  const [regEntrada, setRegEntrada] = useState("");
  const [regSalida, setRegSalida] = useState("");
  const [estante, setEstante] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [clasificado, setClasificado] = React.useState(false);
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
  async function makePostRequest() {
    setLoad(true);
    const user = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      role: role,
      creadoPor: Meteor.userId(),
      edad: CI,
    };

    var http = require("http");
    http.post = require("http-post");
    http.post("/hello", user, (opciones, res, body) => {
      if (!opciones.headers.error) {
        // console.log(`statusCode: ${res.statusCode}`);
        console.log("error " + JSON.stringify(opciones.headers));

        setMessage(opciones.headers.message);
        handleClick(TransitionUp);
        setLoad(false);
        setOpen(true);

        return;
      } else {
        console.log(opciones.headers);
        setMessage(opciones.headers.message);
        handleClick(TransitionUp);
        setLoad(false);
        setOpen(true);
        return;
      }
    });
  }

  async function createArch() {
    // Meteor.subscribe("archivo");
    ArchivoCollection.insert({
      regEntrada: regEntrada,
      regSalida: regSalida,
      estante: estante,
      comentarios: comentarios,
      clasificado: clasificado,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    // console.log( 'Email:', email, 'Password: ', password, 'firstName: ', firstName);

    // You should see email and password in console.
    // ..code to submit form to backend here...

    createArch();
    setRegEntrada("")
    setRegSalida("")
    setEstante("")
    setComentarios("")
    setClasificado(false)
    // makePostRequest();
  }

  const handleChange = (event) => {
    setClasificado(event.target.checked);
  };

  const classes = useStyles();

  const users = useTracker(() => {
    Meteor.subscribe("user");
    return Meteor.users.find({}, { fields: {} });
  });

  console.log(users);

  return (
    <>
      <div className={classes.drawerHeader}>
        <IconButton
          color="primary"
          aria-label="delete"
          className={classes.margin}
        >
          <Link to={"/users"}>
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
                      Agregar Archivos
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
                        Datos del Archivo
                      </Grid>
                      <Grid container>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl required variant="outlined">
                            <TextField
                              required
                              className={classes.margin}
                              id="RegEntrada"
                              name="RegEntrada"
                              label="RegEntrada"
                              variant="outlined"
                              color="secondary"
                              type="number"
                              value={regEntrada}
                              onInput={(e) => setRegEntrada(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircle />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl required variant="outlined">
                            <TextField
                              required
                              className={classes.margin}
                              id="RegSalida"
                              name="RegSalida"
                              label="RegSalida"
                              variant="outlined"
                              color="secondary"
                              type="number"
                              value={regSalida}
                              onInput={(e) => setRegSalida(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircle />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl required variant="outlined">
                            <TextField
                              required
                              className={classes.margin}
                              id="Estante"
                              name="Estante"
                              label="Estante"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              value={estante}
                              onInput={(e) => setEstante(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircle />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12}>
                          <FormControl required className={classes.w100} variant="outlined">
                            <TextField
                              required
                              className={classes.margin}
                              id="email"
                              name="email"
                              label="Comentarios"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              multiline
                              rows={4}
                              value={comentarios}
                              onInput={(e) => setComentarios(e.target.value)}
                              // InputProps={{
                              //   startAdornment: (
                              //     // <InputAdornment position="start">
                              //     //   <AccountCircle />
                              //     // </InputAdornment>
                              //   ),
                              // }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={clasificado}
                                onChange={handleChange}
                                name="checkedA"
                              />
                            }
                            label="Clasificado"
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
