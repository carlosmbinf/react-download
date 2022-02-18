import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper, Box, Grid, Icon, Divider, Zoom, IconButton, Switch, Chip, FormControl, TextField } from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { _ } from 'meteor/underscore'
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { PelisCollection } from "../collections/collections";
import VPlayer from 'react-vplayer';
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from '@material-ui/icons/Done';
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import SendIcon from '@material-ui/icons/Send';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    maxWidth: "100%",
    borderRadius: 20,
    padding: "2em",
  },
  primary: {
    // minWidth: 370,
    width: "100%",
    borderRadius: 20,
    padding: "2em",
    background:
      "linear-gradient(0deg, rgba(36,83,162,1) 15%, rgba(245,0,87,0) 100%)",
  },
  secundary: {
    // minWidth: 370,
    width: "100%",
    borderRadius: 20,
    padding: "2em",
    background:
      "linear-gradient(0deg, #3f4b5b 15%, rgba(245,0,87,0) 100%);",
  },
  boton: {
    borderRadius: 20,
    padding: 0,
  },
  rootADD: {
    minWidth: 275,
    maxWidth: 275,
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
  createUsers: {
    color: "#114c84",
  },
  link: {
    borderRadius: 20,
    textDecoration: "none",
    color: "#8b8b8b",
    fontSize: 16,
    fontWeight: "bold",
  },
  root2: {
    display: "flex",
    alignItems: "center",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  padding10: {
    margin: "13px 0",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  drawerItem: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 4),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  margin: {
    margin: theme.spacing(2),
  },
  paper: {
    display: 'flex',
    border: `1px solid ${theme.palette.divider}`,
    flexWrap: 'wrap',
  },
  w100:{
    width:"100%"
  }
}));
const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    // border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

export default function PeliDetails() {
  const history = useHistory();
  var [edit, setEdit] = React.useState(false)
  const [nombrePeli, setnombrePeli] = useState("");
  const [urlPeli, seturlPeli] = useState("");
  const [urlBackground, seturlBackground] = useState("");
  const [descripcion, setdescripcion] = useState("");
  const [tamano, settamano] = useState("");
  const [subtitulo, setsubtitulo] = useState("");

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const id = useParams().id
  
 // De forma similar a componentDidMount y componentDidUpdate
 useEffect(() => {
  // Actualiza el título del documento usando la API del navegador
  $.post("getsubtitle", { idPeli: id })
  .done(function (data) {
    console.log(data)
  })
  .fail(function (data) {
    console.log(data)
  })
});

  const peliDetails = useTracker(() => {
    Meteor.subscribe("peli", id);
    return PelisCollection.findOne({ _id: id });
  });

  const handleChange = (event) => {
    PelisCollection.update(peliDetails._id, { $set: { mostrar: !(peliDetails.mostrar == "true") } })
  };

  function eliminarPeli() {
    PelisCollection.remove({ _id: peliDetails._id });
    alert("Pelicula Eliminada");
    history.push("/pelis");
  }

  function addVistas() {
    PelisCollection.update(peliDetails._id, { $inc: { vistas: 1 } })
  }

  function handleEdit(event) {
    setEdit(!edit)
    setnombrePeli(peliDetails.nombrePeli)
    seturlPeli(peliDetails.urlPeli)
    seturlBackground(peliDetails.urlBackground)
    setdescripcion(peliDetails.descripcion)
    settamano(peliDetails.tamano)
    setsubtitulo(peliDetails.subtitulo)
  }
  const handleFormat = (event, newFormats) => {
    // setFormats(newFormats);
    PelisCollection.update(peliDetails._id, { $set: { clasificacion: newFormats } })
  };

  function handleSubmit(event) {
    event.preventDefault();
    let peli
    
     peli = {
      nombrePeli: nombrePeli,
      urlPeli: urlPeli,
      urlBackground: urlBackground,
      descripcion: descripcion,
      tamano: tamano,
      subtitulo:subtitulo,
    }
    PelisCollection.update(peliDetails._id, { $set: peli })

    // makePostRequest();
  }

  return (
    <>
      <div className={classes.drawerHeader}>
        <IconButton
          color="primary"
          aria-label="delete"
          className={classes.margin}
          onClick={() => { history.goBack() }}
        >
          <ArrowBackIcon fontSize="large" color="secondary" />
        </IconButton>
      </div>
      <div className={classes.drawerItem}>
      {peliDetails && <Zoom in={true} >
        {/* <Paper
          className={
            peliDetails.mostrar !== "false"
              ? classes.secundary
              : classes.primary
          }
        > */}
          {edit ?
            <Grid container
              direction="row"
              justify="center"
              alignItems="center" spacing={3}>

              <Grid item xs={12}>
                <Button onClick={handleEdit} variant="contained" color="primary">
                  Cancelar Edicion
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Grid container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={12}>
                  <form
                      // action="/hello"
                      // method="post"
                      // className={classes.root}
                      onSubmit={handleSubmit}
                      // noValidate
                      autoComplete="false"
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
                              id="nombrePeli"
                              name="nombrePeli"
                              label="Nombre de la Peli"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              value={nombrePeli}
                              onInput={(e) => setnombrePeli(e.target.value)}
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
                              id="urlPeli"
                              name="urlPeli"
                              label="URL de la Peli"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              value={urlPeli}
                              onInput={(e) => seturlPeli(e.target.value)}
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
                          <FormControl
                            required
                            className={classes.w100}
                            variant="outlined"
                          >
                            <TextField
                              required
                              className={classes.margin}
                              id="tamano"
                              name="tamano"
                              label="Tamaño"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              value={tamano}
                              onInput={(e) => settamano(e.target.value)}
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
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl
                            className={classes.w100}
                            variant="outlined"
                          >
                            <TextField
                              className={classes.margin}
                              id="subtitulo"
                              name="subtitulo"
                              label="Subtitulo"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              value={subtitulo}
                              onInput={(e) => setsubtitulo(e.target.value)}
                              InputProps={{
                                // startAdornment: (
                                //   // <InputAdornment position="start">
                                //   //   <AccountCircle />
                                //   // </InputAdornment>
                                // ),
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl required variant="outlined">
                            <TextField
                              required
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
              <Grid item xs={12}>
                <StyledToggleButtonGroup
                  size="small"
                  value={peliDetails.clasificacion}
                  onChange={handleFormat}
                  aria-label="text alignment"
                >
                  <ToggleButton value="ACCION" aria-label="bold">
                    accion
                  </ToggleButton>
                  <ToggleButton value="TERROR" aria-label="italic">
                    terror
                  </ToggleButton>
                  <ToggleButton value="CIENCIA Y FICCION" aria-label="underlined">
                    Ciencia y Ficcion
                  </ToggleButton>
                  <ToggleButton value="AVENTURA" aria-label="color">
                    Aventura
                  </ToggleButton>
                </StyledToggleButtonGroup>
              </Grid>

            </Grid>
            :
            <Grid container
              direction="row"
              justify="center"
              alignItems="center" spacing={3}>
              <Grid style={{ width: "100%" }}>
                {/* INSERTAR VIDEO */}
                <video onLoadedMetadata={addVistas} controls width="100%" style={{ width: "100%", maxHeight: "60vh" }} poster={peliDetails.urlBackground} preload="metadata">
                  <source src={peliDetails.urlPeli} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                  <track default kind="subtitles" label="Español" src={peliDetails.subtitulo} srcLang="es" />
                  {/* <track default kind="descriptions" label="Español" src="https://visuales.uclv.cu/Peliculas/Extranjeras/2020/2020_Ava/sinopsis.txt" srcLang="es"/> */}
                </video>
              </Grid>
              <Grid item xs={12}>
                <Divider className={classes.padding10} />
                <Grid container
                  direction="row-reverse"
                  justify="space-around"
                  alignItems="center">
                  {Meteor.user().profile.role && Meteor.user().profile.role == "admin" ? (
                    <IconButton color="secondary" onClick={eliminarPeli} aria-label="delete">
                      <DeleteIcon fontSize="large" />
                    </IconButton>
                  ) : (
                      <div />
                    )}
                  <Typography
                    variant="h5"
                    style={{ color: "#ffffff99",}}
                  >

                    {peliDetails.nombrePeli}
                  </Typography>
                  {Meteor.user().profile.role && Meteor.user().profile.role == "admin" ? (
                    <Switch
                      checked={peliDetails.mostrar == "true"}
                      onChange={handleChange}
                      name="Mostrar"
                      color="primary"
                    />
                  ) : (
                      <div />
                    )}

                </Grid>
              </Grid>
              <Divider variant="middle" />
              <Grid item xs={12} >
                <Grid container
                  direction="row"
                  justify="center"
                  alignItems="center">
                  <Grid item xs={12} sm={8}>
                    {peliDetails.clasificacion.map((clasi, index) =>
                      <Chip key={index} color="primary" style={{ margin: 5, color: "#ffffff99" }} label={clasi} />
                    )
                    }
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                      style={{
                        fontSize: 14,
                      }}
                    >

                      <Typography color="textPrimary">
                        <RemoveRedEyeIcon />{" "}
                        <strong>{peliDetails.vistas.toFixed()}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
              <Divider variant="middle" />
              <Grid item xs={12}>
                <Paper elevation={3} style={{ backgroundColor: "#3f4b5b", padding: 10 }}>
                  <Grid container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" style={{ color: "#ffffff99" }} gutterBottom>
                        {peliDetails.descripcion}
                      </Typography>
                    </Grid>

                  </Grid>

                </Paper>
              </Grid>
              {Meteor.user().profile.role && Meteor.user().profile.role == "admin" ? (
                <Grid item xs={12}>
                  <Button onClick={handleEdit} variant="contained" color="primary">Editar</Button>
                </Grid>
              ) : (
                  ""
                )}
            </Grid>

          }

        {/* </Paper> */}
      </Zoom>
      }

</div>
    </>
  );
}

