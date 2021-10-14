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
import "./UsersTable.css";
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

export default function UsersTable(option) {
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
  const statuses = ["ONLINE", "DISCONECTED"];
  const statusesRole = ["admin", "user"];
  const statusesLimites = ["Ilimitado", "Megas", "Fecha"];
  const statusesConProxy = ["true", "false"];
  const onStatusChange = (e) => {
    dt.current.filter(e.value, "online", "equals");
    setSelectedOnline(e.value);
  };
  const onRoleChange = (e) => {
    dt.current.filter(e.value, "role", "equals");
    setSelectedRole(e.value);
  };
  const onLimitesChange = (e) => {
    dt.current.filter(e.value, "limites", "equals");
    setSelectedLimites(e.value);
  };
  const onConProxyChange = (e) => {
    dt.current.filter(e.value, "conProxy", "equals");
    setSelectedConProxy(e.value);
  };
  const onlineItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={() => { }} color="primary" label={option} /></span>;
    // ;
  };
  const roleItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={() => { }} color="primary" label={option} /></span>;
    // ;
  };
  const limitesItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={() => { }} color="primary" label={option} /></span>;
    // ;
  };
  const conProxyItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={() => { }} color="primary" label={option} /></span>;
    // ;
  };
  const onlineFilter = (
    <Dropdown
      value={selectedOnline}
      options={statuses}
      onChange={onStatusChange}
      itemTemplate={onlineItemTemplate}
      placeholder="Select"
      className="p-column-filter"
      showClear
    />
  );
  const roleFilter = (
    <Dropdown
      value={selectedRole}
      options={statusesRole}
      onChange={onRoleChange}
      itemTemplate={roleItemTemplate}
      placeholder="Select a Role"
      className="p-column-filter"
      showClear
    />
  );
  const limitesFilter = (
    <Dropdown
      value={selectedLimites}
      options={statusesLimites}
      onChange={onLimitesChange}
      itemTemplate={limitesItemTemplate}
      placeholder="Select a Limit"
      className="p-column-filter"
      showClear
    />
  );
  const conProxyFilter = (
    <Dropdown
      value={selectedConProxy}
      options={statusesConProxy}
      onChange={onConProxyChange}
      itemTemplate={conProxyItemTemplate}
      placeholder="Select"
      className="p-column-filter"
      showClear
    />
  );
  const usersRegister = useTracker(() => {
    Meteor.subscribe("user");
    Meteor.subscribe("conexiones");
    let a = [];

    Meteor.users.find(option.selector?option.selector:{}, {
      sort: { megasGastadosinBytes: -1, 'profile.firstName': 1, 'profile.lastName': 1 }
    }).map(
      (data) =>
        data &&
        a.push({
          id: data._id,
          email: data.emails[0].address,
          // firstname:
          //   data.profile && data.profile.firstName
          //     ? data.profile.firstName
          //     : data.profile.name,
          // lastName: data.profile.lastName,
          name:
            data.profile && data.profile.firstName
              ? data.profile.firstName + " " + data.profile.lastName
              : data.profile.name,
          role: data.profile.role,
          edad: data.edad,
          foto:
            data.services &&
              data.services.facebook &&
              data.services.facebook.picture.data.url
              ? data.services.facebook.picture.data.url
              : "/",
          online:
            OnlineCollection.find({ userId: data._id }).count() > 0
              ? "ONLINE"
              : "DISCONECTED",
          username: data.username,
          creadoPor: data.creadoPor=='Server'?"Server":(data.creadoPor?(`${Meteor.users.findOne(data.creadoPor)&&Meteor.users.findOne(data.creadoPor).profile.firstName} ${Meteor.users.findOne(data.creadoPor)&&Meteor.users.findOne(data.creadoPor).profile.lastName}`):"Facebook"),
          administradoPor: data.bloqueadoDesbloqueadoPor?(Meteor.users.findOne(data.bloqueadoDesbloqueadoPor)?(`${Meteor.users.findOne(data.bloqueadoDesbloqueadoPor)&&Meteor.users.findOne(data.bloqueadoDesbloqueadoPor).profile.firstName} ${Meteor.users.findOne(data.bloqueadoDesbloqueadoPor)&&Meteor.users.findOne(data.bloqueadoDesbloqueadoPor).profile.lastName}`):"Carlos Medina"):"Carlos Medina",
          conProxy: !data.baneado,
          megasGastadosinBytes: data.megasGastadosinBytes,
          megasGastadosinBytesGeneral: data.megasGastadosinBytesGeneral,
          connectionsCounts: OnlineCollection.find({ userId: data._id }).count(),
          limites: data.profile.role == 'admin' ? 'Ilimitado' : (data.isIlimitado ? "Fecha" : "Megas"),
          limiteData: data.profile.role == 'admin' ? 'Ilimitado' : (data.isIlimitado ? (data.fechaSubscripcion ? (dateFormat(
            new Date(data.fechaSubscripcion),
            "yyyy-mm-dd",
            true,
            true
          )) : 'N/A') : (data.megas ? `${data.megas} MB` : 'N/A'))
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
  const limiteDataBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Datos del Límite</span>
        {rowData.limiteData}
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
  const limitesBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Tipo de Limite</span>
        <Chip color="primary" label={rowData.limites} />
      </React.Fragment>
    );
  };
  const limiteBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Tipo de Limite</span>
        <Chip color="primary" label={rowData.limite} />
      </React.Fragment>
    );
  };
  const nombreBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Nombre y Apellidos</span>
        {rowData.name}
      </React.Fragment>
    );
  };
  const usernameBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Username</span>
        {rowData.username}
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
  const creadoPorTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Creado por:</span>
        {rowData.creadoPor}
      </React.Fragment>
    );
  };
  const administradoPorTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Administrado por:</span>
        {rowData.administradoPor}
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
  const onlineBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">ONLINE</span>
        <Chip
          color="primary"
          label={rowData.online}
        />
      </React.Fragment>
    );
  };
  const conProxyBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Con Proxy</span>
        <Chip color={rowData.conProxy ? "primary" : "secondary"} label={rowData.conProxy ? <CheckIcon /> : <BlockIcon />} />
      </React.Fragment>
    );
  };
  const megasGastadosinBytesTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Megas Gastados por el Cliente</span>
        {rowData.megasGastadosinBytes
          ? Number.parseFloat(rowData.megasGastadosinBytes / 1000000).toFixed(2) + ' MB'
          : "0"}
      </React.Fragment>
    );
  };
  const megasGastadosinBytesGeneralTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Megas Gastados en el Servidor</span>
        {rowData.megasGastadosinBytesGeneral
          ? Number.parseFloat(rowData.megasGastadosinBytesGeneral / 1000000).toFixed(2) + ' MB'
          : "0"}
      </React.Fragment>
    );
  };


  const eliminarUser = (id) => {
    Meteor.users.remove(id);
  };
  const eliminarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip
          title={"Eliminar a " + rowData.name}
        >
          <IconButton
            disabled
            aria-label="delete"
            color="primary"
            onClick={() => {
              eliminarUser(rowData.id);
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
            "Ver Detalles de " + rowData.name
          }
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
        {rowData.online == "ONLINE" ? (
          <StyledBadge
            overlap="circle"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            <Avatar
              className={classes.avatar}
              alt={rowData.firstName}
              src={rowData.foto}
            />
          </StyledBadge>
        ) : (
          <Avatar
            className={classes.avatar}
            alt={rowData.firstName}
            src={rowData.foto}
          />
        )}

        {/* <img
          src={rowData.services.facebook.picture.data.url}
          alt="N/A"
          width="100%"
        /> */}
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
                value={usersRegister}
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
                <Column field="img" header="IMG" body={thumbnailBodyTemplate} />
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
                  field="name"
                  header="Nombre"
                  body={nombreBodyTemplate}
                  filter
                  filterPlaceholder="Nombre y Apellidos"
                  filterMatchMode="contains"
                />
                {/* <Column
                  field="email"
                  header="Correo"
                  body={emailBodyTemplate}
                  filter
                  filterPlaceholder="Correo"
                  filterMatchMode="contains"
                /> */}
                <Column
                  field="username"
                  header="UserName"
                  body={usernameBodyTemplate}
                  filter
                  filterPlaceholder="UserName"
                  filterMatchMode="contains"
                />
                <Column
                  field="creadoPor"
                  header="Creado Por"
                  body={creadoPorTemplate}
                  filter
                  filterPlaceholder="Creado Por:"
                  filterMatchMode="contains"
                />
                {Meteor.user().username == "carlosmbinf" && (
                <Column
                  field="administradoPor"
                  header="Administrado Por"
                  body={administradoPorTemplate}
                  filter
                  filterPlaceholder="Creado Por:"
                  filterMatchMode="contains"
                />
                )}
                <Column
                  field="online"
                  header="ONLINE"
                  body={onlineBodyTemplate}
                  filter
                  filterElement={onlineFilter}
                />
                <Column
                  field="role"
                  header="Roles"
                  body={roleBodyTemplate}
                  filter
                  filterElement={roleFilter}
                />
                <Column
                  field="conProxy"
                  header="Proxy"
                  body={conProxyBodyTemplate}
                  filter
                  filterElement={conProxyFilter}
                />
                <Column
                  field="limites"
                  header="Tipo de Limite"
                  body={limitesBodyTemplate}
                  filter
                  filterElement={limitesFilter}
                />
                <Column
                  field="megasGastadosinBytes"
                  header="Megas x Cliente"
                  body={megasGastadosinBytesTemplate}
                  reorderable={true}
                />
                {/* <Column
                field="megasGastadosinBytesGeneral"
                header="Megas x Server"
                body={megasGastadosinBytesGeneralTemplate}
                reorderable={true}
              /> */}
                <Column
                  field="connectionsCounts"
                  header="Conexiones"
                  body={connectionsCountsBodyTemplate}
                  reorderable={true}
                />
                <Column
                  field="limiteData"
                  header="Datos del Límite"
                  body={limiteDataBodyTemplate}
                  reorderable={true}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column field="urlReal" header="" body={urlBodyTemplate} />

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
