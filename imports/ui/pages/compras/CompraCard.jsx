import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper, Box, Grid, Icon, Divider, Zoom, Slide } from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { Link, useParams } from "react-router-dom";
import Fade from 'react-reveal/Fade';
import Carousel from "../../components/carousel/Carousel";
import { PreciosCollection, VentasCollection } from "../collections/collections";
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
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
    maxWidth: 300,
    borderRadius: 20,
    padding: "2em",
  },
  primary: {
    padding: "15px",
    minWidth: 220,
    maxWidth: 220,
    maxHeight: 263,
    minHeight: 263,
    borderRadius: 20,
    // padding: "2em",
    background:
      "linear-gradient(0deg, rgba(36,83,162,1) 15%, rgba(245,0,87,0) 100%)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  secundary: {
    padding: "15px",
    minWidth: 220,
    maxWidth: 220,
    maxHeight: 263,
    minHeight: 263,
    borderRadius: 20,
    // padding: "2em",
    background:
      "linear-gradient(0deg, rgba(245,0,87,1) 15%, rgba(245,0,87,0) 100%)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  boton: {
    margin: 15,
    borderRadius: 20,
    padding: 0,
  },
  rootADD: {
    minWidth: 220,
    maxWidth: 220,
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
    marginTop: "300px",
  },
}));

export default function CompraCard(options) {
  const [openDialog, setOpenDialog] = React.useState(-1);
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const { id } = useParams()



  const user = useTracker(() => {
    Meteor.subscribe("user", { "_id": id }, {
      fields: {
        megasGastadosinBytes: 1,
        fechaSubscripcion: 1,
        megas: 1,
        bloqueadoDesbloqueadoPor: 1
      }
    });
    return Meteor.users.findOne(id);
  });


  const compras = useTracker(() => {

    var notification = null

    Meteor.subscribe("ventas", {
      userId: user && user._id,
      cobradoAlAdmin: false
    }, {
      fields: {
        _id: 1,
        userId: 1,
        cobradoAlAdmin: 1,
        comentario: 1
      }
    });

    let compra = VentasCollection.find({
      userId: user && user._id,
      cobradoAlAdmin: false
    }).fetch()

    let options = {

      body: `Tienes ${compra.length} Compras pendientes...`,
      icon: "/favicon.ico",
      // dir: "ltr",
      // onClick: ()=>{alert("hola")} 
    };

    //mens.length > 0 && (
    // notification = new Notification("VIDKAR", options)
    // alert(options.body)
    //  )

    return compra;
  });


  const precios = useTracker(() => {
    Meteor.subscribe("precios", { userId: user && user.bloqueadoDesbloqueadoPor ? user.bloqueadoDesbloqueadoPor : "", type: options.type });
    return PreciosCollection.find({ userId: user && user.bloqueadoDesbloqueadoPor ? user.bloqueadoDesbloqueadoPor : "", type: options.type }).fetch();
  });

  const adminDelUser = useTracker(() => {
    Meteor.subscribe("user", { "_id": user && user.bloqueadoDesbloqueadoPor ? user.bloqueadoDesbloqueadoPor : "" }, {
      fields: {
        descuentoproxy: 1,
        descuentovpn: 1,
        username: 1,
        _id: 1
      }
    });
    return Meteor.users.findOne({ "_id": user && user.bloqueadoDesbloqueadoPor ? user.bloqueadoDesbloqueadoPor : "" });
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const name = (type) => {
    switch (type) {
      case "megas":
        return "Proxy por Megas"
        break;
      case "fecha-proxy":
        return "Proxy por Tiempo"
        break;
      case "vpnplus":
        return "VPN por Megas"
        break;
      case "fecha-vpn":
        return "VPN por Tiempo"
        break;
      default:
        "Compras"
        break
    }
  }

  const items = precios.map((compra, i) => {



    const handleClickOpen = () => {
      console.log(compra)
      setOpenDialog(i);
    };

    const handleClose = () => {
      setOpenDialog(-1);
    };

    const comprar = () => {
      Meteor.call("addVentasOnly", id, adminDelUser._id, compra)
      handleClose()
    };



    return (
      <>
        <Dialog
          open={openDialog == i}
          onClose={handleClose}
          fullScreen={fullScreen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Usted desea comprar el siguiente artículo?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <br />
              <Paper elevation={12} style={{ borderRadius: 30, padding: 10, paddingRight: 20, paddingBottom: 1, backgroundColor: "#3f51b5" }}>
                <ul>
                  <li>
                    <strong>{compra.detalles}</strong>
                    <h5 style={{ textAlign: "end" }}>Precio: <strong>{compra.precio}CUP</strong></h5>
                  </li>
                </ul>
              </Paper>
              <br />
              <p>
                Nota:
                <br />
                Una vez que se confirme que se recibió el pago se activará automáticamente la compra seleccionada.
                <br />
                Por favor comuníquese con su administrador para más información.
              </p>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" onClick={comprar} color="primary" autoFocus>
              Comprar
            </Button>
          </DialogActions>
        </Dialog>
        <h2>{name}</h2>
        <br />
        <Button
          color="secondary"
          className={classes.boton}
          onClick={handleClickOpen}
          disabled={compras.find(element=> element.comentario == compra.comentario)}
        >
          <Paper
            elevation={5}
            className={compras.find(element => element.comentario == compra.comentario) ? classes.secundary : classes.primary}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container direction="row" justify="center">

                </Grid>
                <Grid container direction="row">
                  <Grid item xs={12}>
                    {/* <AccountCircleIcon /> */}
                    <br />
                    <Typography color="textSecondary" noWrap>
                      <strong>
                        {compra.type == "megas" && "proxy"}
                        {compra.type == "vpnplus" && "vpn plus"}
                        {compra.type == "fecha-proxy" && "Proxy ilimitado"}
                        {compra.type == "fecha-vpn" && "VPN ilimitada"}
                      </strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container direction="row">
                  <Grid item xs={12}>
                    <MailOutlineOutlinedIcon />
                    <Typography color="textSecondary" noWrap>
                      <strong>
                        {compra.megas} MB
                      </strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>

                <Divider />
                <Grid container direction="row" justify="center">
                  <Typography
                  // variant="h5"
                  // color={
                  //   compra.profile.role == "admin"
                  //     ? "secondary"
                  //     : "primary"
                  // }
                  >
                    {/* <PermContactCalendarRoundedIcon />{" "} */}
                    {compra.detalles}
                  </Typography>
                </Grid>
                <Divider />

                <Grid container direction="row" justify="center">
                  <Typography
                    variant="h5"
                  // color={
                  //   compra.profile.role == "admin"
                  //     ? "secondary"
                  //     : "primary"
                  // }
                  >
                    {/* <PermContactCalendarRoundedIcon />{" "} */}
                    ${compra.precio}
                  </Typography>
                </Grid>
                <Divider />
              </Grid>
            </Grid>
          </Paper>
        </Button>
      </>
    );
  });

  return (
    <>
      {user && (user.megasGastadosinBytes || user.fechaSubscripcion || user.megas) && precios.length > 0 && <Fade left>
        <div style={{ width: "100%" }}>
          <br />
          <h2 style={{ textAlign: "center" }}>{name(options.type)}</h2>
          <Carousel items={items} />
        </div>
      </Fade>}
    </>
  );
}
