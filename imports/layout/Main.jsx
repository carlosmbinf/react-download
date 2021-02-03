import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useTracker } from "meteor/react-meteor-data";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import "bootstrap"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

import UserCard from "../ui/pages/users/UserCard";
import UserCardDetails from "../ui/pages/users/UserCardDetails";
import CreateUsers from "../ui/pages/users/CreateUsers";
import GuestCard from "../ui/pages/guest/GuestCard";
import LoginPage from "../ui/pages/login/index";
import DashboardInit from "../ui/pages/dashboard/DashboardInit";
import Archivo from "../ui/pages/archivo/Archivo";
import CreateArchivo from "../ui/pages/archivo/CreateArchivo";
import Download from "../ui/pages/download/Download";
import { Grid, Zoom } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  // necessary for content to be below app bar
  root: {
    display: "flex",
    flexWrap: "nowrap",
    "& > *": {
      margin: theme.spacing(5),
      width: 330,
      height: 323,
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    overflowX: "auto",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    marginLeft: 0,
  },
}));

export default function Main() {
  const classes = useStyles();
  const useractual = useTracker(() => {
    return Meteor.user();
  });
  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />

      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}

      <Switch>
        <Route path="/dashboard">
          <DashboardInit />
        </Route>
        <Route path="/downloads">
          <Download />
        </Route>
        <Route path="/offer"></Route>
        <Route path="/guest">
          <div className={classes.root}>
            <GuestCard withCreate="true" />
            <GuestCard />
          </div>
        </Route>
        <Route path="/users/:id">
          <UserCardDetails />
        </Route>
        <Route path="/users">
          <div className={classes.root}>
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <UserCard withCreate="true" />
          ) : (
            ""
          )}
           
            <UserCard />
          </div>
        </Route>

        <Route path="/calendar"></Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/create-user">
        {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <CreateUsers />
          ) : (
            <Zoom in={true}>
              <Grid container
           direction="row"
           justify="center"
           alignItems="center">
            <h1>SIN ACCESO</h1>
           </Grid>
              
            </Zoom>
           
            
          )}
          
        </Route>
        <Route path="/archivo">
        {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <CreateArchivo />
          ) : (
            <Zoom in={true}>
              <Grid container
           direction="row"
           justify="center"
           alignItems="center">
            <h1>SIN ACCESO PARA CREAR</h1>
           </Grid>
              
            </Zoom>
           
            
          )}
          <Archivo />
        </Route>
        <Route path="/create-archivo">
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <CreateArchivo />
          ) : (
            <Zoom in={true}>
              <Grid container
           direction="row"
           justify="center"
           alignItems="center">
            <h1>SIN ACCESO</h1>
           </Grid>
              
            </Zoom>
           
            
          )}
        </Route>
        <Route path="/"></Route>
      </Switch>
    </main>
  );
}
