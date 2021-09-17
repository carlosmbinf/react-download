import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import {
  Paper,
  Box,
  Grid,
  Icon,
  Divider,
  Zoom,
  IconButton,
  Chip,
} from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./LogsTable.css";
import { Dropdown } from "primereact/dropdown";
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';

//Collections
import {
  DescargasCollection,
  LogsCollection,
  OnlineCollection,
} from "../collections/collections";
import { useHistory} from "react-router-dom";

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

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);
const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down("sm")]: {},
  [theme.breakpoints.down("md")]: {},
  [theme.breakpoints.up("md")]: {},
  clasificado: {
    background: theme.palette.secondary.main,
    padding: 10,
    borderRadius: 25,
  },
  noclasificado: {
    background: theme.palette.primary.main,
    padding: 10,
    borderRadius: 25,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  margin: {
    margin: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function LogsTable() {
  let { id } = useParams();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const dt = React.useRef(null);
  const history = useHistory();
  

  const logs = useTracker(() => {
    Meteor.subscribe("logs");
    Meteor.subscribe("user");
    let a = [];
    try {
      
       LogsCollection.find(
         id ? { $or: [{ userAfectado: id }, { userAdmin: id }] } : {},
         { sort: { createdAt: -1 } }
       ).map((log) => {
         // Meteor.users.findOne(log.userAfectado) = await Meteor.users.findOne(log.userAfectado);
         // Meteor.users.findOne(log.userAdmin) = await Meteor.users.findOne(log.userAdmin);
         log &&
           a.push({
             id: log._id,
             type: log.type,
             nombreUserAfectado:
               (Meteor.users.findOne(log.userAfectado) &&
                 Meteor.users.findOne(log.userAfectado).profile &&
                 Meteor.users.findOne(log.userAfectado).profile.firstName) +
               " " +
               (Meteor.users.findOne(log.userAfectado) &&
                 Meteor.users.findOne(log.userAfectado).profile &&
                 Meteor.users.findOne(log.userAfectado).profile.lastName),
             nombreUserAdmin:
               log.userAdmin == "server"
                 ? "SERVER"
                 : (Meteor.users.findOne(log.userAdmin) &&
                     Meteor.users.findOne(log.userAdmin).profile.firstName) +
                   " " +
                   (Meteor.users.findOne(log.userAdmin) &&
                     Meteor.users.findOne(log.userAdmin).profile.lastName),
             mensaje: log.message,
             createdAt: log.createdAt && log.createdAt + "",
           });
       });
    } catch (error) {}
     return a;

  });

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );
  const createAtBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Fecha del Log</span>
        {rowData.createdAt}
      </React.Fragment>
    );
  };
  const iDBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">ID</span>
        {rowData.id}
      </React.Fragment>
    );
  };
  const typeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Tipo de Log</span>
        {rowData.type}
      </React.Fragment>
    );
  };
  const nombreAfectadoBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Nombre y Apellidos del Usuario Afectado</span>
        {rowData.nombreUserAfectado}
      </React.Fragment>
    );
  };
  const userAdminBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Usuario Admin</span>
        {rowData.nombreUserAdmin}
      </React.Fragment>
    );
  };
  const mensajeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Mensaje</span>
        {rowData.mensaje}
      </React.Fragment>
    );
  };

  return (
    <>
      <Grid item style={{ textAlign: "center" }}>
        <h1>Registro Eventos </h1>
      </Grid>
      <Zoom in={true}>
        <div style={{ width: "100%", padding: 20 }}>
          <div className="datatable-responsive-demo">
            <div className="card">
              <DataTable
                ref={dt}
                className="p-shadow-5 p-datatable-responsive-demo"
                value={logs}
                paginator
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={10}
                rowsPerPageOptions={[10, 20, 50, 75, 100]}
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
              >
                <Column
                  field="id"
                  header="ID del Logs"
                  body={iDBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column
                  field="type"
                  header="Tipo de Log"
                  body={typeBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column
                  field="nombreUserAdmin"
                  header="Usuario Admin"
                  body={userAdminBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column
                  field="nombreUserAfectado"
                  header="Usuario Afectado"
                  body={nombreAfectadoBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column
                  field="mensaje"
                  header="Mensajes"
                  body={mensajeBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column
                  field="createdAt"
                  header="Fecha del Log"
                  body={createAtBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
              </DataTable>
            </div>
          </div>
        </div>
      </Zoom>
    </>
  );
}
