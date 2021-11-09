import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  Box,
  Grid,
  Icon,
  Divider,
  Zoom,
  IconButton,
} from "@material-ui/core";
import Paper from '@mui/material/Paper';
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AnyChart from "anychart-react";
import Chip from '@mui/material/Chip';

import moment from 'moment';

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
import { VentasCollection } from "../collections/collections";
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
}));

export default function GraphicsLinealMensualVentasyDeudas() {
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
  const ventas = useTracker(() => {
    Meteor.subscribe("ventas")
    return VentasCollection.find({}).fetch()
  });

  const gastos = (id,fechaStart, fechaEnd) =>{
      let totalAPagar = 0;
      let fechaInicial = new Date(fechaStart)
      let fechaFinal = new Date(fechaEnd)

      // console.log(`fechaInicial: ${fechaInicial}`);
      // console.log(`fechaFinal: ${fechaFinal}`);

      ventas.map(element => {
        let fechaElement = new Date(element.createdAt)

      // console.log(`fechaElement: ${fechaElement}`);

        // fechaElement >= fechaInicial && fechaElement < fechaFinal && console.log(element.userId)
      element.adminId == id && fechaElement >= fechaInicial && fechaElement < fechaFinal && !element.cobrado && (totalAPagar += element.precio)

      })
      return totalAPagar
    }

  const aporte = (id,fechaStart, fechaEnd) =>{
      let totalAPagar = 0;
      let fechaInicial = new Date(fechaStart)
      let fechaFinal = new Date(fechaEnd)
      
      // console.log(`fechaStart: ${fechaStart}`);
      // console.log(`fechaEnd: ${fechaEnd}`);
      // console.log(`fechaInicial: ${fechaInicial}`);
      // console.log(`fechaFinal: ${fechaFinal}`);

      ventas.map(element => {
      let fechaElement = new Date(element.createdAt)

      // console.log(`fechaElement: ${fechaElement}`);
      

        // fechaElement >= fechaInicial && fechaElement < fechaFinal && console.log(element.userId)
        element.adminId == id && fechaElement >= fechaInicial && fechaElement < fechaFinal && (totalAPagar += element.precio)
      })
      return totalAPagar
    }

  const datausers = useTracker(() => {
    let data01 = [];

    let dateStartMonth = moment(new Date())
    let dateEndMonth = moment(new Date())
    dateStartMonth.startOf('month')
    dateEndMonth.startOf('month').add(1,'month')

    Meteor.subscribe("user");
     Meteor.users.find({"profile.role":"admin"}).map(
        (usersGeneral,index) =>{

        
        // console.log("FECHA ACTUAL: " + new Date().getMilliseconds()); 
        // console.log("INICIO DE MES MOMENT: " + dateStartMonth.toISOString()); 
        // console.log("Fin DE MES MOMENT: " + dateEndMonth.toISOString()); 

        aporte(usersGeneral._id,dateStartMonth.toISOString(),dateEndMonth.toISOString()) > 0 && data01.push({
            name:
              usersGeneral.profile.firstName +
              " " +
              usersGeneral.profile.lastName,
              TotalVendido: aporte(usersGeneral._id,dateStartMonth.toISOString(),dateEndMonth.toISOString()),
              Debe: gastos(usersGeneral._id,dateStartMonth.toISOString(),dateEndMonth.toISOString()),
              amt: aporte(usersGeneral._id,dateStartMonth.toISOString(),dateEndMonth.toISOString())
          })
        
        }
      );
    return data01;
    
  });

  return (
      <Zoom in={true}>
        <ResponsiveContainer>
          <ComposedChart
            // width={500}
            // height={400}
            data={datausers}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            {/* <CartesianGrid stroke="#f5f5f5" /> */}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Area
            type="monotone"
            dataKey="amt"
            fill="#8884d8"
            stroke="#8884d8"
          /> */}
            <Bar dataKey="TotalVendido" barSize={20} fill="#2e7d32" radius={5} />
            <Bar dataKey="Debe" barSize={20} fill="#d32f2f" radius={5} />
            {/* <Line type="monotone" dataKey="uv" stroke="#ff7300" /> */}
          </ComposedChart>
        </ResponsiveContainer>
      </Zoom>
        );
}
