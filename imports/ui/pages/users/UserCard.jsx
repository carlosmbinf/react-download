import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper, Box, Grid, Icon, Divider, Zoom, Slide } from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import Fade from 'react-reveal/Fade';
import Carousel from "../../components/carousel/Carousel";
import {VentasCollection} from "../collections/collections";
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';

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
    padding: "15px",
    minWidth: 220,
    maxWidth: 220,
    maxHeight: 263,
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
    padding: "15px",
    minWidth: 220,
    maxWidth: 220,
    maxHeight: 263,
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
    margin: 15,
    borderRadius: 20,
    padding: 0,
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
    marginTop: "300px",
  },
}));

export default function UserCard(withAdd) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const users = useTracker(() => {
    Meteor.user().username=="carlosmbinf" &&  Meteor.subscribe("user",{"profile.role":"admin"});
    let usuarios = Meteor.user().username == "carlosmbinf" ? Meteor.users.find({ "profile.role": "admin" }, { fields: {} }).fetch() : Meteor.users.find(Meteor.userId(), { fields: {} }).fetch();
    return usuarios
  });
  const ventas = useTracker(() => {
    Meteor.subscribe("ventas")
    return VentasCollection.find({}).fetch()
  });

  const gastos = (id) => {
    let totalAPagar = 0;
    ventas.map(element => {
      element.adminId == id && !element.cobrado && (totalAPagar += element.precio)
    })
    return totalAPagar
  };

  const items = users.map((usersGeneral, i) => {
    
    return (
      <>
        <Link to={"/users/" + usersGeneral._id} className={classes.link}>
              <Button
              color="inherit"
              className={classes.boton}
            >
                <Paper
                  elevation={5}
                  className={
                    usersGeneral.profile.role !== "admin"
                      ? classes.secundary
                      : classes.primary
                  }
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <Grid container direction="row" justify="center">
                        <Avatar
                          className={classes.large}
                          alt={
                            usersGeneral &&
                            usersGeneral.profile &&
                            usersGeneral.profile.firstName
                              ? usersGeneral.profile.firstName
                              : usersGeneral.profile.name
                          }
                          src={
                            usersGeneral.services &&
                            usersGeneral.services.facebook &&
                            usersGeneral.services.facebook.picture.data.url
                              ? usersGeneral.services.facebook.picture.data.url
                              : "/"
                          }
                        />
                      </Grid>
                      <Grid container direction="row">
                        <Grid item xs={12}>
                          {/* <AccountCircleIcon /> */}
                          <br/>
                        <Typography color="textSecondary" noWrap>
                          <strong>
                            {usersGeneral.profile &&
                              usersGeneral.profile.firstName}{" "}
                            {usersGeneral.profile &&
                              usersGeneral.profile.lastName}
                          </strong>
                        </Typography>
                        </Grid>                        
                      </Grid>
                    </Grid>
                   
                    <Grid item xs={12}>
                      <Grid container direction="row">
                        <Grid item xs={12}>
                          <DataSaverOnIcon />
                        <Typography color="textSecondary" noWrap>
                          <strong>
                            {usersGeneral.megasGastadosinBytes ?
                              (usersGeneral.megasGastadosinBytes/1000000).toFixed(2) : 0} MB
                          </strong>
                        </Typography>
                        </Grid>                        
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      
                      <Divider  />
                      
                      <Grid container direction="row" justify="center">
                        <Typography
                          variant="h5"
                          // color={
                          //   usersGeneral.profile.role == "admin"
                          //     ? "secondary"
                          //     : "primary"
                          // }
                        >
                          {/* <PermContactCalendarRoundedIcon />{" "} */}
                          ${gastos(usersGeneral._id)}
                        </Typography>
                      </Grid>
                      <Divider  />
                    </Grid>
                  </Grid>
                </Paper>
                </Button>
              </Link>
        </>
    );
  });

  if (withAdd.withCreate == "true") {
    return (
      <Fade top
      >
        <Grid className={classes.root2}>
        <Link to={"/create-user"} className={classes.link}>
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
                            CREATE USUARIO
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
    );
  }
  return (
    <>
     <Fade left>
    <div style={{ width: "100%" }}>
        <Carousel items={items} />
      </div>
    </Fade>
    </>
  );
}
