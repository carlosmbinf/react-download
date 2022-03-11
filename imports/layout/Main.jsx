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
import CreatePrecios from "../ui/pages/precios/CreatePrecios";
import PreciosTable from "../ui/pages/precios/PreciosTable";
import VentasTable from "../ui/pages/ventas/VentasTable";
import Chats from "../ui/pages/chats/Chats";
import ChatDetails from "../ui/pages/chats/ChatDetails";
import Footer from "./Footer";
import InsertFiles from "../ui/pages/files/InsertFiles";
import InsertFilesTable from "../ui/pages/files/InsertFilesTable";
import FileDetails from "../ui/pages/files/FileDetails";
import CodeDetails from "../ui/pages/files/CodeDetails";
import UsersTableVPN from "../ui/pages/vpn/UsersTableVPN";

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
    height: "100%",
  },
}));

export default function Main() {
  const classes = useStyles();
  const useractual = useTracker(() => {
    return Meteor.user();
  });
  const user = (id) => {
    Meteor.subscribe("user", id,{fields:{
      'profile.role': 1
    }});
    return Meteor.users.findOne(id)
  }
  return (
    <>
      <div className={classes.toolbar} />

      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}

      <Switch>
        <Route path="/dashboard">

          <div style={{ paddingBottom: "7em" }}>
          {useractual &&
              useractual.username == "carlosmbinf" ? (
                <DashboardInit />
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
            
          </div>

          <Footer />
        </Route>
        <Route path="/downloads">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.profile &&
              useractual.profile.role == "admin" ? (
              <AddDescargas />
            ) : (
              ""
            )}
            <TableDescarga />
          </div>

          <Footer />
        </Route>
        <Route path="/users/:id">
          <div style={{ paddingBottom: "7em" }}>
            <UserCardDetails />
            {useractual &&
              useractual.profile &&
              useractual.profile.role == "admin" && (
                <Zoom in={true}>
                  <Grid
                    container
                    style={{ textAlign: "center", marginTop: 100 }}
                  >
                    <Grid item>
                      <RegisterDataUserTable type="proxy" />
                      <RegisterDataUserTable type="vpn" />
                      <LogsTable />
                      <RegisterConnectionsUser />
                    </Grid>
                  </Grid>
                </Zoom>
              )}

          </div>

          <Footer />
        </Route>
        <Route path="/users">
          <div style={{ paddingBottom: "7em" }}>
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
                    useractual.username == "carlosmbinf" ? <UsersTable /> : <UsersTable selector={{ $or: [{ "bloqueadoDesbloqueadoPor": Meteor.userId() }, { "bloqueadoDesbloqueadoPor": { $exists: false } }, { "bloqueadoDesbloqueadoPor": { $in: [""] } }] }} />
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
          </div>

          <Footer />
        </Route>
        <Route path="/calendar">
          <Footer />
        </Route>
        <Route path="/create-user">
          <div style={{ paddingBottom: "7em" }}>
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
          </div>

          <Footer />
        </Route>

        <Route path="/servers/:id">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.username == "carlosmbinf" ? (
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
          </div>


          <Footer />
        </Route>
        <Route path="/servers">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.username == "carlosmbinf" ? (
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
          </div>


          <Footer />
        </Route>

        <Route path="/precios/:id">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.username == "carlosmbinf" ? (
              <CreatePrecios />
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
          </div>

          <Footer />
        </Route>
        <Route path="/precios">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.username == "carlosmbinf" ? (
              <>
                <CreatePrecios />
                <PreciosTable />
              </>
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
          </div>

          <Footer />
        </Route>

        <Route path="/files/:id">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.username == "carlosmbinf" ? (
                <>
                  <FileDetails />
                </>
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
          </div>

          <Footer />
        </Route>
        <Route path="/files">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.username == "carlosmbinf" ? (
              <>
                <InsertFiles />
                <InsertFilesTable />
              </>
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
          </div>

          <Footer />
        </Route>
        <Route path="/vpn">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.profile&&
              useractual.profile.role == "admin" ? (
              <>
                  <UsersTableVPN selector={
                    Meteor.user().username == "carlosmbinf" ? 
                    { vpn: true } 
                    : { 
                        $or: [
                          {
                            bloqueadoDesbloqueadoPor: Meteor.userId()
                          },
                          {
                            _id: Meteor.userId()
                          }
                        ], vpn: true
                      }} />
              </>
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
          </div>

          <Footer />
        </Route>

        <Route path="/ventas/:id">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.username == "carlosmbinf" ? (
              <VentasTable />
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
          </div>

          <Footer />
        </Route>
        <Route path="/ventas">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.username == "carlosmbinf" ? (
              <>
                {/* <CreatePrecios /> */}
                <VentasTable />
              </>
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
          </div>

          <Footer />
        </Route>
        <Route path="/tv/:id">
          <div style={{ paddingBottom: "7em" }}>
            <TV />
          </div>

          <Footer />
        </Route>
        <Route path="/tv">
          <div style={{ paddingBottom: "7em" }}>
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
          </div>

          <Footer />
        </Route>
        <Route path="/create-tv">
          <div style={{ paddingBottom: "7em" }}>
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
          </div>

          <Footer />
        </Route>
        <Route path="/videos/:id">
          <div style={{ paddingBottom: "7em" }}>
            <Video />
          </div>

          <Footer />
        </Route>
        <Route path="/pelis/:id">
          <div style={{ paddingBottom: "7em" }}>
            <PelisDetails />
          </div>

          <Footer />
        </Route>
        <Route path="/pelis">
          <div style={{ paddingBottom: "7em" }}>
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
                {/* {useractual &&
                  useractual.profile &&
                  useractual.profile.role == "admin" ? (
                  <PelisCard clasificacion="All" />
                ) : (
                  ""
                )} */}
                <PelisCard clasificacion="All" />
                <PelisCard clasificacion="AVENTURA" />
                <PelisCard clasificacion="ACCION" />
                <PelisCard clasificacion="CIENCIA Y FICCION" />
                <PelisCard clasificacion="TERROR" />
              </Grid>
            </Grid>
          </div>

          <Footer />
        </Route>
        <Route path="/create-pelis">
          <div style={{ paddingBottom: "7em" }}>
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
          </div>

          <Footer />
        </Route>
        <Route path="/chat/:id">
          <ChatDetails />
        </Route>
        <Route path="/chat">
          <div style={{ paddingBottom: "7em" }}>
              <Zoom in={true}>
                <Chats />
              </Zoom>
          </div>
          <Footer />
        </Route>
        <Route path="/logs">
          <div style={{ paddingBottom: "7em" }}>
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
          </div>

          <Footer />
        </Route>
        <Route path="/register-data">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.profile &&
              useractual.profile.role == "admin" ? (
                <Zoom in={true}>
                  <>
                    <RegisterDataUserTable type="proxy" />
                    <RegisterDataUserTable type="vpn" />
                  </>
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
          </div>

          <Footer />
        </Route>
        <Route path="/connections">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.profile &&
              useractual.username == "carlosmbinf" ? (
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
          </div>

          <Footer />
        </Route>
        <Route path="/exportdata">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.username == "carlosmbinf" ? (
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
          </div>

          <Footer />
        </Route>

        <Route path="/">
          <div style={{ paddingBottom: "7em" }}>
            <PelisCard clasificacion="All" />
            <PelisCard clasificacion="AVENTURA" />
            <PelisCard clasificacion="ACCION" />
            <PelisCard clasificacion="CIENCIA Y FICCION" />
            <PelisCard clasificacion="TERROR" />
          </div>

          <Footer />
        </Route>
      </Switch>
    </>
  );
}
