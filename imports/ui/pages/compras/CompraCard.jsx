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
import { Link } from "react-router-dom";
import Fade from 'react-reveal/Fade';
import Carousel from "../../components/carousel/Carousel";
import {PreciosCollection} from "../collections/collections";
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
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const precios = useTracker(() => {
    Meteor.subscribe("precios",{type:options.type});
    return PreciosCollection.find({type:options.type}).fetch();
  });

const user = useTracker(() => {
    Meteor.subscribe("user",{"_id":Meteor.userId()},{
      fields:{
        megasGastadosinBytes:1,
        fechaSubscripcion:1,
        megas:1
      }
    });
    return Meteor.user();
  });

  const items = precios.map((compra, i) => {
    
    return (
      <>
              <Button
              color="inherit"
              className={classes.boton}
            >
                <Paper
                  elevation={5}
                  className={classes.primary}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <Grid container direction="row" justify="center">
                        
                      </Grid>
                      <Grid container direction="row">
                        <Grid item xs={12}>
                          {/* <AccountCircleIcon /> */}
                          <br/>
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
                      
                      <Divider  />
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
                          ${compra.comentario}
                        </Typography>
                      </Grid>
                      <Divider  />
                      
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
                      <Divider  />
                    </Grid>
                  </Grid>
                </Paper>
                </Button>
        </>
    );
  });

  return (
    <>

    {(user.megasGastadosinBytes || user.fechaSubscripcion || user.megas) && precios.length && <Fade left>
        <div style={{ width: "100%" }}>
            <Carousel items={items} />
          </div>
        </Fade>}
    </>
  );
}
