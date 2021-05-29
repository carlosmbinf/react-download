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
} from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

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
    minWidth: 300,
    maxWidth: "100%",
    borderRadius: 20,
    padding: "2em",
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
}));

export default function UserCardDetails() {
  const history = useHistory();
  const classes = useStyles();
  var [edit, setEdit] = useState(false);
  var [editPassword, setEditPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [edad, setEdad] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const bull = <span className={classes.bullet}>•</span>;
  const users = useTracker(() => {
    Meteor.subscribe("userID", useParams().id);
    return Meteor.users.findOne({ _id: useParams().id });
  });
  const usersOnline = useTracker(() => {
    Meteor.subscribe("conexionesUser", useParams().id);
    return OnlineCollection.find({ userId: useParams().id }).count() > 0 ? true : false;
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
      oldPassword === password
        ? Accounts.changePassword(oldPassword, password, function (error) {
          if (error) {
            console.log("There was an issue: " + error.reason)
          } else {
            console.log("You reset your password!")
          }
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
  const handleChangebaneado = (event) => {
    users.baneado && users.megasGastadosinBytes >= 500000000 &&
      RegisterDataUsersCollection.insert({
        userId: users._id,
        megasGastadosinBytes: users.megasGastadosinBytes,
        megasGastadosinBytesGeneral: users.megasGastadosinBytesGeneral,
      })
    Meteor.users.update(users._id, {
      $set: {
        baneado: users.baneado ? false : true,
        bloqueadoDesbloqueadoPor: Meteor.userId(),
        megasGastadosinBytes: (users.baneado && users.megasGastadosinBytes >= 500000000) ? 0 : users.megasGastadosinBytes,
        megasGastadosinBytesGeneral : (users.baneado && users.megasGastadosinBytesGeneral >= 500000000) ? 0 : users.megasGastadosinBytesGeneral,
      },
    });
    LogsCollection.insert({
      type: !users.baneado ? "Bloqueado" : "Desbloqueado",
      userAfectado: users._id,
      userAdmin: Meteor.userId(),
      message:
        "Ha sido " +
        (!users.baneado ? "Bloqueado" : "Desbloqueado") +
        " por un Admin",
      createdAt: new Date(),
    });
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
                      <form
                        action="/hello"
                        method="post"
                        className={classes.root}
                        onSubmit={handleSubmit}
                        // noValidate
                        autoComplete="true"
                      >
                        <Grid container className={classes.margin}>
                          Datos del Usuario
                        </Grid>
                        <Grid container spacing={3} style={{paddingBottom:20}}>
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
                          {Meteor.user().profile.role == "admin" && !(users.profile.role == 'admin') && (
                            <>
                              <Grid item xs={12}>
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
                                          fechaSubscripcion: e.target.value ? (new Date(
                                            e.target.value
                                          )) : '',
                                          baneado: e.target.value ? false : users.baneado
                                        },
                                      })
                                      e.target.value && LogsCollection.insert({
                                        type: 'Fecha Limite Proxy',
                                        userAfectado: users._id,
                                        userAdmin: Meteor.userId(),
                                        message:
                                          "La Fecha Limite del Proxy se cambió para: " +
                                          dateFormat(
                                            new Date(e.target.value),
                                            "yyyy-mm-dd",
                                            true,
                                            true
                                          ),
                                        createdAt: new Date(),
                                      });
                                      e.target.value && LogsCollection.insert({
                                        type: "Desbloqueado",
                                        userAfectado: users._id,
                                        userAdmin: Meteor.userId(),
                                        message:
                                          "Ha sido Desbloqueado por un Admin",
                                        createdAt: new Date(),
                                      });
                                    }
                                    }
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} style={{
                                display: 'flex',
                                justifyContent: 'left',
                                alignItems: 'center'
                              }}>
                                <FormControlLabel control={<Tooltip
                                    title={
                                      users.isIlimitado
                                        ? "Cambiar consumo por MB"
                                        : "Cambiar consumo por Fecha"
                                    }
                                  >
                                    <Switch
                                      checked={users.isIlimitado}
                                      onChange={() => { Meteor.users.update(users._id, { $set: { isIlimitado: !users.isIlimitado } }) }}
                                      name="Ilimitado"
                                      color={users.isIlimitado ? "secondary" : "primary"}
                                    />
                                  </Tooltip>} label={users.isIlimitado
                                        ? "Limitado por Fecha"
                                        : "Puede Consumir 500 MB"} />
                                {/* <FormControlLabel variant="outlined" label="Primary">
                                  
                                </FormControlLabel> */}
                                
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            color={editPassword ? "secondary" : "primary"}
                            variant="contained"
                            onClick={handleEditPassword}
                          >
                            {editPassword
                              ? "Cancelar Cambio de Contraseña"
                              : "Cambiar Contraseña"}
                          </Button>
                        </Grid>
                        {editPassword && (
                          <>
                            <Grid item xs={12} sm={4} lg={3}>
                              <FormControl required variant="outlined">
                                <TextField
                                  fullWidth
                                  required
                                  className={classes.margin}
                                  id="oldpassword"
                                  name="oldpassword"
                                  label="Contraseña anterior"
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
                            <Grid item xs={12} sm={4} lg={3}>
                              <FormControl required variant="outlined">
                                <TextField
                                  fullWidth
                                  required
                                  className={classes.margin}
                                  id="password"
                                  name="password"
                                  label="Nueva Contraseña"
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
                          </>
                        )}
                        <Grid container className={classes.margin}>
                          Datos Personales
                        </Grid>
                        <Grid container spacing={3}>
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
                                id="edad"
                                name="edad"
                                label="Edad"
                                type="number"
                                variant="outlined"
                                color="secondary"
                                value={users.edad}
                                onInput={(e) =>
                                  Meteor.users.update(users._id, {
                                    $set: {
                                      "edad": e.target.value,
                                    },
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
                        </Grid>
                      </form>
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

                            Nombre: {users.profile.firstName} {users.profile.lastName}

                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container direction="row">
                          <Typography>
                            Rol: {users.profile.role}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container direction="row">
                          <Typography>

                            {users.emails && 'Email: ' + users.emails[0].address}

                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container direction="row">
                          <Typography>

                            Megas Gastados: {Number.parseFloat(users.megasGastadosinBytes / 1000000).toFixed(2) + ' MB'}

                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container direction="row">
                          <Typography>

                            Conexion: {users.Baneado ? 'Desactivado' : "Activado"}

                          </Typography>
                        </Grid>
                      </Grid>
                  </>
                )}

                {Meteor.user().profile.role &&
                  Meteor.user().profile.role == "admin" ? (
                  <Grid item xs={12}>
                    <Divider className={classes.padding10} />
                    <Grid
                      container
                      direction="row-reverse"
                      justify="space-around"
                      alignItems="center"
                    >
                      <IconButton onClick={eliminarUser} aria-label="delete">
                        <DeleteIcon color="primary" fontSize="large" />
                      </IconButton>
                      <Button
                        color={edit ? "secondary" : "primary"}
                        variant="contained"
                        onClick={handleEdit}
                      >
                        {edit ? "Cancelar Edición" : "Editar"}
                      </Button>
                      {edit ? (
                        <Tooltip
                          title={
                            users.baneado
                              ? "Reiniciar MB y Desbloquear al Usuario"
                              : "Bloquear Usuario"
                          }
                        >
                          <Button
                            onClick={handleChangebaneado}
                            variant="contained"
                            color={users.baneado ? "secondary" : "primary"}
                          >
                            {users.baneado ? "Reiniciar MB y Desbloquear" : "Bloquear"}
                          </Button>
                        </Tooltip>
                      ) : (
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
