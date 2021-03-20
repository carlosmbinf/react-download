import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper, Box, Grid, Icon, Divider, Zoom, IconButton, Switch } from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { DescargasCollection } from "../collections/collections";
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import VPlayer from 'react-vplayer';
import DeleteIcon from "@material-ui/icons/Delete";

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
    minWidth: 370,
    width: "100%",
    borderRadius: 20,
    padding: "2em",
    background:
      "linear-gradient(0deg, rgba(36,83,162,1) 15%, rgba(245,0,87,0) 100%)",
  },
  secundary: {
    minWidth: 370,
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
  paper:{
    padding: theme.spacing(3, 3),
  }
}));

export default function Video() {
  const history = useHistory();
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const videoDetails = useTracker(() => {
    Meteor.subscribe("descarga", useParams().id);
    return DescargasCollection.findOne({ _id: useParams().id });
  });

  function addVistas() {
    DescargasCollection.update(videoDetails._id, { $inc: {vistas: 1 }})
  };

  function eliminarVideo() {
    const data = {id:useParams().id}

    $.post("/eliminar", data)
        .done(function (data) {
          alert("Video Eliminado");
        })
        .fail(function (data) {
          console.log("ERRORS " + data);
        });
    history.push("/");
  }
  // const handleChange = (event) => {
  //   TVCollection.update(videoDetails._id, { $set: { mostrar: !(videoDetails.mostrar == "true") } })
  // };
  
  return (
    <>
      <div className={classes.drawerHeader}>
        
          <IconButton
            color="primary"
            aria-label="delete"
            className={classes.margin}
            onClick={()=>{history.goBack()}}
          >

            <ArrowBackIcon fontSize="large" color="secondary" />

          </IconButton>
        
      </div>
      <div className={classes.drawerItem}>
      {videoDetails && <Zoom in={true} >
        {/* <Paper
          elevation={5}
          className={
            videoDetails.mostrar !== "true"
              ? classes.primary
              : classes.secundary
          }
        > */}
          <Grid container
            direction="row"
            justify="center"
            alignItems="center" spacing={1}>
            <Grid style={{ width: "100%" }}>
              {/* INSERTAR VIDEO */}
              <video onLoad={addVistas} controls width="100%" style={{ width: "100%", maxHeight: "60vh" }} preload="metadata">
                  <source src={videoDetails.urlReal} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                  {/* <track default kind="subtitles" label="Español" src={peliDetails.subtitulo} srcLang="es" /> */}
                  {/* <track default kind="descriptions" label="Español" src="https://visuales.uclv.cu/Peliculas/Extranjeras/2020/2020_Ava/sinopsis.txt" srcLang="es"/> */}
                </video>
            </Grid>

            <Grid item xs={12}>
              {/* <Divider className={classes.padding10} /> */}
              <Grid container
                direction="row-reverse"
                justify="space-around"
                alignItems="center">
                {Meteor.user().profile.role && Meteor.user().profile.role == "admin" ? (
                  <Grid item>
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
                        <RemoveRedEyeIcon
                        />
                        {" "}
                        <strong>{videoDetails.vistas.toFixed()}</strong>
                      </Typography>
                      <IconButton color="secondary" onClick={eliminarVideo} aria-label="delete">
                        <DeleteIcon fontSize="large" />
                      </IconButton>
                    </Grid>
                  </Grid>
                  
                  
                ) : (
                  <div />
                )}
                <Grid item xs={10}>
                  <Typography
                  color="textSecondary"
                  noWrap
                >

                  {videoDetails.nombreFile}
                </Typography>
                </Grid>
                
                <div />
              </Grid>
              {videoDetails.comentarios &&
                <Grid container
                  direction="row"
                  justify="center"
                  alignItems="center">
                  <Grid item xs={12}>
                    <Paper
                      elevation={5}
                      className={classes.paper}>
                      <Typography
                        color="textSecondary"
                      >
                        {videoDetails.comentarios}
                      </Typography>
                    </Paper>
                  </Grid>

                </Grid>
              }

            </Grid>


          </Grid>
        {/* </Paper> */}
      </Zoom>
      }

</div>
    </>
  );
}

