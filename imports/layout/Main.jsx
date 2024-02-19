import React from "react";
import { Meteor } from "meteor/meteor";
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
import CompraCard from "../ui/pages/compras/CompraCard";
import { Chip, Grid, Zoom } from "@material-ui/core";
import CreateTV from "../ui/pages/tv/CreateTV";
import TVonline from "../ui/pages/tv/TVCard";
import TV from "../ui/pages/tv/TVDetails";
import Video from "../ui/pages/videos/VideoDetails";
import LogsTable from "../ui/pages/logs/LogsTable";
import PelisTable from "../ui/pages/pelis/PelisTable";
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
import Execute from "../ui/pages/execute/execute";
import GraphicsLinealConsumoMegasXMeses from "../ui/pages/dashboard/GraphicsLinealConsumoMegasXMeses";
import StateUsers from "../ui/pages/users/StateUsers";
import VentasTableSinCompra from "../ui/pages/compras/VentasTableSinCompra";

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
  
  return (
    <>
      <div className={classes.toolbar} />

      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}

      <Switch>
        <Route path="/dashboard">

          <div style={{ paddingBottom: "7em" }}>
          {useractual &&
              Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? (
                <>
                  <Grid container item xs={12} justify="space-evenly" alignItems="center" style={{ paddingTop: 50 }}>
                    <Chip style={{ width: "90%" }} color='primary' label="Consumo de Datos en VidKar:" />
                    <div style={{ width: "100%", height: 300 }}>
                      <GraphicsLinealConsumoMegasXMeses />
                    </div>
                  </Grid>
                  <Divider variant="middle" />
                  <DashboardInit />
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
        <Route path="/compras/:id">
          <div style={{ paddingBottom: "7em" }}>
            {/* {Meteor.settings.public.mostrarCompras == true && */}
            <CompraCard type="megas"/>
            {/* <CompraCard type="fecha-proxy"/> */}
            <CompraCard type="vpnplus"/>
            {/* <CompraCard type="fecha-vpn"/> */}
            <VentasTableSinCompra/>
             {/* } */}
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
                      {/* <RegisterDataUserTable type="proxy" />
                      <RegisterDataUserTable type="vpn" /> */}
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
                  <Grid item xs={12}>
                    {Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username) &&
                      <StateUsers />
                    }
                  </Grid>
                
                <Grid item xs={12} className={classes.root}>
                  <UserCard withCreate="true" />
                </Grid>
                <Grid item xs={12}>
                  <UserCard />
                  {useractual &&
                    useractual.profile &&
                    useractual.profile.role == "admin" ? (
                    Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? <UsersTable /> : <UsersTable selector={{ $or: [{ "bloqueadoDesbloqueadoPor": Meteor.userId() }, { "bloqueadoDesbloqueadoPor": { $exists: false } }, { "bloqueadoDesbloqueadoPor": { $in: [""] } }] }} />
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
              Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? (
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
              Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? (
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
              Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? (
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
            {useractual.profile.role == "admin" ? (
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
              Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? (
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
              Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? (
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
                    Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username) ? 
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
              Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? (
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
             useractual.profile.role == "admin" ? (
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
              <Grid item xs={12} >
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
          <div style={{ paddingBottom: "7em" }} justify="center" alignItems="center">
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
              <Grid item xs={12}>
                {useractual &&
                  useractual.profile &&
                  useractual.profile.role == "admin" ? (
                    <>
                      <PelisCard withCreate="true" />
                      <PelisTable />
                    </>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={12}>
                {/*<PelisCard clasificacion="All" />*/}
                <PelisCard clasificacion="Sci-Fi" />
                <PelisCard clasificacion="Action" />
                <PelisCard clasificacion="Adventure" />
                <PelisCard clasificacion="Thriller" />
                <PelisCard clasificacion="Crime" />
                <PelisCard clasificacion="Mystery" />
                <PelisCard clasificacion="Horror" />
                <PelisCard clasificacion="Comedy" />
                <PelisCard clasificacion="Drama" />
                <PelisCard clasificacion="Romance" />
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
              Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? (
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
              Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? (
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
        <Route path="/execute">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              Array(Meteor.settings.public.administradores)[0].includes(useractual.username) ? (
              // <Zoom in={true}>
              <Execute />
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
                {/*<PelisCard clasificacion="All" />*/}
                <PelisCard clasificacion="Sci-Fi" />
                <PelisCard clasificacion="Action" />
                <PelisCard clasificacion="Adventure" />
                <PelisCard clasificacion="Thriller" />
                <PelisCard clasificacion="Crime" />
                <PelisCard clasificacion="Mystery" />
                <PelisCard clasificacion="Horror" />
                <PelisCard clasificacion="Comedy" />
                <PelisCard clasificacion="Drama" />
                <PelisCard clasificacion="Romance" />
          </div>

          <Footer />
        </Route>
      </Switch>
    </>
  );
}
