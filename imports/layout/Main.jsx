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
import UsersTable from "../ui/pages/users/UsersTable";
import UserCardDetails from "../ui/pages/users/UserCardDetails";
import PelisCard from "../ui/pages/pelis/PeliCard";
import PelisDetails from "../ui/pages/pelis/PeliDetails";
import CreateUsers from "../ui/pages/users/CreateUsers";
import GuestCard from "../ui/pages/guest/GuestCard";
import LoginPage from "../ui/pages/login/index";
import DashboardInit from "../ui/pages/dashboard/DashboardInit";
import Archivo from "../ui/pages/pelis/Archivo";
import CreateArchivo from "../ui/pages/pelis/CreatePeli";
import AddDescargas from "../ui/pages/download/AddDescargas";
import TableDescarga from "../ui/pages/download/TableDescarga";
import { Grid, Zoom } from "@material-ui/core";
import CreateTV from "../ui/pages/tv/CreateTV";
import TVonline from "../ui/pages/tv/TVCard";
import TV from "../ui/pages/tv/TVDetails";
import Video from "../ui/pages/videos/VideoDetails";
import LogsTable from "../ui/pages/logs/LogsTable";
import RegisterDataUserTable from "../ui/pages/registerDataUser/RegisterDataUser";
import RegisterConnectionsUser from "../ui/pages/registerConnectionsUser/RegisterConnectionsUser";
import ExportDataToMongoDB from "../ui/pages/exportData/exportDataToMongoDB";
import CreateServers from "../ui/pages/servers/CreateServers";
import ServersDetails from "../ui/pages/servers/ServersDetails";

const useStyles = makeStyles((theme) => ({
  // necessary for content to be below app bar
  root: {
    display: "flex",
    flexWrap: "nowrap",
    "& > *": {
      margin: theme.spacing(5),
      // width: 330,
      // height: 323,
    },
  },
  toolbar: theme.mixins.toolbar,
  contents: {
    overflowX: "auto",
    flexGrow: 1,
    padding: 5,
    marginLeft: 0,
    height:"100%",
  },
}));

export default function Main() {
  const classes = useStyles();
  const useractual = useTracker(() => {
    return Meteor.user();
  });
  return (
    <>
      <div className={classes.toolbar} />

      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}

      <Switch>
        <Route path="/dashboard">
          <DashboardInit />
        </Route>
        <Route path="/downloads">
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <AddDescargas />
          ) : (
            ""
          )}
          <TableDescarga />
        </Route>
        <Route path="/users/:id">
          <UserCardDetails />
          <Zoom in={true}>
            <>
              <Grid container style={{ textAlign: "center", marginTop: 100 }}>
                <Grid item>
                  <RegisterDataUserTable/>
                </Grid>
              </Grid>
              {useractual &&
                useractual.profile &&
                useractual.profile.role == "admin" && (
                  <Grid
                    container
                    style={{ textAlign: "center", marginTop: 100 }}
                  >
                    <Grid item>
                      <LogsTable/>
                      <RegisterConnectionsUser/>
                    </Grid>
                  </Grid>
                )}
            </>
          </Zoom>
        </Route>
        <Route path="/users">
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} className={classes.root}>
                <UserCard withCreate="true" />
              </Grid>
              <Grid item xs={12}>
              <UserCard />
                {useractual &&
                useractual.profile &&
                useractual.profile.role == "admin" ? (
                    useractual.username == "carlosmbinf" ? <UsersTable /> : <UsersTable selector={{"bloqueadoDesbloqueadoPor": Meteor.userId()}}/>
                  ) : (
                    <Zoom in={true}>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <h1>SIN ACCESO</h1>
                    </Grid>
                  </Zoom>
                )}
                
              </Grid>
            </Grid>
          ) : (
            <Zoom in={true}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h1>SIN ACCESO</h1>
              </Grid>
            </Zoom>
          )}
        </Route>
        <Route path="/calendar"></Route>
        <Route path="/create-user">
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <CreateUsers />
          ) : (
            <Zoom in={true}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h1>SIN ACCESO</h1>
              </Grid>
            </Zoom>
          )}
        </Route>
        
        <Route path="/servers/:id">
          {useractual &&
          useractual.username  == "carlosmbinf" ? (
            <ServersDetails />
          ) : (
            <Zoom in={true}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h1>SIN ACCESO</h1>
              </Grid>
            </Zoom>
          )}
        </Route>
        <Route path="/servers">
          {useractual &&
          useractual.username  == "carlosmbinf" ? (
            <CreateServers />
          ) : (
            <Zoom in={true}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h1>SIN ACCESO</h1>
              </Grid>
            </Zoom>
          )}
        </Route>
        <Route path="/tv/:id">
          <TV />
        </Route>
        <Route path="/tv">
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12} className={classes.root}>
              {useractual &&
              useractual.profile &&
              useractual.profile.role == "admin" ? (
                <TVonline withCreate="true" />
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={12}>
              {useractual &&
              useractual.profile &&
              useractual.profile.role == "admin" ? (
                <TVonline admin />
              ) : (
                <TVonline />
              )}
            </Grid>
          </Grid>
        </Route>
        <Route path="/create-tv">
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <CreateTV />
          ) : (
            <Zoom in={true}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h1>SIN ACCESO</h1>
              </Grid>
            </Zoom>
          )}
        </Route>
        <Route path="/videos/:id">
          <Video />
        </Route>
        <Route path="/pelis/:id">
          <PelisDetails />
        </Route>
        <Route path="/pelis">
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12} className={classes.root}>
              {useractual &&
              useractual.profile &&
              useractual.profile.role == "admin" ? (
                <PelisCard withCreate="true" />
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={12}>
              {useractual &&
              useractual.profile &&
              useractual.profile.role == "admin" ? (
                <PelisCard clasificacion="All" />
              ) : (
                ""
              )}
              <PelisCard clasificacion="AVENTURA" />
              <PelisCard clasificacion="ACCION" />
              <PelisCard clasificacion="CIENCIA Y FICCION" />
              <PelisCard clasificacion="TERROR" />
            </Grid>
          </Grid>
        </Route>
        <Route path="/create-pelis">
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <CreateArchivo />
          ) : (
            <Zoom in={true}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h1>SIN ACCESO</h1>
              </Grid>
            </Zoom>
          )}
        </Route>
        <Route path="/logs">
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <Zoom in={true}>
              <LogsTable />
            </Zoom>
          ) : (
            <Zoom in={true}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h1>SIN ACCESO</h1>
              </Grid>
            </Zoom>
          )}
        </Route>
        <Route path="/register-data">
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <Zoom in={true}>
              <RegisterDataUserTable />
            </Zoom>
          ) : (
            <Zoom in={true}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h1>SIN ACCESO</h1>
              </Grid>
            </Zoom>
          )}
        </Route>
        <Route path="/connections">
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            <Zoom in={true}>
              <RegisterConnectionsUser />
            </Zoom>
          ) : (
            <Zoom in={true}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h1>SIN ACCESO</h1>
              </Grid>
            </Zoom>
          )}
        </Route>
        <Route path="/exportdata">
          {useractual &&
          useractual.profile &&
          useractual.profile.role == "admin" ? (
            // <Zoom in={true}>
              <ExportDataToMongoDB />
            // </Zoom>
          ) : (
            <Zoom in={true}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h1>SIN ACCESO</h1>
              </Grid>
            </Zoom>
          )}
        </Route>
        
        <Route path="/">
          <PelisCard clasificacion="AVENTURA" />
          <PelisCard clasificacion="ACCION" />
          <PelisCard clasificacion="CIENCIA Y FICCION" />
          <PelisCard clasificacion="TERROR" />
        </Route>
      </Switch>
    </>
  );
}
