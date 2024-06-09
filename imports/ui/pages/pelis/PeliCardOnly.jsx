import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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
  Divider,
  Zoom,
  Slide,
} from "@material-ui/core";

import Fade from "react-reveal/Fade";
import Carousel from "../../components/carousel/Carousel";

import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import { PelisCollection } from "../collections/collections";

//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
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
    maxWidth: 300,
    borderRadius: 20,
    padding: "2em",
  },
  primary: {
    width:"100%",
    minWidth: 220,
    // maxWidth: 220,
    // maxHeight: 263,
    minHeight: 263,
    borderRadius: 20,
    // padding: "2em",
    background:
      "linear-gradient(0deg, rgba(36,83,162,1) 15%, rgba(245,0,87,0) 100%)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  secundary: {
    width:"100%",
    minWidth: 220,
    // maxWidth: 220,
    // maxHeight: 263,
    minHeight: 263,
    borderRadius: 20,
    // padding: "2em",
    background:
      "linear-gradient(0deg, rgba(245,0,87,1) 15%, rgba(245,0,87,0) 100%)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  boton: {
    width: "220px",
    margin:15,
    borderRadius: 20,
    padding: 0,
    flex: "1 1 0px",
    // transition: "transform 500ms",
    transition: "width 1s",
    "&:hover, &:focus": {
      // transform: "scaleX(2)",
      // transform: "translateX(25%)",
      width: "400px",
      zIndex: 1000,
    },
  },
  rootADD: {
    minWidth: 220,
    maxWidth: 220,
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
  elementosBotom: {
    maxHeight: 76,
    minHeight: 76,
    width: "100%",
    borderRadius: 20,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0) 0%, #20262ecf 82%);",
  },
}));

export default function PeliCardOnly(options) {
  const [mostrarTriler, setMostrarTriler] = useState(false);
  const [triller, setTriller] = useState();
  
 
  const classes = useStyles();


  // Similar to componentDidMount and componentDidUpdate:
  // useEffect(async () => {
    
  //   // Update the document title using the browser API
  //   // console.log(options)
  

  // });
  // let mostrar = []
  // mostrar[peli._id] = false
  // const bull = <span className={classes.bullet}>•</span>;
  
  return <Link key={options.peliGeneral._id} to={"/pelis/" + options.peliGeneral._id} className={classes.link}>
          <Button color="inherit" className={classes.boton}
          onMouseEnter={async () => {
            // console.log("Probando - " + mostrarTriler[options.peliGeneral._id]);
            try {

              Meteor.call("getUrlTriller",options.peliGeneral._id,(error,result)=>{
                error && console.log(error.message)
                result && setTriller(result)
              })
            setMostrarTriler(true)
              

            } catch (error) {
              console.log(error)
            }
          }}
          onMouseLeave={() => {

            setMostrarTriler(false)
            // mostrarTriler[options.peliGeneral._id] = false
            // console.log("Probando - " + mostrarTriler[options.peliGeneral._id]);

          }}
          >
            <Paper
              elevation={5}
              className={
                options.peliGeneral.mostrar !== "true"
                  ? classes.primary
                  : classes.secundary
              }
              style={{
                backgroundImage: "url('" + options.peliGeneral.urlBackgroundHTTPS + "')",
              }}
            >
              <Grid >
              {mostrarTriler && triller ?
              <Grid className={classes.video} style={{ width: "100%", height:"100%", position: "absolute", bottom: 0, background: "black" }}>
                {/* INSERTAR VIDEO */}
                  <video autoPlay={true} width="100%" style={{ borderRadius: 20, width: "100%", height: "100%" }} poster={options.peliGeneral.urlBackgroundHTTPS} preload="metadata">
                    <source src={triller} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                    {/* <track default kind="subtitles" label="Español" src={`/getsubtitle?idPeli=${options.peliGeneral._id}`} srcLang="es" /> */}
                    {/* <track default kind="descriptions" label="Español" src="https://visuales.uclv.cu/Peliculas/Extranjeras/2020/2020_Ava/sinopsis.txt" srcLang="es"/> */}
                  </video>
               
                
              </Grid>
               :
               <Grid container >
                  {/* <Divider className={classes.padding10} /> */}
                  <Grid
                    item
                    style={{ position: "absolute", bottom: 0, width: "100%"}}
                  >
                    <Grid
                      container
                      className={classes.elementosBotom}
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item xs={10}>
                        <Typography
                          style={{
                            color: "white",
                            fontSize: 14,
                          }}
                        >
                          <strong>{options.peliGeneral.nombrePeli}</strong>
                        </Typography>
                        <Grid
                          container
                          direction="row"
                          justify="flex-end"
                          alignItems="center"
                          style={{
                            color: "white",
                            fontSize: 14,
                          }}
                        >
                          
                          <Typography>
                            <strong> {options.peliGeneral.year}</strong>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
               }
                
              </Grid>
            </Paper>
          </Button>
        </Link>
    

}
