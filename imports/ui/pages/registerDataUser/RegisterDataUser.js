import React, { useEffect } from "react";
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
import { Link, useParams} from "react-router-dom"; 

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./RegisterDataUser.css";
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
  RegisterDataUsersCollection,
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

export default function RegisterDataUserTable(options) {
  let { id } = useParams();
  const [open, setOpen] = React.useState(true);
  const [countRegisterDataUser, setCountRegisterDataUser] = React.useState(100);
  const classes = useStyles();
  const dt = React.useRef(null);
  const history = useHistory();
  var registerDataUserSubs;
  let usersSubs;
  useEffect(() => {
        
    return () => {
      usersSubs.stop();
      registerDataUserSubs.stop();
    }
  }, [countRegisterDataUser]);

const user = (id) =>{
return Meteor.users.findOne(id)
}
  const registroDeDatos = useTracker(() => {

    usersSubs = Meteor.subscribe("user",{},{fields:{
      'profile.firstName': 1,
      'profile.lastName': 1,
      bloqueadoDesbloqueadoPor: 1,
    }});
    usersSubs.ready();
    if (id) {
      registerDataUserSubs = Meteor.subscribe("registerDataUser", { userId: id,type: options.type },{limit: countRegisterDataUser});
    } else if (Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username)) {
      registerDataUserSubs = Meteor.subscribe("registerDataUser",{type: options.type},{limit: countRegisterDataUser});
    } else {
      let usuariosMios = Meteor.users.find({ 'bloqueadoDesbloqueadoPor': Meteor.userId() }, { fields: { 'bloqueadoDesbloqueadoPor': 1 } })
      // usuariosMios.map(element => {
      //   registerDataUserSubs = Meteor.subscribe("registerDataUser", { userId: element._id, type: options.type },{limit: countRegisterDataUser})
      // })
      registerDataUserSubs = Meteor.subscribe("registerDataUser", { userId: { $in: usuariosMios.fetch().map(element => element._id) }, type: options.type },{limit: countRegisterDataUser})
    }
    registerDataUserSubs.ready();

    let a = [];
    try {
      RegisterDataUsersCollection.find(
        (id ?
          {
            userId: id,
            type: options.type
          } :
          {
            type: options.type
          }), {
        sort: {
          fecha: -1,
        },
        limit: countRegisterDataUser
      }).map(
         (register) => {
           // Meteor.users.findOne(register.userAfectado) = await Meteor.users.findOne(register.userAfectado);
           // Meteor.users.findOne(register.userAdmin) = await Meteor.users.findOne(register.userAdmin);
           // register&&
           let b = user(register.userId);
           a.push({
             id: register._id,
             user: b && b.profile ? (b.profile.firstName + " " + b.profile.lastName) : "",
             vpnMbGastados: (register.vpnMbGastados?Number.parseFloat(
              register.vpnMbGastados / 1000000):0)
            .toFixed(2),
             megasGastadosinBytes: (register.megasGastadosinBytes?Number.parseFloat(
               register.megasGastadosinBytes / 1000000):0)
             .toFixed(2),
             createdAt: register.fecha && register.fecha.toString(),
             registro: register.register ? register.register : ""
           });
         }
       );
    } catch (error) {
       console.log(error) 
      }

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
      <React.Fragment>
        <span className="p-column-title">Fecha del Registro</span>
        {rowData.createdAt}
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
  const userBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Nombre y Apellido del Usuario</span>
        {rowData.user}
      </React.Fragment>
    );
  };
  const vpnMbGastadosBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Megas Consumidos en la VPN</span>
        {rowData.vpnMbGastados}
      </React.Fragment>
    );
  };
  const megasGastadosinBytesBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Megas Consumidos en el proxy</span>
        {rowData.megasGastadosinBytes}
      </React.Fragment>
    );
  };
  const megasGastadosinBytesGeneralBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Megas Consumidos en el Server</span>
        {rowData.megasGastadosinBytesGeneral}
      </React.Fragment>
    );
  };
const registerBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Registro</span>
        <Chip color={rowData.registro !="diario" ? "secondary" : "primary"} label={rowData.registro} />
      </React.Fragment>
    );
  };
  return (
    <>
      <Grid item style={{ textAlign: "center" }}>
        <h1>{options.type == 'vpn' ? "Registro de Datos en la VPN" : 'Registro de Datos en el Proxy'}</h1>
        <TextField
                // fullWidth
                className={classes.margin}
                id="countRegisterDataUser"
                name="countRegisterDataUser"
                label="Cantidad de Registros"
                variant="outlined"
                color="secondary"
                value={countRegisterDataUser}
                type="number"
                onInput={(e) => {
                  setCountRegisterDataUser(e.target.value?Number(e.target.value):0)
                }}
                // InputProps={{
                //   readOnly: true,
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <AccountCircleIcon />
                //     </InputAdornment>
                //   ),
                // }}
              />
      </Grid>
      
      <Zoom in={true}>
        <div style={{ width: "100%", padding: 20 }}>
          <div className="datatable-responsive-demo">
            <div className="card">
              <DataTable
                ref={dt}
                className="p-shadow-5 p-datatable-responsive-demo"
                value={registroDeDatos}
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
                {!id &&
                <Column
                  field="user"
                  header="Nombre del Usuario"
                  body={userBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />}
                {options.type == 'vpn' &&
                  <Column
                    field="vpnMbGastados"
                    header="Megas Consumidos en la VPN"
                    body={vpnMbGastadosBodyTemplate}
                    filter
                    filterPlaceholder="Search"
                    filterMatchMode="contains"
                  />}
                  {options.type != 'vpn' &&
                    <Column
                      field="megasGastadosinBytes"
                      header="Megas Consumidos en el Proxy"
                      body={megasGastadosinBytesBodyTemplate}
                      filter
                      filterPlaceholder="Search"
                      filterMatchMode="contains"
                    />}               
                
                <Column
                  field="createdAt"
                  header="Fecha del Registro"
                  body={createAtBodyTemplate}
                  filter
                  filterPlaceholder="Search"
                  filterMatchMode="contains"
                />
                <Column
                  field="registro"
                  header="Registro"
                  body={registerBodyTemplate}
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
