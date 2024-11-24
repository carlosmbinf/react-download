import React, { useState } from "react";
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
import PeliCardOnly from "./PeliCardOnly";
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

export default function PeliCard(options) {
  // const [mostrarTriler, setMostrarTriler] = useState([]);

  const peli = useTracker(() => {
    Meteor.subscribe("pelis", { mostrar: "true", extension: { $in: ["mkv","mp4"] }  }, {
      fields: {
        _id: 1,
        clasificacion: 1,
        vistas: 1,
        mostrar: 1,
        urlBackground: 1,
        nombrePeli: 1,
        urlBackgroundHTTPS:1,
        // urlPeli: 1,
        // urlTrailer: 1,
        // idimdb:1
        year:1,
        extension:1
      }
    });
    if (options.clasificacion == "All") {
      return PelisCollection.find({ mostrar: "true",extension: { $in: ["mkv","mp4"] } }).fetch();
    } else {
      return PelisCollection.find({ mostrar: "true", clasificacion: options.clasificacion, extension: { $in: ["mkv","mp4"] } }, {
        fields: {
          _id: 1,
          clasificacion: 1,
          vistas: 1,
          mostrar: 1,
          urlBackground: 1,
          nombrePeli: 1,
          urlBackgroundHTTPS:1,
          // urlPeli: 1,
          // urlTrailer: 1,
          // idimdb:1
          year: 1,
          extension:1
        }, sort: { vistas: -1,nombrePeli: 1 }
      }).fetch();
    }
  });

  const classes = useStyles();

  const items = useTracker(() => {
   
    let a = peli.map( (peliGeneral) => {
              return   <PeliCardOnly peliGeneral={peliGeneral} />
            })
   return a
});


  if (options.withCreate == "true") {
    return (
    <>
      <Fade top >
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.root2}
        >
          <Link to={"/create-pelis"} className={classes.link}>
            <Button color="inherit" className={classes.boton}>
              <Paper elevation={5} className={classes.rootADD}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="column"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item>
                          <Typography fontSize="large" color="secondary">
                            <AddCircleRoundedIcon />
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography color="secondary">
                            AGREGAR PELÍCULA
                          </Typography>
                        </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Button>
          </Link>
        </Grid>
      </Fade>
      </>
    );
  }
  return peli.length > 0 ? <Fade left>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            style={{padding:60,paddingBottom:0,paddingRight:0}}
          >
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom style={{color:"white"}}>
                {options.clasificacion}
              </Typography>

            </Grid>
          </Grid>
          {/* <div style={{ width: "100%" }}> */}
            <Carousel items={items} />
          {/* </div> */}
        </Fade>
        : ""
}
