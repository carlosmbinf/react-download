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
import "./NotificacionUsersConnectionVPN.css";
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
  FilesCollection,
  NotificacionUsersConectadosVPNCollection,
  PreciosCollection,
} from "../collections/collections";
import { useHistory } from "react-router-dom";
import dateFormat from "dateformat";

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
  [theme.breakpoints.up("md")]: {
    columnSmoll: {
    }
  },
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

export default function NotificacionUsersConnectionVPN(option) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedOnline, setSelectedOnline] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [selectedLimites, setSelectedLimites] = React.useState(null);
  const [selectedConProxy, setSelectedConProxy] = React.useState(null);
  const dt = React.useRef(null);
  const history = useHistory();

  // var userOnline = useTracker(() => {

  //   return OnlineCollection.find({"userId" : Meteor.userId()}).fetch();
  // });

  const precios = useTracker(() => {
    // Meteor.subscribe("users");
    let a = [];
    Meteor.subscribe("notificacionUsersConnectionVPN", option.selector ? option.selector : {}).ready() &&

      NotificacionUsersConectadosVPNCollection.find(option.selector ? option.selector : {}, {
        sort: { fecha: -1 }
      }).map(
        (data) => {
          let user = Meteor.users.findOne(data.userIdConnected);
          let admin = Meteor.users.findOne(data.adminIdSolicitud);
          a.push({
            id: data._id,
            userIdConnected: user && user.username,
            userIdConnectedId: user && user._id,
            adminIdSolicitud: admin && admin.username,
            adminIdSolicitudId: admin && admin._id,
            mensajeaenviarConnected: data.mensajeaenviarConnected,
            mensajeaenviarDisconnected: data.mensajeaenviarDisconnected
          })
        }
      );

    return a;
  });

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );
  const userIdConnectedBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Usuario:</span>
        {rowData.userIdConnected}
      </React.Fragment>
    );
  };
  const adminIdSolicitudBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Admin:</span>
        {rowData.adminIdSolicitud}
      </React.Fragment>
    );
  };

  const mensajeaenviarConnectedBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Connected:</span>
        {rowData.mensajeaenviarConnected}
      </React.Fragment>
    );
  };

  const mensajeaenviarDisconnectedBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Disconnected:</span>
        {rowData.mensajeaenviarDisconnected}
      </React.Fragment>
    );
  };


  const dataBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip
          title={
            "Ver Detalles"
          }
        >
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              history.push("/files/" + rowData.id);
            }}
          >
            <ListAltIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  };

  const eliminarFile = async (id,userIdConnected,adminIdSolicitud) => {
    try{
      console.log("Eliminar Notificacion",id,userIdConnected,adminIdSolicitud);
      await NotificacionUsersConectadosVPNCollection.remove(id);
      await Meteor.call("registrarLog", "NOTIFICACION CONEXION VPN", userIdConnected, adminIdSolicitud, `Notificacion ${id} Eliminada`);
    }catch(error){
      console.log(error);
      Meteor.call("registrarLog", "ERROR NOTIFICACION CONEXION VPN", userIdConnected, adminIdSolicitud, error.message);
    }
  };
  const eliminarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip
          title={`Eliminar`}
        >
          <IconButton
            // disabled
            aria-label="delete"
            color="primary"
            onClick={() => {
              eliminarFile(rowData.id, rowData.userIdConnectedId, rowData.adminIdSolicitudId);
            }}
          >
            <DeleteIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  };

  return (
    <>
      <div className={classes.drawerHeader}></div>

      <Zoom in={true}>
        <div style={{ width: "100%", padding: 10 }}>
          <div className="datatable-responsive-demo">
            <div className="card">
              <DataTable
                ref={dt}
                className="p-shadow-5 p-datatable-responsive-demo"
                value={precios}
                paginator
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={5}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
              // reorderableColumns={true}
              // resizableColumns={true}
              >
                <Column
                  field="adminIdSolicitud"
                  header="Admin"
                  body={adminIdSolicitudBodyTemplate}
                  filter
                  filterPlaceholder="Admin"
                  filterMatchMode="contains"
                />
                <Column
                  field="userIdConnected"
                  body={userIdConnectedBodyTemplate}
                  wrap="nowrap"
                  header="Usuario"
                  filter
                  filterPlaceholder="Usuario"
                  filterMatchMode="contains"
                />
                <Column
                  field="mensajeaenviarConnected"
                  header="Connected"
                  body={mensajeaenviarConnectedBodyTemplate}
                  filter
                  filterPlaceholder="Connected"
                  filterMatchMode="contains"
                />
                <Column
                  field="mensajeaenviarDisconnected"
                  header="Disconnected"
                  body={mensajeaenviarDisconnectedBodyTemplate}
                  filter
                  filterPlaceholder="Disconnected"
                  filterMatchMode="contains"
                />
                {/* <Column
                  field="comentario"
                  header="Comentario"
                  body={comentarioBodyTemplate}
                  filter
                  filterPlaceholder="Comentario:"
                  filterMatchMode="contains"
                /> */}
                {/* <Column
                  field="data"
                  header="Detalles"
                  body={dataBodyTemplate}
                /> */}
                <Column
                  field="eliminar"
                  // header="Eliminar"
                  body={eliminarBodyTemplate}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </Zoom>
    </>
  );
}
