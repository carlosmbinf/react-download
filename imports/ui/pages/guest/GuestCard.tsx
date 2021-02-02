import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper, Box, Grid, Icon } from "@material-ui/core";

//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";

const useStyles = makeStyles({
  root: {
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
});

export default function GuestCard(withAdd) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  if (withAdd.withCreate == "true") {
    return (
      <Paper elevation={5} className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <AddCircleRoundedIcon fontSize="large" htmlColor="#114c84" />
              </Grid>
              <Grid item>
                <Typography className={classes.createUsers}>
                  <strong>CREATE USER</strong>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
  return (
    <>
      <Paper elevation={5} className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container direction="row">
              <AccountCircleIcon />
              <Typography color="textSecondary">
                <strong>MERLYS ESQUIVEL</strong>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row">
              <PermContactCalendarRoundedIcon />              
              <Typography color="textSecondary"><strong>Distribuidor</strong></Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
