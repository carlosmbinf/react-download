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
import { CapitulosCollection } from "../collections/collections";
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

export default function SeriesDetails() {
  const history = useHistory();
  var [edit, setEdit] = React.useState(false)
  const [nombre, setnombre] = useState("");
  const [url, seturl] = useState("");
  const [urlBackground, seturlBackground] = useState("");
  const [descripcion, setdescripcion] = useState("");
  const [tamano, settamano] = useState("");
  const [subtitulo, setsubtitulo] = useState("");
  const [temporada, settemporada] = useState("");
  const [capitulo, setcapitulo] = useState("");

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const id = useParams().id
  
  const seriesDetails = useTracker(() => {
    Meteor.subscribe("series", id);
    return CapitulosCollection.findOne({ _id: id });
  });

  const handleChange = (event) => {
    CapitulosCollection.update(seriesDetails._id, { $set: { mostrar: !(seriesDetails.mostrar == "true") } })
  };

  function eliminarPeli() {
    Meteor.call("removeSerie", seriesDetails._id, (err, res) => {	
      if (err) {
        alert("Error al eliminar la Serie")
        console.log(err);
      } else {
        alert("Serie Eliminada");
        history.push("/series");
      }
    });
    // CapitulosCollection.remove({ _id: seriesDetails._id });
    // alert("Serie Eliminada");
    // history.push("/series");
  }

  function addVistas() {
    Meteor.call("addVistas", seriesDetails._id, (err, res) => {
      if (err) {
        alert("Error al actualizar las vistas")
        console.log(err);
      } else {
        console.log("Vistas Actualizadas");
      }
    });
    // CapitulosCollection.update(seriesDetails._id, { $inc: { vistas: 1 } })
  }

  function handleEdit(event) {
    setEdit(!edit)
    setnombre(seriesDetails.nombre)
    seturl(seriesDetails.url)
    seturlBackground(seriesDetails.urlBackground)
    setdescripcion(seriesDetails.descripcion)
    settamano(seriesDetails.tamano)
    setsubtitulo(seriesDetails.subtitulo)
    setcapitulo(seriesDetails.capitulo)
    settemporada(seriesDetails.temporada)
  }
  const handleFormat = (event, newFormats) => {
    // setFormats(newFormats);
    CapitulosCollection.update(seriesDetails._id, { $set: { clasificacion: newFormats } })
  };

  function handleSubmit(event) {
    event.preventDefault();
    let peli
    
     peli = {
      nombre: nombre,
      url: url,
      urlBackground: urlBackground,
      descripcion: descripcion,
      tamano: tamano,
      subtitulo:subtitulo,
      temporada: temporada,
      capitulo: capitulo,
    }
    CapitulosCollection.update(seriesDetails._id, { $set: peli })

    seriesDetails._id && subtitulo != "" &&
    $.post("/seriesconvertsrttovtt", { idSeries: seriesDetails._id })
    .done(function (data) {
      alert(`Actualizado el subtitulo de la Serie -> ${nombre}`)
      console.log(data)
    })
    .fail(function (data) {
      alert(`Ocurrio un Error inesperado`)
      console.log(data)
    })

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
      {seriesDetails && <Zoom in={true} >
        {/* <Paper
          className={
            seriesDetails.mostrar !== "false"
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
                        Datos de la Serie
                      </Grid>
                      <Grid container>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl required variant="outlined">
                            <TextField
                              required
                              className={classes.margin}
                              id="nombre"
                              name="nombre"
                              label="Nombre de la Serie"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              value={nombre}
                              onInput={(e) => setnombre(e.target.value)}
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
                              id="url"
                              name="url"
                              label="URL de la Serie"
                              variant="outlined"
                              color="secondary"
                              type="text"
                              value={url}
                              onInput={(e) => seturl(e.target.value)}
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
                  value={seriesDetails.clasificacion}
                  onChange={handleFormat}
                  aria-label="text alignment"
                >
                  <ToggleButton value="Sci-Fi" aria-label="bold">
                  Sci-Fi
                  </ToggleButton>
                  <ToggleButton value="Action" aria-label="italic">
                  Action
                  </ToggleButton>
                  <ToggleButton value="Adventure" aria-label="underlined">
                  Adventure
                  </ToggleButton>
                  <ToggleButton value="Thriller" aria-label="color">
                  Thriller
                  </ToggleButton>
                  <ToggleButton value="Crime" aria-label="bold">
                  Crime
                  </ToggleButton>
                                  
                </StyledToggleButtonGroup>
                <br/>
                <StyledToggleButtonGroup
                  size="small"
                  value={seriesDetails.clasificacion}
                  onChange={handleFormat}
                  aria-label="text alignment"
                >
                 
                  <ToggleButton value="Mystery" aria-label="italic">
                  Mystery
                  </ToggleButton>
                  <ToggleButton value="Horror" aria-label="underlined">
                  Horror
                  </ToggleButton>
                  <ToggleButton value="Comedy" aria-label="color">
                  Comedy
                  </ToggleButton>
                  <ToggleButton value="Drama" aria-label="bold">
                  Drama
                  </ToggleButton>
                  <ToggleButton value="Romance" aria-label="italic">
                  Romance
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
                {seriesDetails.url &&
                  <video onLoadedMetadata={addVistas} controls width="100%" style={{ width: "100%", maxHeight: "60vh" }} poster={seriesDetails.urlBackgroundHTTPS} preload="metadata">
                    <source src={seriesDetails.urlHTTPS} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                    <track default kind="subtitles" label="Español" src={`/getsubtitle?idPeli=${seriesDetails._id}`} srcLang="es" />
                    {/* <track default kind="descriptions" label="Español" src="https://visuales.uclv.cu/Peliculas/Extranjeras/2020/2020_Ava/sinopsis.txt" srcLang="es"/> */}
                  </video>
                }
                
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

                    {seriesDetails.nombre}
                  </Typography>
                  {Meteor.user().profile.role && Meteor.user().profile.role == "admin" ? (
                    <Switch
                      checked={seriesDetails.mostrar == "true"}
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
                    {seriesDetails.clasificacion.map((clasi, index) =>
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
                        <strong>{seriesDetails.vistas.toFixed()}</strong>
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
                        {seriesDetails.descripcion}
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
