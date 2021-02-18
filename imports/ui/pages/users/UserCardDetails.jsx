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
  Divider,
  Zoom,
  IconButton,
} from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DeleteIcon from "@material-ui/icons/Delete";
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
      "linear-gradient(0deg, rgba(36,83,162,1) 15%, rgba(245,0,87,0) 100%)",
  },
  secundary: {
    // minWidth: 370,
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

export default function UserCardDetails() {
  const history = useHistory();
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const users = useTracker(() => {
    Meteor.subscribe("user", useParams().id);
    return Meteor.users.findOne({ _id: useParams().id });
  });
  function eliminarUser() {
    Meteor.users.remove({ _id: users._id });
    alert("Usuario Eliminado");
    history.push("/users");
  }
  return (
    <>
      <div className={classes.drawerHeader}>
        <Link to={"/users"}>
          <IconButton
            color="primary"
            aria-label="delete"
            className={classes.margin}
          >
            <ArrowBackIcon fontSize="large" color="secondary" />
          </IconButton>
        </Link>
      </div>

      {users && (
        <Zoom in={true}>
          <Paper
            elevation={5}
            className={
              users.profile.role !== "admin"
                ? classes.primary
                : classes.secundary
            }
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container direction="row" justify="center">
                  <Avatar
                    className={classes.large}
                    alt={
                      users && users.profile.firstName
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
                  <AccountCircleIcon />
                  <Typography color="textSecondary">
                    <strong>
                      {users.profile.firstName} {users.profile.lastName}
                    </strong>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row">
                  <PermContactCalendarRoundedIcon />
                  <Typography color="textSecondary">
                    <strong>{users.profile.role}</strong>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row">
                  <MailIcon />
                  <Typography color="textSecondary">
                    <strong>{users.emails && users.emails[0].address}</strong>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider className={classes.padding10} />
                <Grid
                  container
                  direction="row-reverse"
                  justify="space-around"
                  alignItems="center"
                >
                  {Meteor.user().profile.role && Meteor.user().profile.role == "admin" ? (
                    <IconButton onClick={eliminarUser} aria-label="delete">
                      <DeleteIcon fontSize="large" />
                    </IconButton>
                  ) : (
                    <div></div>
                  )}

                  <Typography
                    variant="h5"
                    color={
                      users.profile.role == "admin" ? "primary" : "secondary"
                    }
                  >
                    <PermContactCalendarRoundedIcon /> {users.profile.role}
                  </Typography>
                  <div />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Zoom>
      )}
    </>
  );
}
