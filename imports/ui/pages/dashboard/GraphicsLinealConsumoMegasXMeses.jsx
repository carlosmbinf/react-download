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
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import { Link, useParams } from "react-router-dom";

import moment from 'moment';
import 'moment/locale/es';
  
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
import { RegisterDataUsersCollection, VentasCollection } from "../collections/collections";
import { elementTypeAcceptingRef } from "@mui/utils";
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

export default function GraphicsLinealConsumoMegasXMeses(options) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  let { id } = useParams();
  
  moment.locale('es')

  const consumo = useTracker(() => {
    Meteor.subscribe("registerDataUser", (id ? { userId: id } : {}), {
      fields: {
        userId: 1,
        megasGastadosinBytes: 1,
        fecha: 1,
        type: 1,
        vpnMbGastados: 1
      }
    })
    return RegisterDataUsersCollection.find((id ? { userId: id } : {}), {
      fields: {
        userId: 1,
        megasGastadosinBytes: 1,
        fecha: 1,
        type: 1,
        vpnMbGastados: 1
      }, sort: {
        createdAt: -1
      }
    }).fetch()
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

  const aporte =  (type, fechaStart, fechaEnd) =>{
      let totalConsumo = 0;
      let fechaInicial = new Date(fechaStart)
      let fechaFinal = new Date(fechaEnd)
      
      // console.log(`fechaStart: ${fechaStart}`);
      // console.log(`fechaEnd: ${fechaEnd}`);
      // console.log(`fechaInicial: ${fechaInicial}`);
      // console.log(`fechaFinal: ${fechaFinal}`);

     consumo.forEach(element => {

      let fechaElement = new Date(element.fecha)

      // console.log(`fechaElement: ${fechaElement}`);
      

        // fechaElement >= fechaInicial && fechaElement < fechaFinal && console.log(element.userId)
       if (element.type == type) {
         if (id) {
           element.userId == id && fechaElement >= fechaInicial && fechaElement < fechaFinal && (totalConsumo += (element.type == "proxy" ? (element.megasGastadosinBytes ? element.megasGastadosinBytes : 0) : (element.vpnMbGastados ? element.vpnMbGastados : 0)))
         } else {
           fechaElement >= fechaInicial && fechaElement < fechaFinal &&
             (totalConsumo += (element.type == "proxy" ? (element.megasGastadosinBytes ? element.megasGastadosinBytes : 0) : (element.vpnMbGastados ? element.vpnMbGastados : 0)))
         }
       }
        
      })
      return Number((totalConsumo/1024000000).toFixed(2))
    }

  const datausers = useTracker(() => {
    let data01 = [];

    
    for (let index = 11; index >= 0; index--) {
      
      let dateStartMonth = moment(new Date())
      let dateEndMonth = moment(new Date())

      dateStartMonth.startOf('month').subtract(0 + index, 'month').add(1,'d')

      dateEndMonth.endOf('month').subtract(0 + index, 'month').add(1,'d')

      // console.log("FECHA ACTUAL: " + new Date().getMilliseconds());
      // console.log("INICIO DE MES MOMENT: " + dateStartMonth.format("dddd, MMMM Do YYYY, h:mm:ss a"));
      // console.log("INICIO DE MES MOMENT: " + dateStartMonth.format("MMMM(YYYY)"));
      // console.log("Fin DE MES MOMENT: " + dateEndMonth.format("dddd, MMMM Do YYYY, h:mm:ss a"));
      // console.log("Fin DE MES MOMENT: " + dateEndMonth.format("MMMM(YYYY)"));
      data01.push({
        name: `${dateStartMonth.format("MMMM(YYYY)")}`,
        PROXY: aporte("proxy",dateStartMonth.toISOString(), dateEndMonth.toISOString()),
        VPN: aporte("vpn",dateStartMonth.toISOString(), dateEndMonth.toISOString()),
        // amt: aporte(usersGeneral._id, dateStartMonth.toISOString(), dateEndMonth.toISOString())
      })



    }

    data01.forEach(data=>{
      console.log(options.type + " =>" ,data.TotalConsumo)

    })
    
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
          <Tooltip labelStyle={{ color: "rgb(102, 102, 102)" }} contentStyle={{ backgroundColor: "#2a323d5c", backdropFilter: "blur(30px)", borderRadius: 20 }} />
          <Legend />
          <Area
            type="monotone"
            dataKey="PROXY"
            fill="#3f51b5"
            stroke="#3f51b5"
          />
          <Area
            type="monotone"
            dataKey="VPN"
            fill="#2e7d32"
            stroke="#2e7d32"
          />
          {/* <Bar dataKey="TotalConsumo" barSize={20} fill="#2e7d32" radius={5} /> */}
          {/* <Bar dataKey="VPN" barSize={20} fill="#d32f2f" radius={5} /> 
            <Line type="monotone" dataKey="PROXY" stroke="#ff7300" /> */}
        </ComposedChart>
        </ResponsiveContainer>
      </Zoom>
        );
}
