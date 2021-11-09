import React from "react";
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
  Zoom,
  IconButton,
} from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AnyChart from "anychart-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
} from "recharts";

import GraphicsPieChart from "./GraphicsPieChart";
import GraphicsLinealMensualVentasyDeudas from "./GraphicsLinealMensualVentasyDeudas";
import GraphicsLinealTotalVentasyDeudas from "./GraphicsLinealTotalVentasyDeudas";
import { VentasCollection } from "../collections/collections";

import moment from 'moment';

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
    minWidth: 370,
    width: "100%",
    borderRadius: 20,
    padding: "2em",
    background:
      "linear-gradient(0deg, rgba(36,83,162,1) 15%, rgba(245,0,87,0) 100%)",
  },
  secundary: {
    minWidth: 370,
    width: "100%",
    borderRadius: 20,
    padding: "2em",
    background:
      "linear-gradient(0deg, rgba(245,0,87,1) 15%, rgba(245,0,87,0) 100%)",
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
  margin: {
    margin: theme.spacing(2),
  },
  paddingTop20:{
    paddingTop: 20
  }
}));

export default function DashboardInit() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;



  const data = [
    {
      name: "Page A",
      uv: 590,
      pv: 800,
      amt: 1400,
    },
    {
      name: "Page B",
      uv: 868,
      pv: 967,
      amt: 1506,
    },
    {
      name: "Page C",
      uv: 1397,
      pv: 1098,
      amt: 989,
    },
    {
      name: "Page D",
      uv: 1480,
      pv: 1200,
      amt: 1228,
    },
    {
      name: "Page E",
      uv: 1520,
      pv: 1108,
      amt: 1100,
    },
    {
      name: "Page F",
      uv: 1400,
      pv: 680,
      amt: 1700,
    },
  ];


  const data02 = [
    { name: "Group A", value: 2400 },
    { name: "Group B", value: 4567 },
    { name: "Group C", value: 1398 },
    { name: "Group D", value: 9800 },
    { name: "Group E", value: 3908 },
    { name: "Group F", value: 4800 },
  ];

  const ventas = useTracker(() => {
    Meteor.subscribe("ventas")
    return VentasCollection.find({}).fetch()
  });

  const gastos = (id, mensual) =>{
    let dateStartMonth = moment(new Date())
      let dateEndMonth = moment(new Date())
      dateStartMonth.startOf('month')
      dateEndMonth.startOf('month').add(1,'month')
      let totalAPagar = 0
      let fechaInicial = new Date(dateStartMonth.toISOString())
      let fechaFinal = new Date(dateEndMonth.toISOString())
    mensual ? (
      ventas.map(element => {
        let fechaElement = new Date(element.createdAt)
        element.adminId == id && fechaElement >= fechaInicial && fechaElement < fechaFinal && !element.cobrado && (totalAPagar += element.precio)
      })
    ) : (
      ventas.map(element => {
        element.adminId == id && !element.cobrado && (totalAPagar += element.precio)
      })
    )

    return totalAPagar
  }

  const aporte = (id, mensual) => {
    let dateStartMonth = moment(new Date())
    let dateEndMonth = moment(new Date())
    dateStartMonth.startOf('month')
    dateEndMonth.startOf('month').add(1, 'month')
    let totalAPagar = 0
    let fechaInicial = new Date(dateStartMonth.toISOString())
    let fechaFinal = new Date(dateEndMonth.toISOString())

    mensual ? (
      ventas.map(element => {
        let fechaElement = new Date(element.createdAt)
        element.adminId == id && fechaElement >= fechaInicial && fechaElement < fechaFinal && (totalAPagar += element.precio)
      })
    ) : (
      ventas.map(element => {
        let fechaElement = new Date(element.createdAt)
        element.adminId == id && (totalAPagar += element.precio)
      })
    )


    return totalAPagar
  }

  const datausersMoneyGeneral = useTracker(() => {
    let recogido = 0
    let deuda = 0
    Meteor.subscribe("user");
    Meteor.users.find({ "profile.role": "admin" }).map(
      (usersGeneral, index) => {


        // console.log("FECHA ACTUAL: " + new Date().getMilliseconds()); 
        // console.log("INICIO DE MES MOMENT: " + dateStartMonth.toISOString()); 
        // console.log("Fin DE MES MOMENT: " + dateEndMonth.toISOString()); 

        aporte(usersGeneral._id) > 0 && (recogido += aporte(usersGeneral._id))
        gastos(usersGeneral._id) > 0 && (deuda += gastos(usersGeneral._id))

      }
    );
    let data = {
      recogido,
      deuda
    }
    return data;

  });

  const datausersMoneyMensual = useTracker(() => {
    let recogido = 0
    let deuda = 0
    Meteor.subscribe("user");
    Meteor.users.find({ "profile.role": "admin" }).map(
      (usersGeneral, index) => {


        // console.log("FECHA ACTUAL: " + new Date().getMilliseconds()); 
        // console.log("INICIO DE MES MOMENT: " + dateStartMonth.toISOString()); 
        // console.log("Fin DE MES MOMENT: " + dateEndMonth.toISOString()); 

        aporte(usersGeneral._id,true) > 0 && (recogido += aporte(usersGeneral._id,true))
        gastos(usersGeneral._id,true) > 0 && (deuda += gastos(usersGeneral._id,true))

      }
    );
    let data = {
      recogido,
      deuda
    }
    return data;

  });

  return (
    <>
      <div className={classes.drawerHeader}></div>

      <Zoom in={true}>
        <>
          {/* <Grid item xs={12}>
              <AnyChart
                type="column"
                data={[
                  { x: "John", value: 10000 },
                  { x: "Jake", value: 12000 },
                  {
                    x: "Peter",
                    value: 13000,
                    normal: {
                      fill: "#5cd65c",
                      stroke: null,
                      label: { enabled: true },
                    },
                    hovered: {
                      fill: "#4554",
                      stroke: null,
                      label: { enabled: true },
                    },
                    selected: {
                      fill: "#5cd65c",
                      stroke: null,
                      label: { enabled: true },
                    },
                  },
                  { x: "James", value: 10000 },
                  { x: "Mary", value: 9000 },
                ]}
                title="Simple pie chart"
              />
            </Grid> */}

          {Meteor.user().username == "carlosmbinf" &&
            <>              
              <Grid container item xs={12} justify="space-evenly" alignItems="center" className={classes.paddingTop20}>
              <Chip style={{width:"90%"}} color='primary' label="Ventas y Deudas Mensual:"/>
              <Grid container direction="row" justify="center" alignItems="center" item xs={12} spacing={1} style={{ padding: 20 }}>
                <Grid item>
                  <Chip variant="outlined" color='success' label={`Recaudado: $${datausersMoneyMensual.recogido}`} />
                </Grid>
                <Grid item>
                  <Chip variant="outlined" color='error' label={`Deben: $${datausersMoneyMensual.deuda}`}/>
                </Grid>
              </Grid>
                <div style={{ width: "100%", height: 300 }}>
                  <GraphicsLinealMensualVentasyDeudas />
                </div>
              </Grid>

              <Divider variant="middle" />
              <Grid container item xs={12} justify="space-evenly" alignItems="center" className={classes.paddingTop20}>
              <Chip style={{width:"90%"}} color='primary' label="Ventas y Deudas General:" />
              <Grid container direction="row" justify="center" alignItems="center" item xs={12} spacing={1} style={{ padding: 20 }}>
                <Grid item>
                  <Chip variant="outlined" color='success' label={`Recaudado: $${datausersMoneyGeneral.recogido}`} />
                </Grid>
                <Grid item>
                  <Chip variant="outlined" color='error' label={`Deben: $${datausersMoneyGeneral.deuda}`}/>
                </Grid>
              </Grid>
                <div style={{ width: "100%", height: 300 }}>
                  <GraphicsLinealTotalVentasyDeudas />
                </div>
              </Grid>
            </>}

          <Divider variant="middle" />
          <Grid container item xs={12} justify="space-evenly" alignItems="center" className={classes.paddingTop20}>
            <Chip color='primary' label="Cantidad de Usuarios:" />
            <Grid container item xs={12} justify="space-evenly" alignItems="center" >
              <GraphicsPieChart />
            </Grid>

          </Grid>
        </>
      </Zoom>
    </>
  );
}
