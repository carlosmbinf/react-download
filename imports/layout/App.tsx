import React, { useState } from "react";
import clsx from "clsx";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { Link } from "react-router-dom";
import Main from "./Main";
import { Button, Grid, Slide } from "@material-ui/core";

import { useTracker } from "meteor/react-meteor-data";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Meteor } from "meteor/meteor";
import Fade from 'react-reveal/Fade';

const drawerWidth = 240;
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

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const useStyles = makeStyles((theme) =>
  createStyles({
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
    root: {
      display: "flex",
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      minHeight: "100vh",
      minWidth: "100vw",
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    textTittle: {
      // backgroundColor: "#fff",
    },
  })
);

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");

  const userActual = useTracker(() => {
    return Meteor.user();
  });

  const listaDeLinks = [
    "dashboard",
    "guest",
    "users",
    "calendar",
    "login",
    "create-user",
    "archivo",
    "create-archivo",
    "downloads",
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogOut = (event) => {
    event.preventDefault();
    setError("");

    Meteor.logout((error) => {
      error && error ? setError(error.message):""
    });
  };
  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <Slide
                      direction="down"
                      in={true}
                      mountOnEnter
                      unmountOnExit
                      style={{ transformOrigin: '0 0 0' }}
                      {...(true ? { timeout: 1000 } : {})}
                    >

        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Grid container justify="flex-end">
            <Slide
                      direction="right"
                      in={true}
                      mountOnEnter
                      unmountOnExit
                      style={{ transformOrigin: '0 0 0' }}
                      {...(true ? { timeout: 2000 } : {})}
                    >
                      <Grid item>
                <Typography
                  variant="h6"
                  className={classes.textTittle}
                  color="textSecondary"
                  noWrap
                >
                  
                  <StyledBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                  >
                    
                    <Avatar
                      alt={
                        userActual &&
                        userActual.profile &&
                        userActual.profile.firstName
                          ? userActual.profile.firstName
                          : userActual.profile.name
                      }
                      src={
                        userActual.services &&
                        userActual.services.facebook &&
                        userActual.services.facebook.picture.data.url
                      }
                    />
                  </StyledBadge>

                  {
                    <strong>
                      {userActual &&
                      userActual.profile &&
                      userActual.profile.firstName
                        ? " " +
                          userActual.profile.firstName +
                          " " +
                          userActual.profile.lastName
                        : " " + userActual.profile.name + " "}
                    </strong>
                  }

                  {userActual && (
                    <Button color="secondary" onClick={handleLogOut}>
                      <ExitToAppIcon />
                      LogOut
                    </Button>
                  )}
                </Typography>
              </Grid>
                    </Slide>
              
            </Grid>
          </Toolbar>
        </AppBar>

        </Slide>
        
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            {listaDeLinks.map((text, index) => (
              <Link to={"/" + text} className={classes.link}>
                <ListItem button key={text} className={classes.item}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <strong style={{ textTransform: "uppercase" }}>{text}</strong>
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          {/* <div className={classes.drawerHeader}/> */}
          <Main />
        </main>
      </div>
    </>
  );
}
