import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  Paper,
  Box,
  Grid,
  Icon,
  Divider,
  Zoom,
  IconButton,
  Switch,
  FormControl,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  FormControlLabel,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
} from "@material-ui/core";

import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import {
  ServersCollection,
  VentasCollection,
  PreciosCollection,
  MensajesCollection,
} from "../collections/collections";
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";
import DataUsageIcon from "@material-ui/icons/DataUsage";
var dateFormat = require("dateformat");

import {
  OnlineCollection,
  LogsCollection,
  RegisterDataUsersCollection,
} from "../collections/collections";
import { Alert, Autocomplete } from "@material-ui/lab";
import DashboardInit from "../dashboard/DashboardInit";
import GraphicsLinealConsumoMegasXMeses from "../dashboard/GraphicsLinealConsumoMegasXMeses";
import GraphicsLinealConsumoMegasXDias from "../dashboard/GraphicsLinealConsumoMegasXDias";
import GraphicsLinealConsumoMegasXHoras from "../dashboard/GraphicsLinealConsumoMegasXHoras";

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
  root: {
    borderRadius: 20,
    padding: "2em",
    borderColor: "#f50057",
    borderWidth: 13,
    borderStyle: "groove",
    margin: 20,
  },
  primary: {
    // minWidth: 370,
    width: "100%",
    borderRadius: 20,
    padding: "2em",
    background:
      // "linear-gradient(0deg, rgba(36,83,162,1) 15%, rgba(245,0,87,0) 100%)",
      "#3f4b5b",
    color: "#ffffff9c",
  },
  boton: {
    borderRadius: 20,
    padding: 0,
  },
  rootADD: {
    minWidth: 275,
    maxWidth: 275,
    borderRadius: 20,
    padding: "2em",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  createUsers: {
    color: "#114c84",
  },
  link: {
    borderRadius: 20,
    textDecoration: "none",
    color: "#8b8b8b",
    fontSize: 16,
    fontWeight: "bold",
  },
  root2: {
    display: "flex",
    alignItems: "center",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  padding10: {
    margin: "13px 0",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  drawerItem: {
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 5),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  margin: {
    margin: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function UserCardDetails() {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  var [edit, setEdit] = useState(false);
  var [editPassword, setEditPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [edad, setEdad] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [ip, setIP] = useState("");
  const [searchIP, setSearchIP] = useState("");
  const [searchPrecio, setSearchPrecio] = useState("");
  const [searchPrecioVPN, setSearchPrecioVPN] = useState("");
  const [searchAdmin, setSearchAdmin] = useState("");
  const [megas, setMegas] = useState();
  const [mensaje, setMensaje] = useState("");

  const [openAlert, setOpenAlert] = React.useState(false);

  const handleClickAlertOpen = () => {
    setOpenAlert(true);
  };
  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  const { id } = useParams();
  const bull = <span className={classes.bullet}>•</span>;

  const tieneVentas = useTracker(() => {
    Meteor.subscribe(
      "ventas",
      { adminId: id },
      {
        fields: {
          _id: 1,
          adminId: 1,
        },
      }
    );
    // console.log(VentasCollection.find({ adminId: id}).fetch());
    // console.log(VentasCollection.find({ adminId: id }).count() > 0);
    return VentasCollection.find({ adminId: id }).count() > 0;
  });

  const users = useTracker(() => {
    Meteor.subscribe("userID", id);
    return Meteor.users.findOne({ _id: id });
  });

  const creadoPor = useTracker(() => {
    users &&
      (users.creadoPor
        ? Meteor.subscribe("userID", users.creadoPor, {
            fields: {
              _id: 1,
              adminId: 1,
            },
          })
        : Meteor.subscribe(
            "users",
            { username: Meteor.settings.public.administradores[0] },
            {
              fields: {
                _id: 1,
                adminId: 1,
              },
            }
          ));
    return users && users.creadoPor
      ? Meteor.users.findOne(
          { _id: users.creadoPor },
          {
            fields: {
              _id: 1,
              adminId: 1,
            },
          }
        )
      : Meteor.users.findOne(
          { username: Meteor.settings.public.administradores[0] },
          {
            fields: {
              _id: 1,
              adminId: 1,
            },
          }
        );
  });

  const servers = useTracker(() => {
    Meteor.subscribe("servers").ready();

    return ServersCollection.find(
      { active: true },
      {
        fields: {
          ip: 1,
        },
      }
    )
      .fetch();
  });

  const preciosList = useTracker(() => {
    Meteor.subscribe(
      "precios",
      { userId: Meteor.userId(), type: "megas" },
      {
        fields: {
          userId: 1,
          type: 1,
          megas: 1,
          precio: 1,
        },
      }
    );
    let precioslist = [];
    PreciosCollection.find(
      { userId: Meteor.userId(), type: "megas" },
      {
        fields: {
          megas: 1,
          precio: 1,
        },
        sort: { precio: 1 },
      }
    )
      .fetch()
      .map((a) => {
        precioslist.push({
          value: a.megas,
          label:
            a.megas +
            "MB • $" +
            (a.precio >= 0
              ? a.precio
              : 0),
        });
      });
    return precioslist;
  });

  const admins = useTracker(() => {
    Meteor.subscribe(
      "user",
      { "profile.role": "admin" },
      {
        fields: {
          _id: 1,
          username: 1,
          profile: 1,
        },
      }
    ).ready();
    let administradores = [];
    Meteor.users
      .find({ "profile.role": "admin" },{fields: {username: 1}})
      .fetch()
      .map((a) => {
        // admins.push({ value: a._id , text: `${a.profile.firstName} ${a.profile.lastName}`})
        administradores.push(a.username);
      });

    return administradores;
  });

  const registroDeDatosConsumidos = useTracker(() => {
    Meteor.subscribe(
      "registerDataUser",
      { userId: id },
      {
        fields: {
          _id: 1,
          userId: 1,
        },
      }
    );

    return RegisterDataUsersCollection.find(
      { userId: id },
      {
        fields: {
          _id: 1,
          userId: 1,
        },
      }
    ).fetch();
  });

  const preciosVPNList = useTracker(() => {
    Meteor.subscribe(
      "user",
      { vpnip: { $exists: true, $ne: null } },
      {
        fields: {
          _id: 1,
          vpnip: 1,
          profile: 1,
        },
        sort: {
          precio: 1,
        },
      }
    ).ready();
    // Meteor.subscribe("precios",{$or:[{ type: "vpnplus"},{ type: "vpn2mb"}] }).ready()
    Meteor.subscribe(
      "precios",
      {
        userId: Meteor.userId(),
        $or: [{ type: "vpnplus" }, { type: "vpn2mb" }],
      },
      {
        fields: {
          userId: 1,
          type: 1,
          megas: 1,
          precio: 1,
        },
      }
    );
    let precioslist = [];
    PreciosCollection.find(
      {
        userId: Meteor.userId(),
        $or: [{ type: "vpnplus" }, { type: "vpn2mb" }],
      },
      {
        fields: {
          userId: 1,
          type: 1,
          megas: 1,
          precio: 1,
        },
        sort: {
          precio: 1,
        },
      }
    )
      .fetch()
      .map((a) => {
        precioslist.push({
          value: `${a.type}/${a.megas}`,
          label: `${a.type} • ${a.megas}MB • $ ${
            a.precio >= 0
              ? a.precio 
              : 0
          }`,
        });
      });
    return precioslist;
  });

  // const precios = useTracker(() => {
  //   Meteor.subscribe("precios")

  //   return PreciosCollection.find().fetch();
  // });

  const eliminarUser = async (id) => {
    await LogsCollection.find({
      $or: [{ userAdmin: id }, { userAfectado: id }],
    }).map((element) => LogsCollection.remove(element._id));
    await RegisterDataUsersCollection.find({ userId: id }).map((element) =>
      RegisterDataUsersCollection.remove(element._id)
    );
    await VentasCollection.find({
      $or: [{ userId: id }, { userAfectado: id }],
    }).map((element) => VentasCollection.remove(element._id));
    await MensajesCollection.find({ $or: [{ from: id }, { to: id }] }).map(
      (element) => MensajesCollection.remove(element._id)
    );

    await Meteor.users.remove(id);
    setOpenAlert(false);
    alert("Usuario Eliminado");

    history.push("/users");
  };

  function handleChangePasswordSubmit(event) {
    event.preventDefault();
    // console.log( 'Email:', email, 'Password: ', password, 'firstName: ', firstName);

    // You should see email and password in console.
    // ..code to submit form to backend here...

    async function changePassword() {
      oldPassword == password
        ? $.post("/userpass", { id: users._id, password: password })
            .done(function (data) {
              alert("Contraseña Cambiada");
            })
            .fail(function (data) {
              alert(
                "Ocurrió un Problema al cambiar la contraseña!, reintentelo mas tarde"
              );
            })
        : alert("La Contraseña no Coincide");
    }

    (oldPassword || password) && changePassword();
    firstName &&
      Meteor.users.update(Meteor.userId(), {
        $set: { "profile.firstName": firstName },
      });
    lastName &&
      Meteor.users.update(Meteor.userId(), {
        $set: { "profile.lastName": lastName },
      });
    edad && Meteor.users.update(Meteor.userId(), { $set: { edad: edad } });
    username &&
      Meteor.users.update(Meteor.userId(), { $set: { username: username } });
    email &&
      Meteor.users.update(Meteor.userId(), {
        $set: { "emails.0.address": email },
      });
  }

  async function handleLimiteManual(event) {
    event.preventDefault();

    // You should see email and password in console.
    // ..code to submit form to backend here...
    try {
      megas >= 0
        ? await Meteor.users.update(users._id, { $set: { megas: megas } })
        : console.log("no se inserto nada");
      await Meteor.call(
        "registrarLog",
        "Megas",
        users._id,
        Meteor.userId(),
        `Ha sido Cambiado el consumo de Datos a: ${megas}MB`
      );
      // Meteor.call('sendemail', users,{text: `Ha sido Cambiado el consumo de Datos a: ${megas}MB`}, 'Megas')
    } catch (error) {}
  }
  const handleEdit = (event) => {
    setEdit(!edit);
  };
  
  const handleChangeStatusSubscripcion = (event) => {
    try{
      Meteor.call("changeStatusSubscripcion", users._id, Meteor.userId());
      alert("Se cambio el estado de la subscripcion")
    }catch(error){
      alert("Error al cambiar el estado de la subscripcion")
      console.log(error)
    }
  };
  const handleEnviarReporteAudio = (event) => {
    
    try{
      !users.enviarReporteAudio ? alert("Ahora se enviaran los reportes de audio") : alert("Ahora dejara de enviarse los reportes de audio")
      Meteor.users.update(users._id, {
        $set: {
          "enviarReporteAudio": !users.enviarReporteAudio,
        },
      });
      
    }catch(error){
      alert("Error al cambiar el estado de la subscripcion")
      console.log(error)
    }
  };
  
  const handleEditPassword = (event) => {
    setEditPassword(!editPassword);
  };
  const handleChange = (event) => {
    Meteor.users.update(users._id, {
      $set: {
        "profile.role": users.profile.role == "admin" ? "user" : "admin",
      },
    });
  };
  const handleReiniciarConsumo = async (event) => {
    console.log("INICIO");
    await Meteor.call("guardarDatosConsumidosByUserPROXYHoras", users);
    await Meteor.call("reiniciarConsumoDeDatosPROXY", users);
    await Meteor.call("desactivarUserProxy", users);

    await Meteor.call(
      "registrarLog",
      "Reinicio PROXY",
      users._id,
      Meteor.userId(),
      `Ha sido Reiniciado el consumo de Datos del PROXY de ${users.profile.firstName} ${users.profile.lastName} y desactivado el proxy`
    );

    // Meteor.call('sendemail', users, { text: `Ha sido Reiniciado el consumo de Datos del PROXY de ${users.profile.firstName} ${users.profile.lastName}` }, 'Reinicio ' + Meteor.user().username)
    await Meteor.call(
      "sendMensaje",
      users,
      {
        text: `Ha sido Reiniciado el consumo de Datos del PROXY, y desactivado el proxy`,
      },
      "Reinicio " + Meteor.user().username
    );

    alert("Se reinicio los datos del PROXY de " + users.profile.firstName);
  };

  const handleReiniciarConsumoVPN = async (event) => {
    await Meteor.call("guardarDatosConsumidosByUserVPNHoras", users);
    await Meteor.call("reiniciarConsumoDeDatosVPN", users);
    await Meteor.call("desactivarUserVPN", users);
    await Meteor.call(
      "registrarLog",
      "Reinicio VPN",
      users._id,
      Meteor.userId(),
      `Ha sido Reiniciado el consumo de Datos de la VPN de ${users.profile.firstName} ${users.profile.lastName}`
    );
    // Meteor.call('sendemail', users, { text: `Ha sido Reiniciado el consumo de Datos de la VPN de ${users.profile.firstName} ${users.profile.lastName}` }, 'Reinicio ' + Meteor.user().username)
    await Meteor.call(
      "sendMensaje",
      users,
      { text: `Ha sido Reiniciado el consumo de Datos de la VPN` },
      "Reinicio " + Meteor.user().username
    );

    alert("Se reinicio los datos de la VPN de " + users.profile.firstName);
  };

  const handleVPNStatus = (event) => {
    let validacion = false;

    users.vpnisIlimitado &&
      new Date() < new Date(users.vpnfechaSubscripcion) &&
      (validacion = true);
    !users.vpnisIlimitado &&
      (users.vpnMbGastados ? users.vpnMbGastados / 1024000 : 0) <
        (users.vpnmegas ? users.vpnmegas : 0) &&
      (validacion = true);

    !validacion &&
      (setMensaje("Revise los Límites del Usuario"), handleClickOpen());
    // validacion = ((users.profile.role == "admin") ? true  : false);
    if (!validacion) return null;

    // console.log("COMPRA")
    // console.log(preciosVPNList.find(element=>{
    //   return element.type == compra.value.split("/")[0]
    // }));

    Meteor.call("addVentasVPN", users._id, Meteor.userId(), (error, result) => {
      if (error) {
        setMensaje(error.message);
        handleClickOpen();
      } else {
        result && setMensaje(result);
        result && handleClickOpen();
      }
    });
  };

  const addVenta = () => {
    // console.log(`Precio MEGAS ${precios}`);
    let validacion = false;

    users.isIlimitado &&
      new Date() < new Date(users.fechaSubscripcion) &&
      (validacion = true);
    !users.isIlimitado &&
      (users.megasGastadosinBytes ? users.megasGastadosinBytes / 1024000 : 0) <
        (users.megas ? users.megas : 0) &&
      (validacion = true);

    !validacion &&
      (setMensaje("Revise los Límites del Usuario"), handleClickOpen());

    if (!validacion) return null;

    Meteor.call(
      "addVentasProxy",
      users._id,
      Meteor.userId(),
      (error, result) => {
        if (error) {
          setMensaje(error.message);
          handleClickOpen();
        } else {
          result && setMensaje(result);
          result && handleClickOpen();
        }
      }
    );
  };
  const handleChangebaneado = (event) => {
    addVenta();
  };
  const handleChangecontandoProxy = (event) => {
    Meteor.users.update(users._id, {
      $set: {
        contandoProxy: !users.contandoProxy,
      },
    });
  };
  const handleChangecontandoVPN = (event) => {
    Meteor.users.update(users._id, {
      $set: {
        contandoVPN: !users.contandoVPN,
      },
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={classes.drawerHeader}>
        <IconButton
          color="primary"
          aria-label="delete"
          className={classes.margin}
          onClick={() => {
            history.goBack();
          }}
        >
          <ArrowBackIcon fontSize="large" color="secondary" />
        </IconButton>
      </div>
      <Dialog
        open={openAlert}
        // onClose={handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alerta!!!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Usted desea eliminar el usuario ${
              users && users.profile && users.profile.firstName
            } ${
              users && users.profile && users.profile.lastName
            } y sus datos correspondientes?`}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              eliminarUser(users._id);
            }}
            color="secondary"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open}>
        <DialogTitle>Atención!!!</DialogTitle>
        <DialogContent>
          <DialogContentText>{mensaje}</DialogContentText>
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            // type="email"
            fullWidth
            variant="standard"
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
      <div className={classes.drawerItem}>
        {users && (
          <Zoom in={true}>
            <>
              <Paper elevation={5} className={classes.primary}>
                <Grid container spacing={3}>
                  {edit ? (
                    <>
                      <Grid item xs={12}>
                        <Grid container direction="row" justify="center">
                          <Avatar
                            className={classes.large}
                            alt={
                              users.profile.firstName
                                ? users.profile.firstName
                                : users.profile.name
                            }
                            src={users.picture ? users.picture : "/"}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            {" "}
                            <Divider className={classes.padding10} />
                          </Grid>

                          <Grid container className={classes.margin}>
                            Datos Personales
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <FormControl variant="outlined">
                              <TextField
                                fullWidth
                                className={classes.margin}
                                id="firstName"
                                name="firstName"
                                label="Nombre"
                                variant="outlined"
                                color="secondary"
                                value={users.profile.firstName}
                                onInput={(e) =>
                                  Meteor.users.update(users._id, {
                                    $set: {
                                      "profile.firstName": e.target.value,
                                    },
                                  })
                                }
                                InputProps={{
                                  readOnly: true,
                                  // startAdornment: (
                                  //   <InputAdornment position="start">
                                  //     <AccountCircleIcon />
                                  //   </InputAdornment>
                                  // ),
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={4} lg={3}>
                            <FormControl variant="outlined">
                              <TextField
                                fullWidth
                                className={classes.margin}
                                id="lastName"
                                name="lastName"
                                label="Apellidos"
                                variant="outlined"
                                color="secondary"
                                value={users.profile.lastName}
                                onInput={(e) =>
                                  Meteor.users.update(users._id, {
                                    $set: {
                                      "profile.lastName": e.target.value,
                                    },
                                  })
                                }
                                InputProps={{
                                  readOnly: true,
                                  // startAdornment: (
                                  //   <InputAdornment position="start">
                                  //     <AccountCircleIcon />
                                  //   </InputAdornment>
                                  // ),
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid container className={classes.margin}>
                          Datos del Usuario
                        </Grid>
                        <Grid
                          container
                          // spacing={3}
                          style={{ paddingBottom: 20 }}
                        >
                          <Grid item xs={12} lg={3}>
                            <FormControl variant="outlined">
                              <TextField
                                fullWidth
                                className={classes.margin}
                                id="email"
                                name="email"
                                label="Email"
                                variant="outlined"
                                color="secondary"
                                type="email"
                                value={
                                  users.emails &&
                                  users.emails[0] &&
                                  users.emails[0].address
                                }
                                onInput={(e) => {
                                  e.target.value == ""
                                    ? Meteor.users.update(
                                        { _id: users._id },
                                        {
                                          $set: { emails: [{}] },
                                        }
                                      )
                                    : Meteor.users.update(
                                        { _id: users._id },
                                        {
                                          $set: {
                                            emails: [
                                              { address: e.target.value },
                                            ],
                                          },
                                        }
                                      );
                                }}
                                InputProps={{
                                  readOnly:
                                    Meteor.user() &&
                                    Meteor.user().profile &&
                                    Meteor.user().profile.role == "user",
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AccountCircleIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} lg={3}>
                            <FormControl variant="outlined">
                              <TextField
                                fullWidth
                                className={classes.margin}
                                id="username"
                                name="username"
                                label="Nombre de Usuario"
                                variant="outlined"
                                color="secondary"
                                type="text"
                                value={users.username}
                                onInput={(e) =>
                                  Meteor.users.update(users._id, {
                                    $set: { username: e.target.value },
                                  })
                                }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AccountCircleIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </FormControl>
                          </Grid>

                          {(Array(
                            Meteor.settings.public.administradores
                          )[0].includes(Meteor.user().username) ||
                            Meteor.user().profile.role == "admin") && (
                            <Grid item xs={12}>
                              <Divider className={classes.padding10} />
                              <Grid container className={classes.margin}>
                                Enviar Reporte
                              </Grid>
                              <Button
                                color={
                                  users.enviarReporteAudio
                                    ? "secondary"
                                    : "primary"
                                }
                                variant="contained"
                                onClick={handleEnviarReporteAudio}
                              >
                                {users.enviarReporteAudio
                                  ? "INHABILITAR"
                                  : "HABILITAR"}
                              </Button>
                            </Grid>
                          )}

                          {(Array(
                            Meteor.settings.public.administradores
                          )[0].includes(Meteor.user().username) ||
                            Meteor.user().profile.role == "admin") && (
                            <Grid item xs={12}>
                              <Divider className={classes.padding10} />
                              <Grid container className={classes.margin}>
                                Servicio de Peliculas
                              </Grid>
                              <Button
                                color={
                                  users.subscipcionPelis
                                    ? "secondary"
                                    : "primary"
                                }
                                variant="contained"
                                onClick={handleChangeStatusSubscripcion}
                              >
                                {users.subscipcionPelis
                                  ? "INHABILITAR"
                                  : "HABILITAR"}
                              </Button>
                            </Grid>
                          )}

                          <Grid item xs={12}>
                            <Divider className={classes.padding10} />
                            <Grid container className={classes.margin}>
                              Contraseña
                            </Grid>
                            <Button
                              color={editPassword ? "secondary" : "primary"}
                              variant="contained"
                              onClick={handleEditPassword}
                            >
                              {editPassword ? "Cancelar" : "Cambiar"}
                            </Button>
                          </Grid>

                          {editPassword && (
                            <form
                              action="/hello"
                              method="post"
                              className={classes.root}
                              onSubmit={handleChangePasswordSubmit}
                              // noValidate
                              autoComplete="true"
                            >
                              <Grid item xs={12} sm={10}>
                                <FormControl
                                  fullWidth
                                  required
                                  variant="outlined"
                                >
                                  <TextField
                                    fullWidth
                                    required
                                    className={classes.margin}
                                    id="oldpassword"
                                    name="oldpassword"
                                    label="Nueva Contraseña"
                                    variant="outlined"
                                    color="secondary"
                                    type="password"
                                    value={oldPassword}
                                    onInput={(e) =>
                                      setOldPassword(e.target.value)
                                    }
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <AccountCircleIcon />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </FormControl>
                              </Grid>

                              <Grid item xs={12} sm={10}>
                                <FormControl
                                  fullWidth
                                  required
                                  variant="outlined"
                                >
                                  <TextField
                                    fullWidth
                                    required
                                    className={classes.margin}
                                    id="password"
                                    name="password"
                                    label="Confirmar Contraseña"
                                    variant="outlined"
                                    color="secondary"
                                    type="password"
                                    value={password}
                                    onInput={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <AccountCircleIcon />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} className={classes.flex}>
                                <Button
                                  variant="contained"
                                  type="submit"
                                  color="secondary"
                                >
                                  <SendIcon />
                                  Send
                                </Button>
                              </Grid>
                            </form>
                          )}

                          {
                            // Meteor.user().profile.role == "admin" &&
                            //   (!(users.profile.role == "admin") || Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username)) &&
                            (Array(
                              Meteor.settings.public.administradores
                            )[0].includes(Meteor.user().username) ||
                              Meteor.user().profile.role == "admin") && (
                              <>
                                <Grid item xs={12} className={classes.margin}>
                                  <Divider className={classes.padding10} />
                                  PROXY
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  lg={5}
                                  style={{
                                    // textAlign: "center",
                                    paddingTop: 20,
                                    paddingBottom: 30,
                                  }}
                                >
                                  <Tooltip
                                    title={
                                      !users.contandoProxy
                                        ? "Si lo activa, Empezará a contar los datos consumidos por el PROXY"
                                        : "Si lo desactiva, No contará los datos consumidos por el PROXY"
                                    }
                                  >
                                    <Button
                                      onClick={handleChangecontandoProxy}
                                      variant="contained"
                                      color={
                                        users.contandoProxy
                                          ? "secondary"
                                          : "primary"
                                      }
                                    >
                                      {!users.contandoProxy
                                        ? "Activar el conteo del Proxy"
                                        : "Desactivar el conteo del Proxy"}
                                    </Button>
                                  </Tooltip>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    alignItems: "center",
                                  }}
                                >
                                  <FormControlLabel
                                    control={
                                      <Tooltip
                                        title={
                                          users.isIlimitado
                                            ? "Cambiar consumo por MB"
                                            : "Cambiar consumo por Fecha"
                                        }
                                      >
                                        <Switch
                                          checked={users.isIlimitado}
                                          onChange={() => {
                                            Meteor.users.update(users._id, {
                                              $set: {
                                                isIlimitado: !users.isIlimitado,
                                              },
                                            });
                                          }}
                                          name="Ilimitado"
                                          color={
                                            users.isIlimitado
                                              ? "secondary"
                                              : "primary"
                                          }
                                        />
                                      </Tooltip>
                                    }
                                    label={
                                      users.isIlimitado
                                        ? ` ${
                                            PreciosCollection.findOne({
                                              type: "fecha-proxy",
                                            })
                                              ? `Limitado por Fecha ($${
                                                  PreciosCollection.findOne({
                                                    type: "fecha-proxy",
                                                  }).precio -
                                                  users.descuentoproxy
                                                })`
                                              : `Limitado por Fecha`
                                          }`
                                        : "Puede Consumir " +
                                          (users.megas ? users.megas : 0) +
                                          " MB"
                                    }
                                  />
                                  {/* <FormControlLabel variant="outlined" label="Primary">
                                  
                                </FormControlLabel> */}
                                </Grid>
                                {users.isIlimitado && (
                                  <Grid container item xs={12}>
                                    <FormControl variant="outlined">
                                      <TextField
                                        fullWidth
                                        className={classes.margin}
                                        id="fechaSubscripcion"
                                        name="fechaSubscripcion"
                                        label="Fecha Limite"
                                        variant="outlined"
                                        color="secondary"
                                        type="date"
                                        value={dateFormat(
                                          new Date(
                                            users.fechaSubscripcion
                                              ? users.fechaSubscripcion
                                              : new Date()
                                          ),
                                          "yyyy-mm-dd",
                                          true,
                                          true
                                        )}
                                        onInput={(e) => {
                                          e.target.value &&
                                            Meteor.users.update(users._id, {
                                              $set: {
                                                fechaSubscripcion: new Date(
                                                  new Date(
                                                    e.target.value
                                                  ).getTime() +
                                                    1000 * 60 * 60 * 4
                                                ),
                                              },
                                            }),
                                            Meteor.call(
                                              "registrarLog",
                                              "Fecha Limite Proxy",
                                              users._id,
                                              Meteor.userId(),
                                              `La Fecha Limite del Proxy se cambió para: ${dateFormat(
                                                e.target.value,
                                                "yyyy-mm-dd",
                                                true,
                                                true
                                              )}`
                                            );
                                          e.target.value &&
                                            !users.baneado &&
                                            Meteor.call(
                                              "desabilitarProxyUser",
                                              users._id,
                                              Meteor.userId()
                                            );
                                        }}
                                      />
                                    </FormControl>

                                    <Grid
                                      item
                                      xs={12}
                                      // style={{ textAlign: "center", padding: 3 }}
                                    >
                                      <Button
                                        disabled={
                                          users.megasGastadosinBytes == 0
                                        }
                                        onClick={handleReiniciarConsumo}
                                        variant="contained"
                                        color={"secondary"}
                                      >
                                        {users.megasGastadosinBytes == 0
                                          ? "Sin Consumo"
                                          : "Reiniciar Consumo y Desactivar"}
                                      </Button>
                                    </Grid>

                                    <Grid
                                      item
                                      xs={12}
                                      lg={5}
                                      style={{
                                        // textAlign: "center",
                                        paddingTop: 10,
                                      }}
                                    >
                                      <Tooltip
                                        title={
                                          !users.baneado
                                            ? "Desactivar al Usuario"
                                            : "Activar al Usuario"
                                        }
                                      >
                                        <Button
                                          onClick={handleChangebaneado}
                                          variant="contained"
                                          color={
                                            !users.baneado
                                              ? "secondary"
                                              : "primary"
                                          }
                                        >
                                          {!users.baneado
                                            ? "Desactivar"
                                            : "Activar"}
                                        </Button>
                                      </Tooltip>
                                    </Grid>
                                  </Grid>
                                )}
                                {!users.isIlimitado && (
                                  <>
                                    {Array(
                                      Meteor.settings.public.administradores
                                    )[0].includes(Meteor.user().username) && (
                                      <Grid item xs={12}>
                                        <form
                                          action="/limite"
                                          method="post"
                                          // className={classes.root}
                                          onSubmit={handleLimiteManual}
                                          // noValidate
                                          autoComplete="true"
                                        >
                                          <Grid container>
                                            <Grid
                                              item
                                              xs={8}
                                              sm={6}
                                              md={4}
                                              lg={3}
                                              className={classes.flex}
                                            >
                                              <FormControl
                                                fullWidth
                                                variant="outlined"
                                              >
                                                <TextField
                                                  fullWidth
                                                  className={classes.margin}
                                                  id="megas"
                                                  name="megas"
                                                  label="Megas"
                                                  type="number"
                                                  variant="outlined"
                                                  color="secondary"
                                                  // defaultValue={users.megas ? users.megas : 0}
                                                  value={megas}
                                                  onChange={(e) =>
                                                    setMegas(e.target.value)
                                                  }
                                                  InputProps={{
                                                    endAdornment: (
                                                      <InputAdornment position="end">
                                                        MB
                                                      </InputAdornment>
                                                    ),
                                                  }}
                                                />
                                              </FormControl>
                                            </Grid>

                                            <Grid
                                              item
                                              xs={4}
                                              md={2}
                                              className={classes.flex}
                                              style={{
                                                alignSelf: "center",
                                                textAlign: "center",
                                              }}
                                            >
                                              <Button
                                                variant="contained"
                                                type="submit"
                                                color="secondary"
                                              >
                                                <SendIcon />
                                              </Button>
                                            </Grid>
                                          </Grid>
                                        </form>
                                      </Grid>
                                    )}

                                    <Grid item xs={12} sm={4}>
                                      <FormControl fullWidth>
                                        {/* <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel> */}
                                        <Autocomplete
                                          fullWidth
                                          value={
                                            users.megas &&
                                            PreciosCollection.findOne({
                                              userId: Meteor.userId(),
                                              type: "megas",
                                              megas: users.megas,
                                            })
                                              ? {
                                                  value: users.megas,
                                                  label:
                                                    users.megas +
                                                    "MB • $" +
                                                    (PreciosCollection.findOne({
                                                      type: "megas",
                                                      megas: users.megas,
                                                    }).precio -
                                                      users.descuentoproxy >
                                                    0
                                                      ? PreciosCollection.findOne(
                                                          {
                                                            type: "megas",
                                                            megas: users.megas,
                                                          }
                                                        ).precio -
                                                        users.descuentoproxy
                                                      : 0),
                                                }
                                              : ""
                                          }
                                          onChange={async (event, newValue) => {
                                            await Meteor.users.update(
                                              users._id,
                                              {
                                                $set: { megas: newValue.value },
                                              }
                                            );
                                            await Meteor.call(
                                              "registrarLog",
                                              "Megas",
                                              users._id,
                                              Meteor.userId(),
                                              `Ha sido Cambiado el consumo de Datos a: ${newValue.value}MB`
                                            );
                                            !users.baneado &&
                                              (await Meteor.call(
                                                "registrarLog",
                                                "Proxy",
                                                users._id,
                                                Meteor.userId(),
                                                `Se ${
                                                  !users.baneado
                                                    ? "Desactivó"
                                                    : "Activo"
                                                } el PROXY porque estaba activo y cambio el  paquete de megas seleccionado`
                                              )),
                                              Meteor.users.update(users._id, {
                                                $set: {
                                                  baneado: true,
                                                },
                                              });

                                            await Meteor.call(
                                              "sendemail",
                                              users,
                                              {
                                                text: `Ha sido Cambiado el consumo de Datos a: ${newValue.value}MB`,
                                              },
                                              "Megas"
                                            );
                                            // setIP(newValue);
                                          }}
                                          inputValue={searchPrecio}
                                          className={classes.margin}
                                          onInputChange={(
                                            event,
                                            newInputValue
                                          ) => {
                                            setSearchPrecio(newInputValue);
                                          }}
                                          id="controllable-states-demo"
                                          options={preciosList}
                                          getOptionLabel={(option) =>
                                            option.label
                                          }
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Precios"
                                              variant="outlined"
                                            />
                                          )}
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      // style={{ textAlign: "center", padding: 3 }}
                                    >
                                      <Button
                                        disabled={
                                          users.megasGastadosinBytes == 0
                                        }
                                        onClick={handleReiniciarConsumo}
                                        variant="contained"
                                        color={"secondary"}
                                      >
                                        {users.megasGastadosinBytes == 0
                                          ? "Sin Consumo"
                                          : "Reiniciar Consumo y Desactivar"}
                                      </Button>
                                    </Grid>

                                    <Grid
                                      item
                                      xs={12}
                                      lg={5}
                                      style={{
                                        // textAlign: "center",
                                        paddingTop: 10,
                                      }}
                                    >
                                      <Tooltip
                                        title={
                                          users.baneado
                                            ? "Activar al Usuario"
                                            : "Desactivar al Usuario"
                                        }
                                      >
                                        <Button
                                          onClick={handleChangebaneado}
                                          variant="contained"
                                          color={
                                            !users.baneado
                                              ? "secondary"
                                              : "primary"
                                          }
                                        >
                                          {!users.baneado
                                            ? "Desactivar"
                                            : "Activar"}
                                        </Button>
                                      </Tooltip>
                                    </Grid>
                                  </>
                                )}
                              </>
                            )
                          }
                        </Grid>
                        {Meteor.user().profile.role == "admin" && (
                          <>
                            <Divider className={classes.padding10} />
                            <h3>Conectarse por el Server:</h3>
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                {/* <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel> */}
                                <Autocomplete
                                  fullWidth
                                  value={users.ip ? users.ip : ""}
                                  onChange={(event, newValue) => {
                                    Meteor.users.update(users._id, {
                                      $set: { ip: newValue },
                                    });
                                    // setIP(newValue);
                                  }}
                                  inputValue={searchIP}
                                  className={classes.margin}
                                  onInputChange={(event, newInputValue) => {
                                    setSearchIP(newInputValue);
                                  }}
                                  id="controllable-states-demo"
                                  options={servers}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Server Activo"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </FormControl>
                            </Grid>
                            {Meteor.user().username == users.username ||
                              Array(
                                Meteor.settings.public.administradores
                              )[0].includes(users.username) || (
                                <>
                                  <Divider className={classes.padding10} />
                                  <h3>Administrado por:</h3>
                                  <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                      {/* <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel> */}
                                      <Autocomplete
                                        fullWidth
                                        value={
                                          users.bloqueadoDesbloqueadoPor
                                            ? Meteor.users.findOne({
                                                _id: users.bloqueadoDesbloqueadoPor,
                                              }) &&
                                              Meteor.users.findOne({
                                                _id: users.bloqueadoDesbloqueadoPor,
                                              }).username
                                            : ""
                                        }
                                        onChange={async (event, newValue) => {
                                          let admin =
                                            newValue != "" &&
                                            (await Meteor.users.findOne({
                                              username: newValue,
                                            }));
                                          let valueId =
                                            newValue != "" &&
                                            admin &&
                                            admin._id;
                                          valueId &&
                                            (await Meteor.users.update(
                                              users._id,
                                              {
                                                $set: {
                                                  bloqueadoDesbloqueadoPor:
                                                    valueId,
                                                },
                                              }
                                            ));
                                          valueId &&
                                            (await Meteor.call(
                                              "registrarLog",
                                              "Administrador",
                                              users._id,
                                              Meteor.userId(),
                                              `El usuario pasó a ser administrado por => ${admin.username}`
                                            ));
                                          // Meteor.call('sendemail', users,{text:"El usuario pasó a ser administrado por => " + admin.profile.firstName + " " + admin.profile.lastName}, "cambio de Administrador")

                                          // setIP(newValue);
                                        }}
                                        inputValue={searchAdmin}
                                        className={classes.margin}
                                        onInputChange={(
                                          event,
                                          newInputValue
                                        ) => {
                                          setSearchAdmin(newInputValue);
                                        }}
                                        id="controllable-states-demo"
                                        options={admins}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Administrado por:"
                                            variant="outlined"
                                          />
                                        )}
                                      />
                                    </FormControl>
                                  </Grid>
                                </>
                              )}
                          </>
                        )}

                        {Meteor.user().profile.role == "admin" && (
                          <>
                            <Divider className={classes.padding10} />
                            <Divider />
                            <h3>VPN</h3>
                            <Grid
                              item
                              xs={12}
                              lg={5}
                              style={{
                                // textAlign: "center",
                                paddingTop: 20,
                                paddingBottom: 30,
                              }}
                            >
                              <Tooltip
                                title={
                                  !users.contandoVPN
                                    ? "Si lo activa, Empezará a contar los datos consumidos por la VPN"
                                    : "Si lo desactiva, No contará los datos consumidos por la VPN"
                                }
                              >
                                <Button
                                  onClick={handleChangecontandoVPN}
                                  variant="contained"
                                  color={
                                    users.contandoVPN ? "secondary" : "primary"
                                  }
                                >
                                  {!users.contandoVPN
                                    ? "Activar el conteo de la VPN"
                                    : "Desactivar el conteo de la VPN"}
                                </Button>
                              </Tooltip>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Tooltip
                                    title={
                                      users.vpnisIlimitado
                                        ? "Cambiar consumo por MB"
                                        : "Cambiar consumo por Fecha"
                                    }
                                  >
                                    <Switch
                                      checked={users.vpnisIlimitado}
                                      onChange={() => {
                                        // users.vpnisIlimitado && setCompra({value:"fecha-vpn",label})
                                        Meteor.users.update(users._id, {
                                          $set: {
                                            vpnisIlimitado:
                                              !users.vpnisIlimitado,
                                          },
                                        });
                                      }}
                                      name="Ilimitado"
                                      color={
                                        users.vpnisIlimitado
                                          ? "secondary"
                                          : "primary"
                                      }
                                    />
                                  </Tooltip>
                                }
                                label={
                                  users.vpnisIlimitado
                                    ? ` ${
                                        PreciosCollection.findOne({
                                          type: "fecha-vpn",
                                        })
                                          ? `Limitado por Fecha ($${
                                              PreciosCollection.findOne({
                                                type: "fecha-vpn",
                                              }).precio - users.descuentovpn
                                            })`
                                          : `Limitado por Fecha`
                                      }`
                                    : "Puede Consumir " +
                                      (users.vpnmegas ? users.vpnmegas : 0) +
                                      " MB"
                                }
                              />
                              {/* <FormControlLabel variant="outlined" label="Primary">
                                  
                                </FormControlLabel> */}
                            </Grid>
                            {users.vpnisIlimitado ? (
                              <Grid container item xs={12}>
                                <FormControl variant="outlined">
                                  <TextField
                                    fullWidth
                                    className={classes.margin}
                                    id="vpnfechaSubscripcion"
                                    name="vpnfechaSubscripcion"
                                    label="Fecha Limite VPN"
                                    variant="outlined"
                                    color="secondary"
                                    type="date"
                                    value={dateFormat(
                                      new Date(
                                        users.vpnfechaSubscripcion
                                          ? users.vpnfechaSubscripcion
                                          : new Date()
                                      ),
                                      "yyyy-mm-dd",
                                      true,
                                      true
                                    )}
                                    onInput={(e) => {
                                      e.target.value &&
                                        Meteor.users.update(users._id, {
                                          $set: {
                                            vpnfechaSubscripcion: new Date(
                                              new Date(
                                                e.target.value
                                              ).getTime() +
                                                1000 * 60 * 60 * 4
                                            ),
                                            vpnplus: true,
                                            vpn2mb: true,
                                          },
                                        }),
                                        Meteor.call(
                                          "registrarLog",
                                          "Fecha Limite VPN",
                                          users._id,
                                          Meteor.userId(),
                                          `La Fecha Limite de la VPN se cambió para: ${dateFormat(
                                            e.target.value,
                                            "yyyy-mm-dd",
                                            true,
                                            true
                                          )}`
                                        );

                                      e.target.value &&
                                        users.vpn &&
                                        (Meteor.call(
                                          "registrarLog",
                                          "VPN Bloqueado",
                                          users._id,
                                          Meteor.userId(),
                                          `Se Desactivó la VPN porque estaba activa y cambio la fecha Limite`
                                        ),
                                        Meteor.users.update(users._id, {
                                          $set: {
                                            vpn: false,
                                          },
                                        }));
                                    }}
                                  />
                                </FormControl>
                              </Grid>
                            ) : (
                              <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                  {/* <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel> */}
                                  <Autocomplete
                                    fullWidth
                                    value={
                                      users.vpnplus
                                        ? {
                                            value: `vpnplus/${users.vpnmegas}`,
                                            label:
                                              "VPN PLUS • " +
                                              users.vpnmegas +
                                              "MB",
                                          }
                                        : users.vpn2mb
                                        ? {
                                            value: `vpn2mb/${users.vpnmegas}`,
                                            label:
                                              "VPN 2MB • " +
                                              users.vpnmegas +
                                              "MB",
                                          }
                                        : {}
                                    }
                                    onChange={(event, newValue) => {
                                      newValue.value.split("/")[0] == "vpnplus"
                                        ? Meteor.users.update(users._id, {
                                            $set: {
                                              vpnplus: true,
                                              vpn2mb: true,
                                              vpnmegas: Number.parseInt(
                                                newValue.value.split("/")[1]
                                              ),
                                            },
                                          })
                                        : newValue.value.split("/")[0] ==
                                          "vpn2mb"
                                        ? Meteor.users.update(users._id, {
                                            $set: {
                                              vpnplus: false,
                                              vpn2mb: true,
                                              vpnmegas: Number.parseInt(
                                                newValue.value.split("/")[1]
                                              ),
                                            },
                                          })
                                        : Meteor.users.update(users._id, {
                                            $set: {
                                              vpnplus: false,
                                              vpn2mb: false,
                                              vpnmegas: Number.parseInt(
                                                newValue.value.split("/")[1]
                                              ),
                                            },
                                          });
                                      Meteor.call(
                                        "registrarLog",
                                        "VPN",
                                        users._id,
                                        Meteor.userId(),
                                        `Ha sido Seleccionada la VPN: ${newValue.label}`
                                      );
                                      // Meteor.call('sendemail', users,{text: `Ha sido Seleccionada la VPN: ${newValue.label}`}, newValue.value)

                                      users.vpn &&
                                        Meteor.users.update(users._id, {
                                          $set: { vpn: false },
                                        });
                                      users.vpn &&
                                        Meteor.call(
                                          "registrarLog",
                                          "VPN Bloqueado",
                                          users._id,
                                          Meteor.userId(),
                                          `Se Desactivó la VPN porque estaba activa y cambio la oferta`
                                        );
                                      // Meteor.call('sendemail', users,{text: `Se ${!users.vpn ? "Activo" : "Desactivó"} la VPN porque estaba activa y cambio la oferta`}, "VPN");
                                      // setIP(newValue);
                                    }}
                                    inputValue={searchPrecioVPN}
                                    className={classes.margin}
                                    onInputChange={(event, newInputValue) => {
                                      setSearchPrecioVPN(newInputValue);
                                    }}
                                    id="controllable-states-demo"
                                    options={preciosVPNList}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Precios VPN"
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </FormControl>
                              </Grid>
                            )}
                            <Grid item xs={12} sm={4} style={{ padding: 3 }}>
                              <Button
                                disabled={users.vpnMbGastados ? false : true}
                                onClick={handleReiniciarConsumoVPN}
                                variant="contained"
                                color={
                                  users.vpnMbGastados ? "secondary" : "primary"
                                }
                              >
                                {users.vpnMbGastados
                                  ? "Reiniciar Consumo"
                                  : "Sin consumo de Datos"}
                              </Button>
                            </Grid>
                            <Grid item xs={12} sm={4} style={{ padding: 3 }}>
                              <Button
                                // disabled={!Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username)}
                                onClick={handleVPNStatus}
                                variant="contained"
                                color={users.vpn ? "secondary" : "primary"}
                              >
                                {users.vpn ? "Desactivar VPN" : "Activar VPN"}
                              </Button>
                            </Grid>
                          </>
                        )}
                        {Meteor.user() &&
                          Array(
                            Meteor.settings.public.administradores
                          )[0].includes(Meteor.user().username) && (
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                {" "}
                                <Divider className={classes.padding10} />
                              </Grid>

                              <Grid container className={classes.margin}>
                                Descuentos
                              </Grid>
                              <Grid item xs={12} sm={4} lg={3}>
                                <FormControl variant="outlined">
                                  <TextField
                                    fullWidth
                                    className={classes.margin}
                                    id="proxy"
                                    name="proxy"
                                    label="Para el Proxy"
                                    variant="outlined"
                                    color="secondary"
                                    value={
                                      users.descuentoproxy
                                        ? users.descuentoproxy
                                        : 0
                                    }
                                    onInput={(e) =>
                                      Meteor.users.update(users._id, {
                                        $set: {
                                          descuentoproxy: e.target.value,
                                        },
                                      })
                                    }
                                    InputProps={{
                                      readOnly: false,
                                      startAdornment: "$",
                                    }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={4} lg={3}>
                                <FormControl variant="outlined">
                                  <TextField
                                    fullWidth
                                    className={classes.margin}
                                    id="vpn"
                                    name="vpn"
                                    label="Para la VPN"
                                    variant="outlined"
                                    color="secondary"
                                    value={
                                      users.descuentovpn
                                        ? users.descuentovpn
                                        : 0
                                    }
                                    onInput={(e) =>
                                      Meteor.users.update(users._id, {
                                        $set: {
                                          descuentovpn: e.target.value,
                                        },
                                      })
                                    }
                                    InputProps={{
                                      readOnly: !Array(
                                        Meteor.settings.public.administradores
                                      )[0].includes(Meteor.user().username),
                                      startAdornment: "$",
                                    }}
                                  />
                                </FormControl>
                              </Grid>
                            </Grid>
                          )}
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <Grid container direction="row" justify="center">
                          <Avatar
                            className={classes.large}
                            alt={
                              users && users.profile && users.profile.firstName
                                ? users.profile.firstName
                                : users.profile.name
                            }
                            src={users && users.picture ? users.picture : "/"}
                          />
                        </Grid>
                      </Grid>
                      <Paper
                        elevation={5}
                        style={{ width: "100%", padding: 25, marginBottom: 25 }}
                      >
                        <Grid item xs={12}>
                          <Grid container direction="row">
                            <Typography>
                              Nombre:{" "}
                              {users &&
                                users.profile &&
                                users.profile.firstName}{" "}
                              {users && users.profile && users.profile.lastName}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container direction="row">
                            <Typography>
                              Rol:{" "}
                              {users && users.profile && users.profile.role}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container direction="row">
                            <Typography>
                              {users.emails &&
                                "Email: " + users.emails[0].address}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container direction="row">
                            <Typography>Usuario: {users.username}</Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container direction="row">
                            <Typography>
                              {users.movil && "Movil: " + users.movil}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container direction="row">
                            <Typography>
                              {users.createdAt &&
                                "Fecha de Creacion de la cuenta: " +
                                  users.createdAt}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container direction="row">
                            <Typography>
                              Creado por:{" "}
                              {users.creadoPor
                                ? creadoPor
                                  ? creadoPor.username
                                  : users.creadoPor
                                : Meteor.settings.public.administradores[0]}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container direction="row">
                            <Typography>
                              Servicios Vinculados:{" "}
                              {users.idtelegram && (
                                <Chip color="primary" label="TELEGRAM" />
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container direction="row">
                            <Typography>
                              Subscripcion Películas y Series:{" "}
                              {users.subscipcionPelis ? (
                                <Chip color="primary" label="ACTIVO" />
                              ) : (
                                <Chip color="secondary" label="INACTIVO" />
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                        {Array(
                          Meteor.settings.public.administradores
                        )[0].includes(Meteor.user().username) && (
                          <Grid item xs={12}>
                            <Grid container direction="row">
                              <Typography>
                                Enviar Reporte de Audio:{" "}
                                {users.enviarReporteAudio ? (
                                  <Chip color="primary" label="ACTIVO" />
                                ) : (
                                  <Chip color="secondary" label="INACTIVO" />
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        )}
                          
                        
                      </Paper>
                        
                        {(users.profile.role == 'admin' ||  Array(
                          Meteor.settings.public.administradores
                        )[0].includes(Meteor.user().username))&& (
                          <Paper
                            elevation={5}
                            style={{
                              width: "100%",
                              padding: 25,
                              marginBottom: 25,
                            }}
                          >
                            <Typography align="center">DESCUENTOS</Typography>
                            <Grid item xs={12}>
                              <Grid container direction="row">
                                <Typography>
                                  Descuentos para la VPN:{" "}
                                  {users.descuentovpn != null && users.descuentovpn > 0 ? (
                                    <Chip color="primary" label={users.descuentovpn + " CUP"} />
                                  ) : (
                                    <Chip color="secondary" label="0 CUP" />
                                  )}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Grid item xs={12}>
                              <Grid container direction="row">
                                <Typography>
                                  Descuentos para el PROXY:{" "}
                                  {users.descuentoproxy != null && users.descuentoproxy > 0 ? (
                                    <Chip color="primary" label={users.descuentoproxy + " CUP"} />
                                  ) : (
                                    <Chip color="secondary" label="0 CUP" />
                                  )}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        )}



                      {(users.megasGastadosinBytes ||
                        users.fechaSubscripcion ||
                        users.megas) && (
                        <Paper
                          elevation={5}
                          style={{
                            width: "100%",
                            padding: 25,
                            marginBottom: 25,
                          }}
                        >
                          <Typography align="center">PROXY</Typography>

                          <Grid item xs={12}>
                            <Grid container direction="row">
                              <Typography>
                                {`MEGAS GASTADOS • ${`${Number.parseFloat(
                                  users.megasGastadosinBytes
                                    ? users.megasGastadosinBytes / 1024000
                                    : 0
                                ).toFixed(2)} MB`}`}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid container direction="row">
                              <Typography>
                                LIMITE {"• "}
                                {users.isIlimitado
                                  ? users.fechaSubscripcion
                                    ? dateFormat(
                                        new Date(users.fechaSubscripcion),
                                        "yyyy-mm-dd",
                                        true,
                                        true
                                      )
                                    : "No esta establecida la fecha limite"
                                  : users.megas
                                  ? users.megas + " MB"
                                  : " No esta establecido el Limite de Megas a consumir"}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid container direction="row">
                              <Typography>
                                CONEXION{" "}
                                {users.baneado ? "• Desactivado" : "• Activado"}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid container direction="row">
                              <Typography>
                                CONTANDO EL CONSUMO:{" "}
                                {users.contandoProxy
                                  ? "• Activado"
                                  : "• Desactivado"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      )}
                      {(users.vpnMbGastados || users.vpnmegas || users.vpn) && (
                        <Paper
                          elevation={5}
                          style={{ width: "100%", padding: 25 }}
                        >
                          <Typography align="center">VPN</Typography>
                          <Grid item xs={12}>
                            <Grid container direction="row">
                              <Typography>
                                {`MEGAS GASTADOS • ${`${Number.parseFloat(
                                  users.vpnMbGastados
                                    ? users.vpnMbGastados / 1024000
                                    : 0
                                ).toFixed(2)} MB`}`}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid container direction="row">
                              <Typography>
                                LIMITE {"• "}
                                {users.vpnisIlimitado
                                  ? users.vpnfechaSubscripcion
                                    ? dateFormat(
                                        new Date(users.vpnfechaSubscripcion),
                                        "yyyy-mm-dd",
                                        true,
                                        true
                                      )
                                    : "No esta establecida la fecha limite"
                                  : users.vpnmegas
                                  ? users.vpnmegas + " MB"
                                  : " No esta establecido el Limite de Megas a consumir"}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid container direction="row">
                              <Typography>
                                TYPE {"•"}{" "}
                                {users.vpnplus
                                  ? "VPNPLUS"
                                  : users.vpn2mb
                                  ? "VPN2MB"
                                  : "N/A"}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid container direction="row">
                              <Typography>
                                CONEXION {"•"}{" "}
                                {users.vpn ? "Activado" : "Desactivado"}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid container direction="row">
                              <Typography>
                                CONTANDO EL CONSUMO:{" "}
                                {users.contandoVPN
                                  ? "• Activado"
                                  : "• Desactivado"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      )}
                    </>
                  )}

                  {Meteor.user() &&
                  Meteor.user().profile &&
                  Meteor.user().profile.role &&
                  Meteor.user().profile.role == "admin" ? (
                    <Grid item xs={12}>
                      <Divider className={classes.padding10} />
                      <Divider />
                      <Grid
                        container
                        direction="row-reverse"
                        justify="space-around"
                        alignItems="center"
                      >
                        {Array(
                          Meteor.settings.public.administradores
                        )[0].includes(Meteor.user().username) && (
                          <Grid
                            item
                            xs={12}
                            sm={4}
                            style={{ textAlign: "center" }}
                          >
                            <IconButton
                              // disabled = {!Array(Meteor.settings.public.administradores)[0].includes(Meteor.user().username)}
                              onClick={handleClickAlertOpen}
                              aria-label="delete"
                            >
                              <DeleteIcon color="primary" fontSize="large" />
                            </IconButton>
                          </Grid>
                        )}
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          style={{ textAlign: "center" }}
                        >
                          <Button
                            color={edit ? "secondary" : "primary"}
                            variant="contained"
                            onClick={handleEdit}
                          >
                            {edit ? "Cancelar Edición" : "Editar"}
                          </Button>
                        </Grid>
                        {edit &&
                          Array(
                            Meteor.settings.public.administradores
                          )[0].includes(Meteor.user().username) && (
                            <Grid
                              item
                              xs={12}
                              // sm={4}
                              // style={{ textAlign: "center" }}
                            >
                              <Tooltip
                                title={
                                  users.profile.role == "admin"
                                    ? "Cambiar a user"
                                    : "Cambiar a admin"
                                }
                              >
                                <Switch
                                  checked={users.profile.role == "admin"}
                                  onChange={handleChange}
                                  name="Roles"
                                  color="primary"
                                />
                              </Tooltip>
                            </Grid>
                          )}
                      </Grid>
                    </Grid>
                  ) : users._id == Meteor.userId() ? (
                    <>
                      <Grid item xs={12}>
                        <Divider className={classes.padding10} />
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          alignItems="center"
                        >
                          <Button
                            color={edit ? "secondary" : "primary"}
                            variant="contained"
                            onClick={handleEdit}
                          >
                            {edit ? "Cancelar Edición" : "Editar"}
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    ""
                  )}
                </Grid>
              </Paper>
              {registroDeDatosConsumidos &&
                registroDeDatosConsumidos.length > 0 && (
                  <>
                    <Grid
                      container
                      item
                      xs={12}
                      justify="space-evenly"
                      alignItems="center"
                      style={{ paddingTop: 50 }}
                    >
                      <Chip
                        style={{ width: "90%" }}
                        color="primary"
                        label="Consumo de Datos en VidKar Por Horas:"
                      />
                      <div style={{ width: "100%", height: 300 }}>
                        <GraphicsLinealConsumoMegasXHoras />
                      </div>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={12}
                      justify="space-evenly"
                      alignItems="center"
                      style={{ paddingTop: 50 }}
                    >
                      <Chip
                        style={{ width: "90%" }}
                        color="primary"
                        label="Consumo de Datos en VidKar Por Dias:"
                      />
                      <div style={{ width: "100%", height: 300 }}>
                        <GraphicsLinealConsumoMegasXDias />
                      </div>
                    </Grid>
                    <Divider variant="middle" />
                    <Grid
                      container
                      item
                      xs={12}
                      justify="space-evenly"
                      alignItems="center"
                      style={{ paddingTop: 50 }}
                    >
                      <Chip
                        style={{ width: "90%" }}
                        color="primary"
                        label="Consumo de Datos en VidKar:"
                      />
                      <div style={{ width: "100%", height: 300 }}>
                        <GraphicsLinealConsumoMegasXMeses />
                      </div>
                    </Grid>
                    <Divider variant="middle" />
                  </>
                )}
              {Meteor.user() &&
                Meteor.user().profile.role == "admin" &&
                tieneVentas && <DashboardInit id={id} />}
            </>
          </Zoom>
        )}
      </div>
    </>
  );
}
