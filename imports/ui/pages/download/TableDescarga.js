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
import { useHistory } from 'react-router-dom';

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./TableDescarga.css";
import { Dropdown } from "primereact/dropdown";
import ShowMoreText from 'react-show-more-text';
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

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

export default function TableDescarga() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const dt = React.useRef(null);
  const history = useHistory();

  const descargaRegister = useTracker(() => {
    Meteor.subscribe("descargas");
    Meteor.subscribe("userRole","admin");
    
    let a = [];

    DescargasCollection.find({}).map(
      (data) => {
        a.push({
          id: data._id,
          idFile: data.idFile,
          nombreFile: data.nombreFile,
          tamanoFile: data.tamanoFile ? data.tamanoFile : 0,
          comentarios: data.comentarios,
          descargadoPor: Meteor.users.findOne({_id:data.descargadoPor}).emails[0].address,
          urlReal: data.urlReal,
          thumbnail: data.thumbnail,
          createdAt: data.createdAt.toString(),
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
  const nombreFileBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Nombre del Archivo</span>
        {rowData.nombreFile}
      </React.Fragment>
    );
  };
  const tamanoFileBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Tamaño</span>
        {rowData.tamanoFile ? (rowData.tamanoFile + " KB"):"N/A"}
      </React.Fragment>
    );
  };
  const comentariosBodyTemplate = (rowData) => {
    // const [open, setOpen] = React.useState(false);
    const executeOnClick = () => {
      // setOpen(!open)
      // console.log("Hola");
    };
    return (
      <React.Fragment>
        <span className="p-column-title">Comentarios</span>
        <ShowMoreText
          /* Default options */
          lines={3}
          more={
            <IconButton color="secondary" aria-label="add">
              <AddIcon />
            </IconButton>
          }
          less={
            <IconButton color="secondary" aria-label="remove">
              <RemoveIcon />
            </IconButton>
          }
          className="content-css"
          anchorClass="my-anchor-css-class"
          onClick={executeOnClick}
          expanded={false}
          width={280}
        >
          {rowData.comentarios}
        </ShowMoreText>
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
  const descargadoPorBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Descargado Por</span>
        {rowData.descargadoPor}
      </React.Fragment>
    );
  };
  const eliminarVideo = (id) => {
    console.log(id)
    const data = {id:id}
    // var http = require("http");
    // http.post = require("http-post");
    // http.post("/eliminar", data, (opciones, res, body) => {
    //   if (!opciones.headers.error) {
    //     // console.log(`statusCode: ${res.statusCode}`);
    //     console.log("TODO OK: " + JSON.stringify(opciones.headers));
    //     return;
    //   } else {
    //     console.log("ERRORS: " + opciones.headers);
    //     return;
    //   }
    // });
    $.post("/eliminar", data)
        .done(function (data) {
          console.log("TODO OK: " + data);
        })
        .fail(function (data) {
          console.log("ERRORS " + data);
        });


  }
  const eliminarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Eliminar Video</span>
        <IconButton color="secondary" onClick={() => { eliminarVideo(rowData.idFile) }} aria-label="delete">
          <DeleteIcon fontSize="large" />
        </IconButton>
      </React.Fragment>
    );
  };
  const urlRealBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Detalles</span>
        <Button 
          onClick={() => { history.push("/videos/" + rowData.id) }}
        >Ver Video</Button>
      </React.Fragment>
    );
  };
  const thumbnailBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Imagen</span>
        <img
          src={rowData.thumbnail}
          alt="No se pudo cargar la imagen"
          width="100%"
        />
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
                  field="descargadoPor"
                  body={descargadoPorBodyTemplate}
                  wrap="nowrap"
                  header="Descargado Por"
                  filter
                  filterPlaceholder="User email"
                  filterMatchMode="contains"
                />
                <Column
                  field="idFile"
                  header="Id de youtube"
                  body={idFileBodyTemplate}
                  filter
                  filterPlaceholder="Id de youtube"
                  filterMatchMode="contains"
                />
                <Column
                  field="nombreFile"
                  header="Nombre"
                  body={nombreFileBodyTemplate}
                  filter
                  filterPlaceholder="Nombre"
                  filterMatchMode="contains"
                />
                <Column
                  field="tamanoFile"
                  header="Tamaño"
                  body={tamanoFileBodyTemplate}
                  filter
                  filterPlaceholder="Tamaño"
                  filterMatchMode="contains"
                />
                <Column
                  field="comentarios"
                  header="Comentarios"
                  body={comentariosBodyTemplate}
                  filter
                  filterPlaceholder="Comentarios"
                  filterMatchMode="contains"
                />
                <Column
                  field="createdAt"
                  header="Fecha de Descarga"
                  body={createdAtBodyTemplate}
                  filter
                  filterPlaceholder="Fecha de Descarga"
                  filterMatchMode="contains"
                />
                <Column
                  field="urlReal"
                  header="URL Real"
                  body={urlRealBodyTemplate}
                />
                {Meteor.user().profile.role && Meteor.user().profile.role == "admin" ?
                  <Column
                    field="eliminar"
                    header="Eliminar"
                    body={eliminarBodyTemplate}
                  />
                   :
                  <></>
                } 
                
              </DataTable>
            </div>
          </div>
        </div>
      </Zoom>
    </>
  );
}
