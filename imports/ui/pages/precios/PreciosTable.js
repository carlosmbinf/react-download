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
import "./PreciosTable.css";
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

export default function PreciosTable(option) {
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
    Meteor.subscribe("precios",option.selector?option.selector:{}).ready()&&   

    PreciosCollection.find(option.selector?option.selector:{}, {
      sort: { createdAt: -1 }
    }).map(
      (data) =>
        data &&
        a.push({
          id: data._id,
          createdAt: data.createdAt && data.createdAt.toString(),
          precio: data.precio && data.precio,
          type: data.type && data.type,
          megas: data.megas ? data.megas : 0,
          comentario: data.comentario && data.comentario
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
  const createdAtBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Creado:</span>
        {rowData.createdAt}
      </React.Fragment>
    );
  };
  const precioBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Precio</span>
        <Chip color="primary" label={rowData.precio} />
      </React.Fragment>
    );
  };
 
  const fechaBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Type</span>
        <Chip color="primary" style={{ textTransform:"uppercase"}} label={rowData.type} />
      </React.Fragment>
    );
  };
  const megasBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Cantidad de Megas</span>
        <Chip color="primary" label={`${rowData.megas} MB`} />
      </React.Fragment>
    );
  };
  const comentarioBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Comentarios</span>
        {rowData.comentario}
      </React.Fragment>
    );
  };
  

  const eliminarPrecio = (id) => {
    PreciosCollection.remove(id);
  };
  const eliminarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip
          title={`Eliminar ${rowData.precio} CUP`}
        >
          <IconButton
            // disabled
            aria-label="delete"
            color="primary"
            onClick={() => {
              eliminarPrecio(rowData.id);
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
          title={
            "Ver Detalles"
          }
        >
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              history.push("/precio/" + rowData.id);
            }}
          >
            <ListAltIcon fontSize="large" />
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
                  field="createdAt"
                  header="Fecha de Creado"
                  body={createdAtBodyTemplate}
                  filter
                  filterPlaceholder="Fecha"
                  filterMatchMode="contains"
                />
                <Column
                  field="precio"
                  header="Precio"
                  body={precioBodyTemplate}
                  filter
                  filterPlaceholder="Precio"
                  filterMatchMode="contains"
                />
                <Column
                  field="fecha"
                  header="Fecha"
                  body={fechaBodyTemplate}
                  filter
                  filterPlaceholder="Fecha"
                  filterMatchMode="contains"
                />
                <Column
                  field="megas"
                  header="Megas"
                  body={megasBodyTemplate}
                  filter
                  filterPlaceholder="Megas:"
                  filterMatchMode="contains"
                />
                <Column
                  field="comentario"
                  header="Comentario"
                  body={comentarioBodyTemplate}
                  filter
                  filterPlaceholder="Comentario:"
                  filterMatchMode="contains"
                />
                <Column
                  field="url"
                  header="Detalles"
                  body={urlBodyTemplate}
                />
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
