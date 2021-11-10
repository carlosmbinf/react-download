import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper, Box, Grid, Icon, IconButton, Zoom, Dialog, CircularProgress } from "@material-ui/core";
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
import { PreciosCollection } from "../collections/collections";

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

export default function CreatePrecios() {
  // const [createdAt, setcreatedAt] = useState("");
  const [precio, setprecio] = useState(0);
  const [fecha, setfecha] = useState(false);
  const [megas, setmegas] = useState(0);
  const [comentario, setcomentario] = useState("");
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
  function handleSubmit(event) {
    event.preventDefault();
    // console.log( 'Email:', email, 'Password: ', password, 'firstName: ', firstName);

    // You should see email and password in console.
    // ..code to submit form to backend here...

    async function makePostRequest() {
      setLoad(true);
      const datosPrecios = {
        userId: Meteor.userId(),
        precio,
        fecha,
        megas: fecha ? null : megas,
        comentario,
      };
      try {
        let id = await PreciosCollection.insert(datosPrecios)
        id && (
          setMessage(`Precio ${datosPrecios.precio} CUP Creado`),
          handleClick(TransitionUp),
          setLoad(false),
          setOpen(true))
      } catch (error) {
        setMessage("Ocurrió un Error");
        handleClick(TransitionUp);
        setLoad(false);
        setOpen(true);
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

  const handleChange = (event) => {
    setfecha(event.target.value);
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
                    <Typography variant="h4" color="secondary" component="h2">
                      Agregar Precios
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <form
                      action="/hello"
                      method="post"
                      className={classes.root}
                      onSubmit={handleSubmit}
                      // noValidate
                      autoComplete="true"
                    >
                      <Grid container className={classes.margin}>
                        Datos:
                      </Grid>
                      <Grid container>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl required variant="outlined">
                            <TextField
                              required
                              className={classes.margin}
                              id="precio"
                              name="Precio"
                              label="Precio"
                              variant="outlined"
                              color="secondary"
                              type="number"
                              value={precio}
                              onInput={(e) => setprecio(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    $
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl
                            variant="outlined"
                            className={classes.formControl}
                            required
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              Fecha
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={fecha}
                              onChange={handleChange}
                              label="Por Fecha"
                              defaultValue={false}
                            >
                              {/* <MenuItem value="">
                              <em>None</em>
                            </MenuItem> */}
                              <MenuItem value={true}>Activo</MenuItem>
                              <MenuItem value={false}>Inactivo</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        {fecha ||
                          <Grid item xs={12} sm={4} lg={3}>
                            <FormControl required={fecha?false:true} variant="outlined">
                              <TextField
                                required={fecha?false:true}
                                className={classes.margin}
                                id="megas"
                                name="megas"
                                label="Megas"
                                variant="outlined"
                                color="secondary"
                                type="number"
                                value={megas}
                                onInput={(e) => setmegas(e.target.value)}
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
                        }
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl variant="outlined">
                            <TextField                              
                              className={classes.margin}
                              id="comentario"
                              name="comentario"
                              label="Comentario"
                              variant="outlined"
                              color="secondary"
                              value={comentario}
                              onInput={(e) => setcomentario(e.target.value)}
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
