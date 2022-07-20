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
import "./ServerTable.css";
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
  OnlineCollection,
  ServersCollection,
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
  // [theme.breakpoints.down("sm")]: {
  //   columnSmoll: {
  //     width: "100%",
  //   },
  // },
  // [theme.breakpoints.down("md")]: {
  //   columnSmoll: {
  //     width: "30%",
  //   },
  // },
  // [theme.breakpoints.up("md")]: {
  //   columnSmoll: {
  //     width: "30%",
  //   },
  // },
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
  // sizessmall: {
  //   [theme.breakpoints.down("sm")]: {
  //     width: "100%",
  //   },
  //   [theme.breakpoints.down("md")]: {
  //     width: "25%",
  //   },
  //   [theme.breakpoints.up("md")]: {
  //     width: "30%",
  //   },
  // }
}));

export default function ServerTable(option) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedEstado, setSelectedEstado] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [selectedLimites, setSelectedLimites] = React.useState(null);
  const [selectedConProxy, setSelectedConProxy] = React.useState(null);
  const dt = React.useRef(null);
  const history = useHistory();

  // var userOnline = useTracker(() => {

  //   return OnlineCollection.find({"userId" : Meteor.userId()}).fetch();
  // });
  const statuses = ["Activo", "Inactivo"];
  const onStatusChange = (e) => {
    dt.current.filter(e.value, "estado", "equals");
    setSelectedEstado(e.value);
  };
  const domainItemTemplate = (option) => {
    return <span className={`customer-badge`} ><Chip onClick={()=>{}} color="primary" label={option} /></span>;
    // ;
  };
  const ipItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={()=>{}} color="primary" label={option} /></span>;
    // ;
  };
  const estadoItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={()=>{}} color="primary" label={option} /></span>;
    // ;
  };
  const conProxyItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={()=>{}} color="primary" label={option} /></span>;
    // ;
  };
  const estadoFilter = (
    <Dropdown
      value={selectedEstado}
      options={statuses}
      onChange={onStatusChange}
      itemTemplate={estadoItemTemplate}
      placeholder="Select"
      className="p-column-filter"
      showClear
    />
  );
  const serversRegister = useTracker(() => {
    Meteor.subscribe("servers");
    let a = [];

    ServersCollection.find({},{
      sort: { ip : -1 }
    }).map(
      (data) =>
        data &&
        a.push({
          id: data._id,
          domain: data.domain,
          // firstname:
          //   data.profile && data.profile.firstName
          //     ? data.profile.firstName
          //     : data.profile.name,
          // lastName: data.profile.lastName,
          ip: data.ip,
          estado: data.active?'Activo':'Inactivo'
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
  const connectionsCountsBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Conexiones</span>
        {rowData.connectionsCounts}
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
  const domainBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span style={{ paddingBottom: 3 }} className="p-column-title">URL</span>

        <Tooltip title={rowData.domain}>
          <Chip
            style={{ width: "100%" }}
            color="primary"
            label={rowData.domain}
          />
        </Tooltip>
      </React.Fragment>
    );
  };
  const ipBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">IP del Server</span>
        {rowData.ip}
      </React.Fragment>
    );
  };
  const estadoBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Estado del Servidor</span>
        <Chip color="primary" label={rowData.estado} />
      </React.Fragment>
    );
  };
  

  const eliminarServer = (id) => {
    ServersCollection.remove(id);
  };
  const eliminarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip
          title={"Eliminar a " + rowData.ip}
        >
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              eliminarServer(rowData.id);
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
            "Ver Detalles de " + rowData.ip
          }
        >
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              history.push("/servers/" + rowData.id);
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

        <Avatar
          className={classes.avatar}
          alt={rowData.firstName}
          src="/favicon.ico"
        />
        
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
              columnResizeMode="expand" 
                ref={dt}
                className="p-shadow-5 p-datatable-responsive-demo"
                value={serversRegister}
                paginator
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={5}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
              >
                {/* <Column field="img" header="IMG" body={thumbnailBodyTemplate} /> */}
                {/* <Column
                  field="id"
                  body={iDBodyTemplate}
                  wrap="nowrap"
                  header="ID"
                  filter
                  filterPlaceholder="ID"
                  filterMatchMode="contains"
                /> */}
                {/* <Column
                  field="id"
                  header="ID"
                  body={iDBodyTemplate}
                  filter
                  filterPlaceholder="ID"
                  filterMatchMode="contains"
                /> */}
                {/* <Column
                  field="email"
                  header="Correo"
                  body={emailBodyTemplate}
                  filter
                  filterPlaceholder="Correo"
                  filterMatchMode="contains"
                /> */}
                <Column
                  field="domain"
                  header="URL del sitio"
                  body={domainBodyTemplate}
                  filter
                  filterPlaceholder="URL"
                  filterMatchMode="contains"
                />
                <Column
                  field="ip"
                  header="IP del Servidor"
                  body={ipBodyTemplate}
                  filter
                  filterPlaceholder="IP"
                  filterMatchMode="contains"
                />
                <Column
                  field="estado"
                  header="Estado del Server"
                  body={estadoBodyTemplate}
                  filter
                  filterElement={estadoFilter}
                  // filterPlaceholder="IP"

                  // filterMatchMode="contains"
                />
                {/* <Column
                  field="connectionsCounts"
                  header="Conexiones"
                  body={connectionsCountsBodyTemplate}
                  reorderable={true}
                /> */}
                <Column field="urlReal" header="" body={urlBodyTemplate}/>

                {Meteor.user().username == "carlosmbinf" && (
                  <Column
                    field="eliminar"
                    header=""
                    body={eliminarBodyTemplate}
                  />
                )}
              </DataTable>
            </div>
          </div>
        </div>
      </Zoom>
    </>
  );
}
