import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
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
import "./TVTable.css";
import { Dropdown } from "primereact/dropdown";
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import ListAltIcon from '@material-ui/icons/ListAlt';
import DeleteIcon from "@material-ui/icons/Delete";
//Collections
import { TVCollection } from "../collections/collections";
import { useHistory } from 'react-router-dom';


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
  avatar:{
    width: theme.spacing(7),
    height: theme.spacing(7),
  }
}));

export default function TVTable() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const dt = React.useRef(null);
  const history = useHistory();

  const descargaRegister = useTracker(() => {
    Meteor.subscribe("tv");
    let a = [];

    TVCollection.find({}).map(
      (data) =>
        data &&
        a.push({
          id: data._id,
          email: data.emails[0].address,
          firstname: data.profile &&
            data.profile.firstName
            ? data.profile.firstName
            : data.profile.name,
          lastName: data.profile.lastName,
          role: data.profile.role,
          edad: data.edad,
          foto: data.picture
            ? data.picture
            : "/"
        })
    );
    
    return a;
  });

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );
  const iDBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">ID</span>
        {rowData.id}
      </React.Fragment>
    );
  };
  const nombreBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Nombre</span>
        {rowData.firstname}
      </React.Fragment>
    );
  };
  const apellidoBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Apellido</span>
        {rowData.lastName}
      </React.Fragment>
    );
  };
  const emailBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Email</span>
        {rowData.email}
      </React.Fragment>
    );
  };
  const roleBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Rol</span>
        <Chip color="primary" label={rowData.role} />
      </React.Fragment>
    );
  };
  const edadBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Edad</span>
        {rowData.edad}
      </React.Fragment>
    );
  };
  const eliminarVideo = (id) => {
    Meteor.users.remove(id)   
  }
  const eliminarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip title={"Eliminar a " + rowData.firstname+ " "+ rowData.lastName}>
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              eliminarVideo(rowData.id);
            }}
          >
            <DeleteIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  };
  const urlBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip
          title={"Ver Detalles de " + rowData.firstname+ " "+ rowData.lastName}
        >
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              history.push("/users/" + rowData.id);
            }}
          >
            <ListAltIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  };
  const thumbnailBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Avatar className={classes.avatar}
          alt={rowData.firstName
          }
          src={
            rowData.foto
          }
        />
        {/* <img
          src={rowData.services.facebook.picture.data.url}
          alt="N/A"
          width="100%"
        /> */}
      </React.Fragment>
    );
  };
  const statuses = ["true", "false"];
  const onStatusChange = (e) => {
    dt.current.filter(e.value, "clasificado", "equals");
    setSelectedStatus(e.value);
  };
  const statusItemTemplate = (option) => {
    return (
      <span className={`customer-badge status-${option}`}>
        {option == "true" ? "Clasificado" : "No Clasificado"}
      </span>
    );
  };
  const statusFilter = (
    <Dropdown
      value={selectedStatus}
      options={statuses}
      onChange={onStatusChange}
      itemTemplate={statusItemTemplate}
      placeholder="Seleccione la clasificación"
      className="p-column-filter"
      showClear
    />
  );
  return (
    <>
      <div className={classes.drawerHeader}></div>

      <Zoom in={true}>
        <div style={{ width: "100%", padding:10}}>
          <div className="datatable-responsive-demo">
            <div className="card">
              <DataTable
                ref={dt}
                className="p-shadow-5 p-datatable-responsive-demo"
                value={descargaRegister}
                paginator
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={5}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
              >
                <Column
                  field="img"
                  header="IMG"
                  body={thumbnailBodyTemplate}
                />
                {/* <Column
                  field="id"
                  body={iDBodyTemplate}
                  wrap="nowrap"
                  header="ID"
                  filter
                  filterPlaceholder="ID"
                  filterMatchMode="contains"
                /> */}
                <Column
                  field="firstname"
                  header="Nombre"
                  body={nombreBodyTemplate}
                  filter
                  filterPlaceholder="Nombre"
                  filterMatchMode="contains"
                />
                <Column
                  field="lastName"
                  header="Apellidos"
                  body={apellidoBodyTemplate}
                  filter
                  filterPlaceholder="Apellidos"
                  filterMatchMode="contains"
                />
                <Column
                  field="edad"
                  header="Edad"
                  body={edadBodyTemplate}
                  filter
                  filterPlaceholder="Edad"
                  filterMatchMode="contains"
                />
                <Column
                  field="email"
                  header="Correo"
                  body={emailBodyTemplate}
                  filter
                  filterPlaceholder="Correo"
                  filterMatchMode="contains"
                />
                <Column
                  field="role"
                  header="Roles"
                  body={roleBodyTemplate}
                  filter
                  filterPlaceholder="Roles"
                  filterMatchMode="contains"
                />
                <Column
                  field="urlReal"
                  header=""
                  body={urlBodyTemplate}
                />
                <Column
                  field="eliminar"
                  header=""
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
