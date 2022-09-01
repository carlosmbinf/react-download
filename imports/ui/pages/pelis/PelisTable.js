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
import "./PelisTable.css";
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
  PelisCollection,
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

export default function PelisTable() {
  let { id } = useParams();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [countLogs, setCountLogs] = React.useState(100);
  
  const dt = React.useRef(null);
  const history = useHistory();

  const logs = useTracker(() => {
      Meteor.subscribe(
        "pelis",
        {},
        {
          fields: {
            _id: 1,
            nombrePeli: 1,
            urlBackground: 1,
            vistas: 1,
            mostrar: 1,
            clasificacion: 1,
          }
        }
      ); 

    let a = [];
    try {
      PelisCollection.find(
        {},
        {
          fields: {
            _id: 1,
            nombrePeli: 1,
            urlBackground: 1,
            vistas: 1,
            mostrar: 1,
            clasificacion: 1,
          },
          sort: { nombrePeli: 1 },
        }
      ).map((pelicula) => {
        pelicula &&
          // userReady && adminReady &&
          a.push({
            id: pelicula._id,
            nombre: pelicula.nombrePeli,
            img: pelicula.urlBackground,
            vistas: pelicula.vistas,
            mostrar: pelicula.mostrar,
            clasificacion: pelicula.clasificacion.length
              ? pelicula.clasificacion
              : "Sin Clasificación",
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
  const iDBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">ID</span>
        {rowData.id}
      </React.Fragment>
    );
  };
  const imgBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
          <Avatar
            className={classes.avatar}
            alt={rowData.nombre}
            src={rowData.img}
          />
        {/* <img
          src={rowData.services.facebook.picture.data.url}
          alt="N/A"
          width="100%"
        /> */}
      </React.Fragment>
    );
  };
  const nombreBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Nombre</span>
        {rowData.nombre}
      </React.Fragment>
    );
  };
  const vistasBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Vistas</span>
        {rowData.vistas}
      </React.Fragment>
    );
  };
  const mostrarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Mostrar</span>
        <Chip color={rowData.mostrar == "true" ? "primary" : "secondary"} label={rowData.mostrar} />
      </React.Fragment>
    );
  };
  const clasificacionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Clasificacion</span>
        {rowData.clasificacion == "Sin Clasificación"?"Sin Clasificación":(
          <>
            {rowData.clasificacion.map(element => {
              return <Chip style={{ margin: 2 }} color="primary" label={element} />
            })}

          </> 
        )}
      </React.Fragment>
    );
  };
  const urlBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip
          title={
            "Ver Detalles de " + rowData.nombre
          }
        >
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              history.push("/pelis/" + rowData.id);
            }}
          >
            <ListAltIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    )
  };
  return (
    <>
      <Grid item style={{ textAlign: "center" }}>
        <h1>Todas las Películas</h1>  
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
                  header="ID"
                  body={iDBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column
                  field="img"
                  header="Imagen"
                  body={imgBodyTemplate}
                />
                <Column
                  field="nombre"
                  header="Nombre"
                  body={nombreBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column
                  field="mostrar"
                  header="Mostrar"
                  body={mostrarBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column
                  field="vistas"
                  header="Vistas"
                  body={vistasBodyTemplate}
                />
                <Column
                  field="clasificacion"
                  header="Clasificacion"
                  body={clasificacionBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column
                field="url"
                header="Detalles"
                body={urlBodyTemplate}
              />
                
              </DataTable>
            </div>
          </div>
        </div>
      </Zoom>
    </>
  );
}
