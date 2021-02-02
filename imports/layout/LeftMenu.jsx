import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";

import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { borders } from "@material-ui/system";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { red } from "@material-ui/core/colors";
import { Box } from "@material-ui/core";

const drawerWidth = 240;
const listaDeLinks = ["dashboard", "guest", "users", "calendar","login","create-user"];

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down('sm')]: {
  },
  [theme.breakpoints.up('md')]: {
  },
  [theme.breakpoints.up('lg')]: {
  },
  link: {
    textDecoration: "none",
    color: "#8b8b8b",
    fontSize: 16,
    fontWeight: "bold",
  },
  item: {
    margin: ".3em",
    padding: ".7em 2em",
    marginLeft: "0",
    transition: "all ease 0.2s",
    "&:hover": {
      color: "#114c84",
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    [theme.breakpoints.down('sm')]: {
      width: "100%",
    },
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

export default function LeftMenu() {
  const classes = useStyles();
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      open={open}
      anchor="left"
    >
      <div
        className={classes.toolbar}
        style={{ background: "radial-gradient(#83003e, #41003e)" }}
      />
      <Divider />
      <List>
        {listaDeLinks.map((anchor) => (
          <Link to={"/" + anchor} className={classes.link}>
            <ListItem button key={anchor} className={classes.item}>
              
                <strong style={{textTransform: 'uppercase'}}>{anchor}</strong>
              
            </ListItem>
          </Link>
        ))}

        
      </List>
      <Divider />
    </Drawer>
  );
}
