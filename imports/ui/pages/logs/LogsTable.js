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
  TextField,
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
import { useHistory } from "react-router-dom";

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
  const [countLogs, setCountLogs] = React.useState(100);
  
  const dt = React.useRef(null);
  const history = useHistory();

  const user = identificador =>  {
    Meteor.subscribe("userID", identificador, {
      fields: {
        profile: 1,
        username: 1
      }
    }).ready();
      // console.log(Meteor.users.findOne(identificador));
      return Meteor.users.findOne(identificador,{fields: {
        profile: 1,
        username: 1
      }})
    }
  const logs = useTracker(() => {
    let query = {}
    if (id) {
      query = { $or: [{ userAfectado: id }, { userAdmin: id }] }
    } else if(Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username)){
      query = {}
    } else{
      query = { $or: [{ userAfectado: Meteor.userId() }, { userAdmin: Meteor.userId() }] }
    }

    Meteor.subscribe("logs", query,
      { sort: { createdAt: -1 }, limit: countLogs });

    let a = [];
    try {


      LogsCollection.find(
        query,
        { sort: { createdAt: -1 }, limit: countLogs }
      ).map((log) => {
        let admin = log.userAdmin.toUpperCase() == "SERVER" ? log.userAdmin : user(log.userAdmin)
        let usuario = user(log.userAfectado)
      //  let userReady = Meteor.subscribe("user", log.userAfectado, {
      //     fields: {
      //       'profile.firstName': 1,
      //       'profile.lastName': 1
      //     }
      //   }).ready();
      //   let adminReady = Meteor.subscribe("user", log.userAdmin, {
      //     fields: {
      //       'profile.firstName': 1,
      //       'profile.lastName': 1
      //     }
      //   }).ready();

        // Meteor.users.findOne(log.userAfectado) = await Meteor.users.findOne(log.userAfectado);
        // Meteor.users.findOne(log.userAdmin) = await Meteor.users.findOne(log.userAdmin);
        log && admin && usuario &&
        // userReady && adminReady &&
          a.push({
            id: log._id,
            type: log.type,
            nombreUserAfectado: `${usuario.profile.firstName} ${usuario.profile.lastName}`,
            nombreUserAdmin: 
            log.userAdmin.toUpperCase() == "SERVER" && admin != null && admin != ""
                ? "SERVER"
                : `${admin.profile && admin.profile.firstName} ${admin.profile && admin.profile.lastName}`,
            mensaje: log.message,
            createdAt: log.createdAt && log.createdAt + "",
          });
      });
    } catch (error) { }
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
      <>
        <span className="p-column-title">Fecha del Log</span>
        {rowData.createdAt}
      </>
    );
  };
  const iDBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">ID</span>
        {rowData.id}
      </>
    );
  };
  const typeBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Tipo de Log</span>
        {rowData.type}
      </>
    );
  };
  const nombreAfectadoBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Nombre y Apellidos del Usuario Afectado</span>
        {rowData.nombreUserAfectado}
      </>
    );
  };
  const userAdminBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Usuario Admin</span>
        {rowData.nombreUserAdmin}
      </>
    );
  };
  const mensajeBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Mensaje</span>
        {rowData.mensaje}
      </>
    );
  };

  return (
    <>
      <Grid item style={{ textAlign: "center" }}>
        <h1>Registro Eventos </h1>  
        <TextField
          // fullWidth
          className={classes.margin}
          id="countLogs"
          name="countLogs"
          label="Cantidad de Logs"
          variant="outlined"
          color="secondary"
          value={countLogs}
          type="number"
          onInput={(e) => {
            setCountLogs(Number(e.target.value))
            if (id) {
              Meteor.subscribe("logs", { $or: [{ userAfectado: id }, { userAdmin: id }] },
              { sort: { createdAt: -1 }, limit: countLogs });
            } else if(Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username)){
              Meteor.subscribe("logs", {},
              { sort: { createdAt: -1 }, limit: countLogs });
            } else{
              Meteor.subscribe("logs", { $or: [{ userAfectado: Meteor.userId() }, { userAdmin: Meteor.userId() }] },
              { sort: { createdAt: -1 }, limit: countLogs });
            }
          }}
          InputProps={{
            // readOnly: true,
            // startAdornment: (
            //   <InputAdornment position="start">
            //     <AccountCircleIcon />
            //   </InputAdornment>
            // ),
          }}
        />
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
