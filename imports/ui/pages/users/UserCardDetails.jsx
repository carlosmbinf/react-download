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
  FormHelperText ,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';

import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import {ServersCollection, VentasCollection,PreciosCollection} from "../collections/collections"
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";
import DataUsageIcon from '@material-ui/icons/DataUsage';
var dateFormat = require('dateformat');

import { OnlineCollection, LogsCollection, RegisterDataUsersCollection } from "../collections/collections";
import { Autocomplete } from "@material-ui/lab";

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
    borderColor: '#f50057',
    borderWidth: 13,
    borderStyle: 'groove',
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
  const [searchAdmin, setSearchAdmin] = useState("");
  const [megas, setMegas] = useState();
  const [mensaje, setMensaje] = useState("");

  const bull = <span className={classes.bullet}>•</span>;
  const users = useTracker(() => {
    Meteor.subscribe("userID", useParams().id);
    return Meteor.users.findOne({ _id: useParams().id });
  });

  const servers = useTracker(() => {
    Meteor.subscribe("servers").ready()
    let serv = []
    ServersCollection.find({ active: true }).fetch().map((a)=>{
      serv.push(a.ip)
    })
    return serv
  });

  const preciosList = useTracker(() => {
    Meteor.subscribe("precios").ready()
    let precioslist = []
    PreciosCollection.find({ fecha: false }).fetch().map((a)=>{
      precioslist.push({value: a.megas, label: a.megas+'MB • $'+ a.precio})
    })
    return precioslist
  });

    const admins = useTracker(() => {
      Meteor.subscribe("user",{"profile.role":"admin"}).ready()
      let admins = []
      Meteor.users.find({"profile.role":"admin"}).fetch().map((a)=>{
        // admins.push({ value: a._id , text: `${a.profile.firstName} ${a.profile.lastName}`})
        admins.push(a.username)
      })

    return admins ;
  });
  const precios = useTracker(() => {
    Meteor.subscribe("precios").ready()
    
  return PreciosCollection.find().fetch() ;
});
  const usersOnline = useTracker(() => {
    Meteor.subscribe("conexionesUser", useParams().id);
    return Meteor.users.find({ userId: useParams().id }).count() > 0 ? true : false;
  });
  function eliminarUser() {
    Meteor.users.remove({ _id: users._id });
    alert("Usuario Eliminado");
    history.push("/users");
  }

  function handleSubmit(event) {
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
            alert("Ocurrió un Problema al cambiar la contraseña!, reintentelo mas tarde");
          })
        : alert("La Contraseña no Coincide");
    }

    (oldPassword || password) && changePassword()
    firstName && Meteor.users.update(Meteor.userId(), { $set: { "profile.firstName": firstName } });
    lastName && Meteor.users.update(Meteor.userId(), { $set: { "profile.lastName": lastName } });
    edad && Meteor.users.update(Meteor.userId(), { $set: { edad: edad } });
    username && Meteor.users.update(Meteor.userId(), { $set: { username: username } });
    email && Meteor.users.update(Meteor.userId(), { $set: { "emails.0.address": email } });

  }

  function handleLimite(event) {
    event.preventDefault();

    // You should see email and password in console.
    // ..code to submit form to backend here...
    try {
      megas>=0 ? 
      Meteor.users.update(users._id, { $set: { megas: megas } }) : console.log('no se inserto nada');
      LogsCollection.insert({
        type: 'Megas',
        userAfectado: users._id,
        userAdmin: Meteor.userId(),
        message:
          `Ha sido Cambiado el consumo de Datos a: ${megas}MB`,
      });
    } catch (error) {
      
    }
    
  } 
  const handleEdit = (event) => {
    setEdit(!edit);
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
  const handleReiniciarConsumo = (event) => {
    users.megasGastadosinBytes >= 0 &&
      RegisterDataUsersCollection.insert({
        userId: users._id,
        megasGastadosinBytes: users.megasGastadosinBytes,
        megasGastadosinBytesGeneral: users.megasGastadosinBytesGeneral,
      })
    Meteor.users.update(users._id, {
      $set: {
        megasGastadosinBytes: 0,
        megasGastadosinBytesGeneral : 0
      },
    });
    LogsCollection.insert({
      type: 'Reinicio',
      userAfectado: users._id,
      userAdmin: Meteor.userId(),
      message:
        `Ha sido Reiniciado el consumo de Datos por ${users.profile.firstName} ${users.profile.lastName}`,
    });
    alert('Se reinicio los datos de ' + users.profile.firstName)
  };
  const addVenta = () => {
    // console.log(`Precio MEGAS ${precios}`);
let validacion = false;

    users.isIlimitado && (new Date() < new Date(users.fechaSubscripcion)) && (validacion = true)
    users.isIlimitado || ((users.megasGastadosinBytes?(users.megasGastadosinBytes/ 1000000):0 ) < (users.megas?users.megas:0)) && (validacion = true)
    
    validacion || (
      setMensaje("Revise los Límites del Usuario"),
      handleClickOpen()
)
    // validacion = ((users.profile.role == "admin") ? true  : false);

    users.profile.role == 'admin' ? (
      (Meteor.users.update(users._id, {
        $set: {
          baneado: users.baneado ? false : true,
          bloqueadoDesbloqueadoPor: Meteor.userId()
        },
      }),
        LogsCollection.insert({
          type: !users.baneado ? "Bloqueado" : "Desbloqueado",
          userAfectado: users._id,
          userAdmin: Meteor.userId(),
          message:
            "Ha sido " +
            (!users.baneado ? "Bloqueado" : "Desbloqueado") +
            " por un Admin",
        }))
    ) : (

      users.baneado ||
      (Meteor.users.update(users._id, {
        $set: {
          baneado: users.baneado ? false : true,
          bloqueadoDesbloqueadoPor: Meteor.userId()
        },
      }),
        LogsCollection.insert({
          type: !users.baneado ? "Bloqueado" : "Desbloqueado",
          userAfectado: users._id,
          userAdmin: Meteor.userId(),
          message:
            "Ha sido " +
            (!users.baneado ? "Bloqueado" : "Desbloqueado") +
            " por un Admin",
        })),

      validacion && users.baneado && (
        Meteor.users.update(users._id, {
          $set: {
            baneado: users.baneado ? false : true,
            bloqueadoDesbloqueadoPor: Meteor.userId()
          },
        }),
        LogsCollection.insert({
          type: !users.baneado ? "Bloqueado" : "Desbloqueado",
          userAfectado: users._id,
          userAdmin: Meteor.userId(),
          message:
            "Ha sido " +
            (!users.baneado ? "Bloqueado" : "Desbloqueado") +
            " por un Admin",
        }),
        precios.map(precio => {

          users.isIlimitado && precio.fecha && (VentasCollection.insert({
            adminId: Meteor.userId(),
            userId: users._id,
            precio: precio.precio,
            comentario: precio.comentario
          }),
            setMensaje(precio.comentario),
            handleClickOpen()
          ),

            // console.log("Precio MEGAS " + precio.megas);
            // console.log("User MEGAS " + users.megas);
            users.isIlimitado || (precio.megas == users.megas) && (
              VentasCollection.insert({
                adminId: Meteor.userId(),
                userId: users._id,
                precio: precio.precio,
                comentario: precio.comentario
              }),
              setMensaje(precio.comentario),
              handleClickOpen()
            )
        }))
    )


  }
  const handleChangebaneado = (event) => {
  addVenta();
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
      <Dialog open={open} >
        <DialogTitle>Atención!!!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {mensaje}
          </DialogContentText>
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
                          src={
                            users.services &&
                            users.services.facebook &&
                            users.services.facebook.picture.data.url
                              ? users.services.facebook.picture.data.url
                              : "/"
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      
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
                                value={users.emails[0].address}
                                // onInput={(e) => setEmail(e.target.value)}
                                InputProps={{
                                  readOnly: true,
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
                            {editPassword
                              ? "Cancelar"
                              : "Cambiar"}
                          </Button>
                          
                        </Grid>

                        {editPassword && (
                          <form
                          action="/hello"
                          method="post"
                          className={classes.root}
                          onSubmit={handleSubmit}
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
                        <Grid container spacing={3}>
                          <Grid item xs={12}> <Divider className={classes.padding10} /></Grid>

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
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AccountCircleIcon />
                                    </InputAdornment>
                                  ),
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
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AccountCircleIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        {Meteor.user().profile.role == "admin" &&
                          !(users.profile.role == "admin") && (
                            <>
                            <Grid item xs={12} className={classes.margin}>
                            <Divider className={classes.padding10} />
                              Limites
                            </Grid>
                                {users.isIlimitado && (
                                  <Grid item xs={12} >
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
                                          Meteor.users.update(users._id, {
                                            $set: {
                                              fechaSubscripcion: e.target.value
                                                ? (new Date(e.target.value))
                                                : "",
                                              // baneado: e.target.value
                                              //   ? false
                                              //   : users.baneado,
                                            },
                                          });
                                          e.target.value &&
                                            LogsCollection.insert({
                                              type: "Fecha Limite Proxy",
                                              userAfectado: users._id,
                                              userAdmin: Meteor.userId(),
                                              message:
                                                "La Fecha Limite del Proxy se cambió para: " +
                                                dateFormat(e.target.value,
                                                  "yyyy-mm-dd",
                                                  true,
                                                  true
                                                ),
                                            });
                                          e.target.value &&
                                            LogsCollection.insert({
                                              type: "Desbloqueado",
                                              userAfectado: users._id,
                                              userAdmin: Meteor.userId(),
                                              message:
                                                "Ha sido Desbloqueado por un Admin",
                                            });
                                        }}
                                      />
                                  </FormControl>
                                  
                                </Grid>
                                )}
                                {!users.isIlimitado && (
                                  <>
                                  {Meteor.user().username == "carlosmbinf" &&
                                  <Grid item xs={12}>
                                  <form
                                    action="/limite"
                                    method="post"
                                    // className={classes.root}
                                    onSubmit={handleLimite}
                                    // noValidate
                                    autoComplete="true"
                                  >
                                    <Grid container>
                                    <Grid item xs={8} sm={6} md={4} lg={3} className={classes.flex}>
                                      <FormControl fullWidth variant="outlined">
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
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <AccountCircleIcon />
                                              </InputAdornment>
                                            ),
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
  
                                    <Grid item xs={4} md={2} className={classes.flex} style={{alignSelf: 'center', textAlign: 'center'}}>
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
                                  }
                              
                              <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                              {/* <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel> */}
                              <Autocomplete
                                fullWidth
                                value={users.megas&&PreciosCollection.findOne({ fecha: false, megas: users.megas })?{ value: users.megas, label: (users.megas + 'MB • $' + (PreciosCollection.findOne({ fecha: false, megas: users.megas }).precio&&PreciosCollection.findOne({ fecha: false, megas: users.megas }).precio)) }:""}
                                onChange={(event, newValue) => {
                                  Meteor.users.update(users._id, {
                                    $set: { megas: newValue.value },
                                  });
                                  LogsCollection.insert({
                                    type: 'Megas',
                                    userAfectado: users._id,
                                    userAdmin: Meteor.userId(),
                                    message:
                                      `Ha sido Cambiado el consumo de Datos a: ${newValue.value}MB`,
                                  });
                                  // setIP(newValue);
                                }}
                                inputValue={searchPrecio}
                                className={classes.margin}
                                onInputChange={(event, newInputValue) => {
                                  setSearchPrecio(newInputValue);
                                }}
                                id="controllable-states-demo"
                                options={preciosList}
                                getOptionLabel= {(option) => option.label}
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
                              </>
                                )}

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
                                        ? "Limitado por Fecha"
                                        : "Puede Consumir " +
                                        (users.megas ? users.megas : 0) +
                                        " MB"
                                    }
                                  />
                                  {/* <FormControlLabel variant="outlined" label="Primary">
                                  
                                </FormControlLabel> */}
                                </Grid>
                              
                                
                            </>
                          )}
                      </Grid>
                      {
                        Meteor.user().profile.role == "admin" &&
                        <>
                          <Divider className={classes.padding10} />
                          <h3>
                            Conectarse por el Server:
                          </h3>
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
                          {Meteor.user().username == users.username || users.username == 'carlosmbinf' ||
                          <>
                          <Divider className={classes.padding10} />
                          <h3>
                            Administrado por:
                          </h3>
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                              {/* <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel> */}
                              <Autocomplete
                                fullWidth
                                value={users.bloqueadoDesbloqueadoPor ? Meteor.users.findOne({_id:users.bloqueadoDesbloqueadoPor})&&Meteor.users.findOne({_id:users.bloqueadoDesbloqueadoPor}).username  : ""}
                                onChange={(event, newValue) => {
                                  let admin = newValue != "" && Meteor.users.findOne({ username: newValue })
                                  let valueId = newValue && admin && admin._id
                                  valueId && Meteor.users.update(users._id, {
                                    $set: { bloqueadoDesbloqueadoPor: valueId },
                                  });
                                  // setIP(newValue);
                                }}
                                inputValue={searchAdmin}
                                className={classes.margin}
                                onInputChange={(event, newInputValue) => {
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
                          }
                          
                        </>
                      }

                    </Grid>
                  </>
                ) : (
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
                          src={
                            users.services &&
                              users.services.facebook &&
                              users.services.facebook.picture.data.url
                              ? users.services.facebook.picture.data.url
                              : "/"
                          }
                        />
                      </Grid>
                      <Grid container direction="row">
                        <Typography>
                          Nombre: {users.profile.firstName}{" "}
                          {users.profile.lastName}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container direction="row">
                        <Typography>Rol: {users.profile.role}</Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container direction="row">
                        <Typography>
                          {users.emails && "Email: " + users.emails[0].address}
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
                          Megas Gastados:{" "}
                          {users.megasGastadosinBytes
                            ? Number.parseFloat(
                              users.megasGastadosinBytes / 1000000
                            ).toFixed(2)
                            : 0 + " MB"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container direction="row">
                        <Typography>
                          Limite:{" "}
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
                          Conexion: {users.baneado ? "Desactivado" : "Activado"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                )}

                {Meteor.user()&&Meteor.user().profile&&Meteor.user().profile.role &&
                Meteor.user().profile.role == "admin" ? (
                  <Grid item xs={12}>
                    <Divider className={classes.padding10} />
                    <Grid
                      container
                      direction="row-reverse"
                      justify="space-around"
                      alignItems="center"
                    >
                      {Meteor.user().username == "carlosmbinf" && (
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          style={{ textAlign: "center" }}
                        >
                          <IconButton
                          disabled
                            onClick={eliminarUser}
                            aria-label="delete"
                          >
                            <DeleteIcon color="primary" fontSize="large" />
                          </IconButton>
                        </Grid>
                      )}
                      <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
                        <Button
                          color={edit ? "secondary" : "primary"}
                          variant="contained"
                          onClick={handleEdit}
                        >
                          {edit ? "Cancelar Edición" : "Editar"}
                        </Button>
                      </Grid>
                      {edit ? (
                        <>
                          <Grid
                            item
                            xs={12}
                            sm={4}
                            style={{ textAlign: "center", padding:3}}
                          >
                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                lg={5}
                                style={{ textAlign: "center" , padding:3 }}
                              >
                                <Tooltip
                                  title={
                                    users.baneado
                                      ? "Desbloquear al Usuario"
                                      : "Bloquear al Usuario"
                                  }
                                >
                                  <Button
                                    onClick={handleChangebaneado}
                                    variant="contained"
                                    color={
                                      users.baneado ? "secondary" : "primary"
                                    }
                                  >
                                    {users.baneado ? "Desbloquear" : "Bloquear"}
                                  </Button>
                                </Tooltip>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                lg={7}
                                style={{ textAlign: "center", padding:3 }}
                              >
                                <Button
                                  disabled={users.megasGastadosinBytes == 0}
                                  onClick={handleReiniciarConsumo}
                                  variant="contained"
                                  color={"secondary"}
                                >
                                  {users.megasGastadosinBytes == 0
                                    ? "Sin Consumo/Datos"
                                    : "Reiniciar Consumo/Datos"}
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        Meteor.user().username == "carlosmbinf" && (
                          <Grid
                            item
                            xs={12}
                            sm={4}
                            style={{ textAlign: "center"}}
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
                        )
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
          </Zoom>
        )}
      </div>
    </>
  );
}