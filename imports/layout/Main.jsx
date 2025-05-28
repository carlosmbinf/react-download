import React, { useEffect } from "react";
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
import { Chip, Container, Grid, TextField, Zoom } from "@material-ui/core";
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
import GraphicsLinealConsumoMegasXDias from "../ui/pages/dashboard/GraphicsLinealConsumoMegasXDias";
import GraphicsLinealConsumoMegasXHoras from "../ui/pages/dashboard/GraphicsLinealConsumoMegasXHoras";
import GraphicsLinealGananciasXMesesAdmin from "../ui/pages/dashboard/GraphicsLinealGananciasXMesesAdmin";
import SeriesDetails from "../ui/pages/series/SeriesDetails";
import CreateSerie from "../ui/pages/series/CreateSerie";
import SeriesCard from "../ui/pages/series/SeriesCard";
import NotificacionUsersConnectionVPN from "../ui/pages/notificacionUsersConnectionVPN/NotificacionUsersConnectionVPN";
import InsertNotificacion from "../ui/pages/notificacionUsersConnectionVPN/InsertNotificacion";
import ListTransferUsuariosPorServer from "../ui/pages/servers/ListTransferUsuariosPorServer";

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
  filterInput: {
    margin: theme.spacing(2, 0),
    width: "100%",
  }

}));

export default function Main() {
  const [clasificacionSeries, setClasificacionSeries] = React.useState([]);
  const [filter, setFilter] = React.useState("");
  const classes = useStyles();
  const useractual = useTracker(() => {
    return Meteor.user();
  });
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    Meteor.call("getSeriesClasificacion", (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("getSeriesClasificacion " , res);
        setClasificacionSeries(res);
      }
    });
  }, []);
  
  return (
    <>
      <div className={classes.toolbar} />

      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}

      <Switch>
        <Route path="/dashboard">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
            Array(Meteor.settings.public.administradores)[0].includes(
              useractual.username
            ) ? (
              <Grid container>
                <Grid
                  container
                  xs={12}
                  xl={6}
                  justify="space-evenly"
                  alignItems="center"
                  style={{ paddingTop: 100 }}
                >
                  <Chip
                    style={{ width: "90%" }}
                    color="primary"
                    label="Consumo de Datos en VidKar Por Horas:"
                  />
                  <div style={{ width: "100%", height: 300 }}>
                    <GraphicsLinealConsumoMegasXHoras />
                  </div>
                </Grid>
                {/* <Divider variant="middle" /> */}
                <Grid
                  container
                  xs={12}
                  xl={6}
                  justify="space-evenly"
                  alignItems="center"
                  style={{ paddingTop: 100 }}
                >
                  <Chip
                    style={{ width: "90%" }}
                    color="primary"
                    label="Consumo de Datos en VidKar Por Dias:"
                  />
                  <div style={{ width: "100%", height: 300 }}>
                    <GraphicsLinealConsumoMegasXDias />
                  </div>
                </Grid>
                <Divider variant="middle" />
                <Grid
                  container
                  item
                  xs={12}
                  justify="space-evenly"
                  alignItems="center"
                  style={{ paddingTop: 100 }}
                >
                  <Chip
                    style={{ width: "90%" }}
                    color="primary"
                    label="Consumo de Datos en VidKar:"
                  />
                  <div style={{ width: "100%", height: 300 }}>
                    <GraphicsLinealConsumoMegasXMeses />
                  </div>
                </Grid>
                <Divider variant="middle" />
                <DashboardInit />
              </Grid>
            ) : Meteor.userId() && Meteor.user().profile.role == "admin" ? (
              <Grid container>
                <Grid
                  container
                  item
                  xs={12}
                  xl={6}
                  justify="space-evenly"
                  alignItems="center"
                  style={{ paddingTop: 100 }}
                >
                  <Chip
                    style={{ width: "90%" }}
                    color="primary"
                    label="Consumo de Datos en VidKar Por Horas:"
                  />
                  <div style={{ width: "100%", height: 300 }}>
                    <GraphicsLinealConsumoMegasXHoras />
                  </div>
                </Grid>
                {/* <Divider variant="middle" /> */}
                <Grid
                  container
                  item
                  xs={12}
                  xl={6}
                  justify="space-evenly"
                  alignItems="center"
                  style={{ paddingTop: 100 }}
                >
                  <Chip
                    style={{ width: "90%" }}
                    color="primary"
                    label="Consumo de Datos en VidKar Por Dias:"
                  />
                  <div style={{ width: "100%", height: 300 }}>
                    <GraphicsLinealConsumoMegasXDias />
                  </div>
                </Grid>
                <Divider variant="middle" />
                <Grid
                  container
                  item
                  xs={12}
                  justify="space-evenly"
                  alignItems="center"
                  style={{ paddingTop: 100 }}
                >
                  <Chip
                    style={{ width: "90%" }}
                    color="primary"
                    label="Consumo de Datos en VidKar:"
                  />
                  <div style={{ width: "100%", height: 300 }}>
                    <GraphicsLinealConsumoMegasXMeses />
                  </div>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  justify="space-evenly"
                  alignItems="center"
                  style={{ paddingTop: 100 }}
                >
                  <Chip
                    style={{ width: "90%" }}
                    color="primary"
                    label="Ganancias:"
                  />
                  <div style={{ width: "100%", height: 300 }}>
                    <GraphicsLinealGananciasXMesesAdmin />
                  </div>
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

        <Route path="/notificacionUsersConnectionVPN">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
              useractual.profile &&
              useractual.profile.role == "admin" ? (
              <>
                <InsertNotificacion />
                <NotificacionUsersConnectionVPN />
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

        <Route path="/compras/:id">
          <div style={{ paddingBottom: "7em" }}>
            {/* {Meteor.settings.public.mostrarCompras == true && */}
            <CompraCard type="megas" />
            {/* <CompraCard type="fecha-proxy"/> */}
            <CompraCard type="vpnplus" />
            {/* <CompraCard type="fecha-vpn"/> */}
            <VentasTableSinCompra />
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
                  {Array(Meteor.settings.public.administradores)[0].includes(
                    Meteor.user().username
                  ) && <StateUsers />}
                </Grid>

                <Grid item xs={12} className={classes.root}>
                  <UserCard withCreate="true" />
                </Grid>
                <Grid item xs={12}>
                  <UserCard />
                  {useractual &&
                  useractual.profile &&
                  useractual.profile.role == "admin" ? (
                    Array(Meteor.settings.public.administradores)[0].includes(
                      useractual.username
                    ) ? (
                      <UsersTable />
                    ) : (
                      <UsersTable
                        selector={{
                          $or: [
                            { bloqueadoDesbloqueadoPor: Meteor.userId() },
                            { bloqueadoDesbloqueadoPor: { $exists: false } },
                            { bloqueadoDesbloqueadoPor: { $in: [""] } },
                          ],
                        }}
                      />
                    )
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
            {Array(Meteor.settings.public.administradores)[0].includes(
                    Meteor.user().username
                  ) ? (
              <>
              <ServersDetails />
              <ListTransferUsuariosPorServer/>
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
        <Route path="/servers">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
            useractual.profile &&
            useractual.profile.role == "admin" ? (
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
            Array(Meteor.settings.public.administradores)[0].includes(
              useractual.username
            ) ? (
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
            Array(Meteor.settings.public.administradores)[0].includes(
              useractual.username
            ) ? (
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
            Array(Meteor.settings.public.administradores)[0].includes(
              useractual.username
            ) ? (
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
            useractual.profile &&
            useractual.profile.role == "admin" ? (
              <>
                <UsersTableVPN
                  selector={
                    Array(Meteor.settings.public.administradores)[0].includes(
                      Meteor.user().username
                    )
                      ? { vpn: true }
                      : {
                          $or: [
                            {
                              bloqueadoDesbloqueadoPor: Meteor.userId(),
                            },
                            {
                              _id: Meteor.userId(),
                            },
                          ],
                          vpn: true,
                        }
                  }
                />
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
            Array(Meteor.settings.public.administradores)[0].includes(
              useractual.username
            ) ? (
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
            {useractual && useractual.profile.role == "admin" ? (
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
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12}>
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
          <div
            style={{ paddingBottom: "7em" }}
            justify="center"
            alignItems="center"
          >
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
        <Route path="/series/:id">
          <div style={{ paddingBottom: "7em" }}>
            <SeriesDetails />
          </div>

          <Footer />
        </Route>
        <Route path="/series">
          <div style={{ paddingBottom: "7em" }}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              {/* <Grid item xs={12}>
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
              </Grid> */}
              <Grid item xs={12}>
                {/*<PelisCard clasificacion="All" />*/}
                {clasificacionSeries &&
                  clasificacionSeries.length > 0 &&
                  clasificacionSeries.map((a) => (
                    <SeriesCard clasificacion={a} />
                  ))}
              </Grid>
            </Grid>
          </div>

          <Footer />
        </Route>
        <Route path="/create-series">
          <div style={{ paddingBottom: "7em" }}>
            {useractual &&
            useractual.profile &&
            useractual.profile.role == "admin" ? (
              <CreateSerie />
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
        <Route path="/pelis/:id">
          <div style={{ paddingBottom: "7em" }}>
            <PelisDetails />
          </div>

          <Footer />
        </Route>
        <Route path="/pelis">
          <div style={{ paddingBottom: "7em" }}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                {useractual &&
                useractual.profile &&
                useractual.profile.role == "admin" ? (
                  <>
                    <PelisCard withCreate="true"/>
                    <PelisTable />
                  </>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={12}>
                  {/* Campo de filtro */}
                  <Container>
                    <TextField
                    className={classes.filterInput}
                    variant="outlined"
                    label="Busca por nombre o año"
                    placeholder="Ejemplo: Inception o 2023"
                    value={filter}
                    onChange={handleFilterChange}
                    helperText="Escribe el nombre de la película o el año para filtrar"
                  />
                  </Container>
                  
                  {/* Películas filtradas */}
                  <div style={{ paddingBottom: "7em" }}>
                    <PelisCard clasificacion="All" filter={filter} />
                    <PelisCard clasificacion="Sci-Fi" filter={filter} />
                    <PelisCard clasificacion="Action" filter={filter} />
                    <PelisCard clasificacion="Adventure" filter={filter} />
                    <PelisCard clasificacion="Thriller" filter={filter} />
                    <PelisCard clasificacion="Crime" filter={filter} />
                    <PelisCard clasificacion="Mystery" filter={filter} />
                    <PelisCard clasificacion="Horror" filter={filter} />
                    <PelisCard clasificacion="Comedy" filter={filter} />
                    <PelisCard clasificacion="Drama" filter={filter} />
                    <PelisCard clasificacion="Romance" filter={filter} />
                  </div>

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
            Array(Meteor.settings.public.administradores)[0].includes(
              useractual.username
            ) ? (
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
            Array(Meteor.settings.public.administradores)[0].includes(
              useractual.username
            ) ? (
              // <Zoom in={true}>
              <ExportDataToMongoDB />
            ) : (
              // </Zoom>
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
            Array(Meteor.settings.public.administradores)[0].includes(
              useractual.username
            ) ? (
              // <Zoom in={true}>
              <Execute />
            ) : (
              // </Zoom>
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
            {/* Campo de filtro */}
             <Container>
                    <TextField
                    className={classes.filterInput}
                    variant="outlined"
                    label="Busca por nombre o año"
                    placeholder="Ejemplo: Inception o 2023"
                    value={filter}
                    onChange={handleFilterChange}
                    helperText="Escribe el nombre de la película o el año para filtrar"
                  />
                  </Container>

            {/* Películas filtradas */}
            <div style={{ paddingBottom: "7em" }}>
              <PelisCard clasificacion="All" filter={filter} />
              <PelisCard clasificacion="Sci-Fi" filter={filter} />
              <PelisCard clasificacion="Action" filter={filter} />
              <PelisCard clasificacion="Adventure" filter={filter} />
              <PelisCard clasificacion="Thriller" filter={filter} />
              <PelisCard clasificacion="Crime" filter={filter} />
              <PelisCard clasificacion="Mystery" filter={filter} />
              <PelisCard clasificacion="Horror" filter={filter} />
              <PelisCard clasificacion="Comedy" filter={filter} />
              <PelisCard clasificacion="Drama" filter={filter} />
              <PelisCard clasificacion="Romance" filter={filter} />
            </div>

            <Footer />
        </Route>
      </Switch>
    </>
  );
}
