import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  Paper,
  Box,
  Grid,
  Icon,
  Divider,
  Zoom,
  IconButton,
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
import "./UsersTable.css";
import { Dropdown } from "primereact/dropdown";
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
//Collections
import { DescargasCollection } from "../collections/collections";

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
}));

export default function UsersTable() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const dt = React.useRef(null);

  const descargaRegister = useTracker(() => {
    Meteor.subscribe("users");
    let a = [];

    Meteor.users.find({}).map(
      (data) =>
        data &&
        a.push({
          id: data._id,
          email: data.emails[0].address,
          firstname: data.profile.firstName,
          lastName: data.profile.lastName,
          role: data.profile.role,
          edad: data.edad,
          foto: data.services&&data.services.facebook&&(data.services.facebook.picture.data.url ? data.services.facebook.picture.data.url : "")
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
  const idFileBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">ID de Youtube</span>
        {rowData.idFile}
      </React.Fragment>
    );
  };
  const nombreBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Nombre y apellido</span>
        {rowData.firstname + " " + rowData.lastName}
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
  const comentariosBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Comentarios</span>
        {rowData.comentarios}
      </React.Fragment>
    );
  };
  const createdAtBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Fecha de Descarga</span>
        <h3>{rowData.createdAt}</h3>
      </React.Fragment>
    );
  };

  const eliminarVideo = (id) => {
    console.log(id)
    const data = {id:id}
    var http = require("http");
    http.post = require("http-post");
    http.post("/eliminar", data, (opciones, res, body) => {
      if (!opciones.headers.error) {
        // console.log(`statusCode: ${res.statusCode}`);
        console.log("TODO OK: " + JSON.stringify(opciones.headers));
        return;
      } else {
        console.log("ERRORS: " + opciones.headers);
        return;
      }
    });
  }
  const eliminarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button 
        onClick={() => { eliminarVideo(rowData.idFile) }}
        >Eliminar</Button>
      </React.Fragment>
    );
  };
  const urlRealBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <a href={"/users/" + rowData._id}>View User</a>
      </React.Fragment>
    );
  };
  const thumbnailBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Avatar
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
        <div style={{ width: "100%" }}>
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
                  header="Comentarios"
                  body={thumbnailBodyTemplate}
                />
                <Column
                  field="id"
                  body={iDBodyTemplate}
                  wrap="nowrap"
                  header="ID"
                  filter
                  filterPlaceholder="Buscar por ID"
                  filterMatchMode="contains"
                />
                <Column
                  field="Nombre y Apellidos"
                  header="Registro de Salida"
                  body={nombreBodyTemplate}
                  filter
                  filterPlaceholder="Buscar en Registro de Salida"
                  filterMatchMode="contains"
                />
                <Column
                  field="edad"
                  header="Tamaño de archivo"
                  body={edadBodyTemplate}
                  filter
                  filterPlaceholder="Buscar en estantes"
                  filterMatchMode="contains"
                />
                <Column
                  field="comentarios"
                  header="Comentarios"
                  body={comentariosBodyTemplate}
                  filter
                  filterPlaceholder="Buscar en comentarios"
                  filterMatchMode="contains"
                />
                <Column
                  field="createdAt"
                  header="Fecha de Descarga"
                  body={createdAtBodyTemplate}
                  filter
                  filterPlaceholder="Buscar en comentarios"
                  filterMatchMode="contains"
                />
                <Column
                  field="urlReal"
                  header="URL Real"
                  body={urlRealBodyTemplate}
                />
                <Column
                  field="eliminar"
                  header="Eliminar"
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
