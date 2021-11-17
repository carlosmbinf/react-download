import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, Grid, IconButton } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from 'meteor/meteor';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SendRoundedIcon from '@material-ui/icons/SendRounded';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor: "white",
  },
  textTittle: {
    backgroundColor: "#fff",
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

type Props = {
  className?: string;
};

const NavBar = ({ className }: Props) => {

  const theme = useTheme();
  const [error, setError] = useState('');
  const history = useHistory();
  const [open, setOpen] = React.useState(true);

  const userActual = useTracker(() => {
    return Meteor.user();
  });

  const handlelogIn = (event) => {
    event.preventDefault();
    setError('');

    history.push('/')

  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogOut = (event) => {
    event.preventDefault();
    setError('');

    Meteor.logout((error) => {
      error
        ? setError(error.message)
        : history.push('/login')
    });
  };
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography
                variant="h6"
                className={classes.textTittle}
                color="textSecondary"
                noWrap
              >
                <div className={classes.drawerHeader}>
                  <IconButton onClick={handleDrawerOpen}>
                    {theme.direction === "ltr" ? (
                      <ChevronLeftIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                </div>
              </Typography>
            </Grid>
            <Grid item>
            <IconButton aria-label="delete" className={classes.margin}>
                <SendRoundedIcon />
              </IconButton>
              <Typography
                variant="h6"
                className={classes.textTittle}
                color="textSecondary"
                noWrap
              >
                {
                  <strong>
                    {userActual &&
                      userActual.profile &&
                      userActual.profile.firstName
                      ? userActual.profile.firstName
                      : userActual.profile.name}{" "}
                    {userActual &&
                      userActual.profile &&
                      userActual.profile.lastName}
                  </strong>
                }

                {userActual ? (
                  <Button color="secondary" onClick={handleLogOut}>
                    <ExitToAppIcon />
                    LogOut
                  </Button>
                ) : (
                  <Button color="secondary" onClick={handlelogIn}>
                    <ExitToAppIcon />
                    LogIn
                  </Button>
                )}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default NavBar;