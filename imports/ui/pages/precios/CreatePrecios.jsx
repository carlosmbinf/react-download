import React, { useState, useEffect  } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper, Box, Grid, Icon, IconButton, Zoom, Dialog, CircularProgress } from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from '@material-ui/core/FormHelperText';

import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import { Link, useParams } from "react-router-dom";
import Rotate from 'react-reveal/Rotate';
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import { FormControl, TextField, InputAdornment } from "@material-ui/core";
import MailIcon from "@material-ui/icons/Mail";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SendIcon from "@material-ui/icons/Send";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { PreciosCollection } from "../collections/collections";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    // maxWidth: 275,
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
  createUser: {
    color: "#114c84",
  },
  margin: {
    margin: theme.spacing(1),
  },
  flex: {
    display: "flex",
    justifyContent: "flex-end",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  load: {
    width: 50,
    height: 50,
  },
}));

export default function CreatePrecios() {
  // const [createdAt, setcreatedAt] = useState("");
  const [precio, setprecio] = useState();
  const [type, setType] = useState("megas");
  const [megas, setmegas] = useState();
  const [comentario, setcomentario] = useState("");
  const [detalles, setdetalles] = useState("");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [transition, setTransition] = React.useState(undefined);
  const [load, setLoad] = React.useState(false);
  const [heredaDe, setheredaDe] = React.useState({value:null,label:"NO HEREDA"});


  const types = (type)=>{
    switch (type){
          case "megas":
          return "Proxy por Megas";
          break;
          case "fecha-proxy":
          return "Proxy por Fecha";
          break;
          case "vpnplus":
          return "VPN por Megas";
          break;
          case "fecha-vpn":
          return "VPN por Fecha";
          break;
          default:
          return type;
          break;
        }
  }

  const buscarPrecio = useTracker(() => {
    heredaDe.value&&Meteor.subscribe("precios",{_id:heredaDe.value})
    let precioOficial = heredaDe.value?PreciosCollection.findOne({_id:heredaDe.value}):null
    
    return precioOficial;
  });


useEffect(() => {
   if(buscarPrecio != null){
      setType(buscarPrecio.type);
      setcomentario(buscarPrecio.comentario);
      setmegas(buscarPrecio.megas);
      setdetalles(buscarPrecio.detalles);
    }
  });

  const adminPrincial = useTracker(() => {
    Meteor.subscribe("user",{ username : Meteor.settings.public.administradores[0] } );
    let admin = Meteor.users.findOne({ username: Meteor.settings.public.administradores[0] }) 
    return admin;
  });

  const listadoDePreciosOriginales = useTracker(() => {

    Meteor.subscribe("precios",{userId:adminPrincial&&adminPrincial._id})
    Meteor.subscribe("precios",{userId:Meteor.userId()})
    
    let listadoDePreciosOficiales = []
    listadoDePreciosOficiales.push({value:null,label:"NO HEREDA"})
    let preciosAgregados = []
    PreciosCollection.find({userId:adminPrincial&&adminPrincial._id},{sort:{type:1,megas:1}}).forEach(element=>{
      listadoDePreciosOficiales.push({value:element._id,label:`${element.megas?element.megas+" MB":"ILIMITADO"}  -  ${types(element.type)}  -  ${element.precio} CUP`})
    });

    PreciosCollection.find({userId:Meteor.userId()},{sort:{type:1,megas:1}}).forEach(element=>{
      preciosAgregados.push({value:element.heredaDe,label:`${element.megas?element.megas+" MB":"ILIMITADO"}  -  ${types(element.type)}  -  ${element.precio} CUP`})
    });
    
    return listadoDePreciosOficiales.filter(elementa => !preciosAgregados.find(elementb => elementa.value == elementb.value));
  });

  //Probando Select
  const [searchHerencia, setsearchHerencia] = React.useState("");
  const handleChangeSelect = (event,newValue) => {
    setheredaDe(newValue);
  };

  const handleCloseSelect = () => {
    setOpenSelect(false);
  };

  const handleOpenSelect = () => {
    setOpenSelect(true);
  };


  function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
  }
  const handleClick = (Transition) => () => {
    setTransition(() => Transition);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };
  function handleSubmit(event) {
    event.preventDefault();
    // console.log( 'Email:', email, 'Password: ', password, 'firstName: ', firstName);

    // You should see email and password in console.
    // ..code to submit form to backend here...

    async function makePostRequest() {
      setLoad(true);
      const datosPrecios = {
        userId: Meteor.userId(),
        precio,
        type,
        megas: (type == "megas" || type == "vpn2mb" || type == "vpnplus") ? megas : null,
        comentario,
        detalles,
        heredaDe:buscarPrecio?buscarPrecio._id:null
      };
      try {
        let id = await PreciosCollection.insert(datosPrecios)
        id && (
          setType(""),
          setcomentario(""),
          setmegas(),
          setdetalles(""),
          setprecio(),
          setheredaDe({value:null,label:"NO HEREDA"}),
          setMessage(`Precio ${datosPrecios.precio} CUP Creado`),
          handleClick(TransitionUp),
          setLoad(false),
          setOpen(true))
          
          

      } catch (error) {
        setMessage("Ocurrió un Error");
        handleClick(TransitionUp);
        setLoad(false);
        setOpen(true);
      }

      // var http = require("http");
      // http.post = require("http-post");
      // http.post("/hello", user, (opciones, res, body) => {
      //   if (!opciones.headers.error) {
      //     // console.log(`statusCode: ${res.statusCode}`);
      //     console.log("error " + JSON.stringify(opciones.headers));

      //     setMessage(opciones.headers.message);
      //     handleClick(TransitionUp);
      //     setLoad(false);
      //     setOpen(true);

      //     return;
      //   } else {
      //     console.log(opciones.headers);
      //     setMessage(opciones.headers.message);
      //     handleClick(TransitionUp);
      //     setLoad(false);
      //     setOpen(true);
      //     return;
      //   }
      // });
    }

    makePostRequest();
  }

  const handleChange = (event) => {
    setType(event.target.value);
  };

  




  const classes = useStyles();

  return (
    <>
      <div className={classes.drawerHeader}>
        <IconButton
          color="primary"
          aria-label="delete"
          className={classes.margin}
        >
          <Link to={"/users"}>
            <ArrowBackIcon fontSize="large" color="secondary" />
          </Link>
        </IconButton>
      </div>
      <Dialog aria-labelledby="simple-dialog-title" open={load}>
        <Grid className={classes.load}>
          <CircularProgress />
        </Grid>
      </Dialog>
      <Rotate top left>
        <Paper elevation={5} className={classes.root}>
          <Snackbar
            autoHideDuration={3000}
            open={open}
            onClose={handleClose}
            TransitionComponent={transition}
            message={message}
            key={transition ? transition.name : ""}
          />
          {/* <Button onClick={handleClick(TransitionUp)}>Up</Button> */}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4" color="secondary" component="h2">
                      Agregar Precios
                    </Typography>
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
                    <Grid item container xs={12}>
                       <FormControl fullWidth variant="outlined" required className={classes.formControl}>
                          <Autocomplete
                          required
                                  fullWidth
                                  value={heredaDe}
                                  onChange={(event,newValue)=>{
                                    (newValue && newValue.value)?
                                    handleChangeSelect(event,newValue)
                                    :handleChangeSelect(event,{value:null,label:"NO HEREDA"})
                                    
                                    !(newValue && newValue.value) && setprecio(0)
                                    !(newValue && newValue.value)&&setType("");
                                    !(newValue && newValue.value)&&setcomentario("");
                                    !(newValue && newValue.value)&&setmegas();
                                    !(newValue && newValue.value)&&setdetalles("");
                                  }}
                                  defaultValue={{value:null,label:"NO HEREDA"}}
                                  inputValue={searchHerencia}
                                  className={classes.margin}
                                  onInputChange={(event, newInputValue) => {
                                    setsearchHerencia(newInputValue)
                                  }}
                                  id="controllable-states-demo"
                                  options={listadoDePreciosOriginales}
                                  getOptionLabel={(option) => option.label}
                                  getOptionSelected={(option)=> option.label}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Hereda De"
                                      variant="outlined"
                                    />
                                  )}
                                />
                          {/* <Select
                              labelId="demo-simple-select-outlined-label1"
                              id="demo-simple-select-outlined1"
                              value={heredaDe}
                              onChange={handleChangeSelect}
                              label="Hereda De"
                              // defaultValue={listadoDePreciosOriginales?listadoDePreciosOriginales[0]._id:null}
                            >
                               <MenuItem value={null}>
                              <em>No Hereda</em>
                            </MenuItem>
                              {listadoDePreciosOriginales.map((element)=>{return <MenuItem value={element._id}>{element._id}</MenuItem>})}
                            </Select> */}
                          <FormHelperText>Selecccione de cual Precio hereda el suyo...</FormHelperText>
                        </FormControl>
                        <br/>
                        <br/>
                      </Grid>
                      
                      <Grid container className={classes.margin}>
                        Datos:
                      </Grid>
                      <Grid item xs={12} sm={4} lg={3}>
                                                <FormControl required variant="outlined">
                                                  <TextField
                                                    required
                                                    className={classes.margin}
                                                    id="precio"
                                                    name="Precio"
                                                    label="Precio"
                                                    variant="outlined"
                                                    color="secondary"
                                                    type="number"
                                                    value={precio}
                                                    onInput={(e) => setprecio(e.target.value)}
                                                    InputProps={{
                                                      startAdornment: (
                                                        <InputAdornment position="start">
                                                          $
                                                        </InputAdornment>
                                                      ),
                                                    }}
                                                  />
                                                </FormControl>
                                              </Grid>
                      <Grid container>
                                            
                                              <Grid item xs={12} sm={4} lg={3}>
                                                <FormControl
                                                  variant="outlined"
                                                  className={classes.formControl}
                                                  required
                                                >
                                                  <InputLabel id="demo-simple-select-outlined-label">
                                                    Type
                                                  </InputLabel>
                                                  <Select
                                                   disabled={buscarPrecio?true:false}
                                                    required
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="demo-simple-select-outlined"
                                                    value={type}
                                                    onChange={handleChange}
                                                    label="Type"
                                                  >
                                                    {/* <MenuItem value="">
                                                    <em>None</em>
                                                  </MenuItem> */}
                                                    <MenuItem value={"megas"}>Megas</MenuItem>
                                                    <MenuItem value={"fecha-proxy"}>Fecha - Proxy</MenuItem>
                                                    <MenuItem value={"fecha-vpn"}>Fecha - VPN</MenuItem>
                                                    <MenuItem value={"vpn2mb"}>VPN 2MB</MenuItem>
                                                    <MenuItem value={"vpnplus"}>VPN Plus</MenuItem>
                                                  </Select>
                                                </FormControl>
                                              </Grid>
                                              { (type == "megas" || type == "vpn2mb" || type == "vpnplus") &&
                                                <Grid item xs={12} sm={4} lg={3}>
                                                  <FormControl  required={(type == "megas" || type == "vpn2mb" || type == "vpnplus")?true:false} variant="outlined">
                                                    <TextField
                                                      required={(type == "megas" || type == "vpn2mb" || type == "vpnplus")?true:false}
                                                      className={classes.margin}
                                                      id="megas"
                                                      name="megas"
                                                      label="Megas"
                                                      variant="outlined"
                                                      color="secondary"
                                                      type="number"
                                                      value={megas}
                                                      disabled={buscarPrecio?true:false}
                                                      onInput={(e) => setmegas(e.target.value)}
                                                      InputProps={{
                                                        endAdornment: (
                                                          <InputAdornment position="start">
                                                            MB
                                                          </InputAdornment>
                                                        ),
                                                      }}
                                                    />
                                                  </FormControl>
                                                </Grid>
                                              }
                                              <Grid item xs={12} sm={4}>
                                                <FormControl  required variant="outlined">
                                                  <TextField                              
                                                    className={classes.margin}
                                                    id="comentario"
                                                    name="comentario"
                                                    label="Comentario"
                                                    variant="outlined"
                                                    color="secondary"
                                                    value={comentario}
                                                    required
                                                    disabled={buscarPrecio?true:false}
                                                    onInput={(e) => setcomentario(e.target.value)}
                                                    
                                                  />
                                                </FormControl>
                                              </Grid>
                      
                                              <Grid item xs={12} sm={4}>
                                                <FormControl required variant="outlined">
                                                  <TextField                              
                                                    className={classes.margin}
                                                    id="detalles"
                                                    name="detalles"
                                                    label="Detalles"
                                                    variant="outlined"
                                                    color="secondary"
                                                    value={detalles}
                                                    required
                                                    disabled={buscarPrecio?true:false}
                                                    onInput={(e) => setdetalles(e.target.value)}
                                                    // InputProps={{
                                                    //   startAdornment: (
                                                    //     <InputAdornment position="start">
                                                    //       <AccountCircle />
                                                    //     </InputAdornment>
                                                    //   ),
                                                    // }}
                                                  />
                                                </FormControl>
                                              </Grid>
                      
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
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Rotate>
    </>
  );
}
