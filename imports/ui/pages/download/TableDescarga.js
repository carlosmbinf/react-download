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
import "./TableDescarga.css";
import { Dropdown } from 'primereact/dropdown';
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

export default function Archivo() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const dt = React.useRef(null);

  const archivoRegister = useTracker(() => {
    Meteor.subscribe("descargas");
    let a = [];

    DescargasCollection.find({}).map(
      (data) =>
        data &&
        a.push({
          id: data._id,
          idFile: data.idFile,
          nombreFile: data.nombreFile,
          tamanoFile: data.tamanoFile,
          comentarios: data.comentarios,
          descargadoPor: data.descargadoPor,
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

  const idFileBodyTemplate = (rowData) => {
  return (
      <React.Fragment>
          <span className="p-column-title">Code</span>
          {rowData.idFile}
      </React.Fragment>
  );
  }
  const iDBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <span className="p-column-title">ID</span>
            {rowData.id}
        </React.Fragment>
    );
}
const idFileBodyTemplate = (rowData) => {
  return (
      <React.Fragment>
          <span className="p-column-title">Code</span>
          {rowData.idFile}
      </React.Fragment>
  );
}
  const nombreFileBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <span className="p-column-title">Code</span>
            {rowData.nombreFile}
        </React.Fragment>
    );
}
const tamanoFileBodyTemplate = (rowData) => {
  return (
      <React.Fragment>
          <span className="p-column-title">Code</span>
          {rowData.tamanoFile}
      </React.Fragment>
  );
}
const comentariosBodyTemplate = (rowData) => {
  return (
      <React.Fragment>
          <span className="p-column-title">Code</span>
          {rowData.comentarios}
      </React.Fragment>
  );
}
const createdAtBodyTemplate = (rowData) => {
  return (
      <React.Fragment>
          <span className="p-column-title">Code</span>
          {rowData.createdAt}
      </React.Fragment>
  );
}
const descargadoPorBodyTemplate = (rowData) => {
  return (
      <React.Fragment>
          <span className="p-column-title">Code</span>
          {rowData.descargadoPor}
      </React.Fragment>
  );
}
const statuses = [
  'true', 'false'
];
const onStatusChange = (e) => {
  dt.current.filter(e.value, 'clasificado', 'equals');
  setSelectedStatus(e.value);
}
const statusItemTemplate = (option) => {
  return <span className={`customer-badge status-${option}`}>{option=="true"?"Clasificado":"No Clasificado"}</span>;
}
const statusFilter = <Dropdown value={selectedStatus} options={statuses} onChange={onStatusChange} itemTemplate={statusItemTemplate} placeholder="Seleccione la clasificación" className="p-column-filter" showClear />;
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
                value={archivoRegister}
                paginator
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={5}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
              >
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
                  field="idFile"
                  header="Registro de Entrada"
                  body={idFileBodyTemplate}
                  filter
                  filterPlaceholder="Buscar en Registro de Entrada"
                  filterMatchMode="contains"
                />
                <Column
                  field="nombreFile"
                  header="Registro de Salida"
                  body={nombreFileBodyTemplate}
                  filter
                  filterPlaceholder="Buscar en Registro de Salida"
                  filterMatchMode="contains"
                />
                <Column
                  field="tamanoFile"
                  header="Tamaño de archivo"
                  body={tamanoFileBodyTemplate}
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
                  header="Comentarios"
                  body={createdAtBodyTemplate}
                  filter
                  filterPlaceholder="Buscar en comentarios"
                  filterMatchMode="contains"
                />
                <Column
                  field="descargadoPor"
                  header="Comentarios"
                  body={descargadoPorBodyTemplate}
                  filter
                  filterPlaceholder="Buscar en comentarios"
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
