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
import "./UsersTableVPN.css";
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

export default function UsersTableVPN(option) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedOnline, setSelectedOnline] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState(null);
  const dt = React.useRef(null);
  const history = useHistory();
  const [selectedVPN, setSelectedVPN] = React.useState(null);
  const [selectedContandoVPN, setSelectedContandoVPN] = React.useState(null);

  const statusesContandoVPN = ["true", "false"];


  // var userOnline = useTracker(() => {

  //   return OnlineCollection.find({"userId" : Meteor.userId()}).fetch();
  // });
  const statusesVPN = ["PLUS", "2MB", "false"];
  const statuses = ["ONLINE", "DISCONECTED"];
  const statusesRole = ["admin", "user"];
  const statusesLimites = ["Ilimitado", "Megas", "Fecha"];
  const statusesConProxy = ["true", "false"];
  const onStatusChange = (e) => {
    dt.current.filter(e.value, "online", "equals");
    setSelectedOnline(e.value);
  };
  const onVPNChange = (e) => {
    dt.current.filter(e.value, "vpntype", "equals");
    setSelectedVPN(e.value);
  };
  const onRoleChange = (e) => {
    dt.current.filter(e.value, "role", "equals");
    setSelectedRole(e.value);
  };
  const onlineItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={() => { }} color="primary" label={option} /></span>;
    // ;
  };
  const onContandoVPNChange = (e) => {
    dt.current.filter(e.value, "contandoVPN", "equals");
    setSelectedContandoVPN(e.value);
  };

  const vpnItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={() => { }} color="primary" label={option} /></span>;
    // ;
  };
  const roleItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={() => { }} color="primary" label={option} /></span>;
    // ;
  };
  const contandoVPNItemTemplate = (option) => {
    return <span className={`customer-badge`}><Chip onClick={() => { }} color="primary" label={option} /></span>;
    // ;
  };
  const vpnTypeFilter = (
    <Dropdown
      value={selectedVPN}
      options={statusesVPN}
      onChange={onVPNChange}
      itemTemplate={vpnItemTemplate}
      placeholder="Select"
      className="p-column-filter"
      showClear
    />
  );
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

  const contandoVPNFilter = (
    <Dropdown
      value={selectedContandoVPN}
      options={statusesContandoVPN}
      onChange={onContandoVPNChange}
      itemTemplate={contandoVPNItemTemplate}
      placeholder="Select"
      className="p-column-filter"
      showClear
    />
  );

  const usersRegister = useTracker(() => {
    Meteor.subscribe("user", { $or: [{ vpn2mb: true }, { vpnplus: true },{"profile.role":"admin"}] });
    // Meteor.subscribe("conexiones");
    let a = [];

    Meteor.users.find(option.selector?option.selector:{}, {
      sort: { vpnMbGastados: -1, vpnip: -1, 'profile.firstName': 1, 'profile.lastName': 1 }
    }).map(
      async (data) =>
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
          foto:
              data.picture
              ? data.picture
              : "/",
          online: (data.vpnplusConnected || data.vpn2mbConnected) ? "ONLINE" : "DISCONECTED",
          username: data.username,
          creadoPor: data.creadoPor=='Server'?"Server":(data.creadoPor?(`${Meteor.users.findOne(data.creadoPor)&&Meteor.users.findOne(data.creadoPor).profile.firstName} ${Meteor.users.findOne(data.creadoPor)&&Meteor.users.findOne(data.creadoPor).profile.lastName}`):"Facebook"),
          administradoPor: data.bloqueadoDesbloqueadoPor?(Meteor.users.findOne(data.bloqueadoDesbloqueadoPor)?(`${Meteor.users.findOne(data.bloqueadoDesbloqueadoPor)&&Meteor.users.findOne(data.bloqueadoDesbloqueadoPor).profile.firstName} ${Meteor.users.findOne(data.bloqueadoDesbloqueadoPor)&&Meteor.users.findOne(data.bloqueadoDesbloqueadoPor).profile.lastName}`):"Carlos Medina"):"Carlos Medina",
          ip: data.vpnip?`192.168.18.${data.vpnip}`:"",
          vpntype: data.vpnplus ? "PLUS" : (data.vpn2mb ? "2MB" : "false"),
          vpnMbGastados: data.vpnMbGastados,
          vpnmegas: data.vpnmegas,
          contandoVPN: data.contandoVPN,
          vpnfechaSubscripcion: data.vpnfechaSubscripcion,
          vpnisIlimitado: data.vpnisIlimitado


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

  const vpnTypeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">VPN TYPE</span>
        <Chip color={rowData.vpntype =="false" ? "secondary" : "primary"} label={rowData.vpntype == "false" ? <BlockIcon /> : rowData.vpntype} />
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
  const ipTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">IP</span>
        {rowData.ip}
      </React.Fragment>
    );
  };
  const vpnMegasGastadosTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Megas Gastados</span>
        {rowData.vpnMbGastados?(rowData.vpnMbGastados/1000000).toFixed(2):0} MB
      </React.Fragment>
    );
  };
  const vpnpmegasTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Limite de Megas</span>
        {rowData.vpnisIlimitado
                                  ? rowData.vpnfechaSubscripcion
                                    ? dateFormat(
                                      new Date(rowData.vpnfechaSubscripcion),
                                      "yyyy-mm-dd",
                                      true,
                                      true
                                    )
                                    : "N/A"
                                  : rowData.vpnmegas
                                    ? rowData.vpnmegas + " MB"
                                    : "N/A"}
      </React.Fragment>
    );
  };
  const contandoVPNBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Contando VPN</span>
        <Chip color={rowData.contandoVPN ? "primary" : "secondary"} label={rowData.contandoVPN ? <CheckIcon /> : <BlockIcon />} />
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
                {/* <Column
                  field="creadoPor"
                  header="Creado Por"
                  body={creadoPorTemplate}
                  filter
                  filterPlaceholder="Creado Por:"
                  filterMatchMode="contains"
                /> */}
                {Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username) && (
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
                  field="vpntype"
                  header="VPN Type"
                  body={vpnTypeBodyTemplate}
                  filter
                  filterElement={vpnTypeFilter}
                />
                <Column
                  field="contandoVPN"
                  header="Contando VPN"
                  body={contandoVPNBodyTemplate}
                  filter
                  filterElement={contandoVPNFilter}
                />
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
                  field="ip"
                  header="IP"
                  body={ipTemplate}
                  filter
                  filterPlaceholder="IP:"
                  filterMatchMode="contains"
                />
                <Column
                  field="vpnMbGastados"
                  header="Megas Gastados"
                  body={vpnMegasGastadosTemplate}
                />
                <Column
                  field="vpnpmegas"
                  header="Limites de Megas"
                  body={vpnpmegasTemplate}
                  filter
                  filterPlaceholder="Limites de Megas:"
                  filterMatchMode="contains"
                />
                {Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username) && (
                <Column field="urlReal" header="" body={urlBodyTemplate} />
                )}
                {Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username) && (
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
