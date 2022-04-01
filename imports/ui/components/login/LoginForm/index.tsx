import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useHistory } from "react-router-dom";
import { colors, Divider, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import FacebookIcon from "@material-ui/icons/Facebook";
import Tooltip from "@material-ui/core/Tooltip";
import GoogleIcon from '@mui/icons-material/Google';
import { VersionsCollection } from "../../../pages/collections/collections";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      marginBottom: theme.spacing(1),
    },
    button: {
      marginTop: theme.spacing(1),
    },
    errorContainer: {
      marginBottom: theme.spacing(2),
      color: colors.red[500],
      textAlign: "center",
    },
  })
);

type Props = {
  className?: string;
};

const LoginForm = ({ className }: Props) => {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    !email || !password
      ? setError("Wrong credentials")
      : Meteor.loginWithPassword(email, password, (error) =>
        error
          ? setError(`Login failed, please try again`)
          : history.push("/pelis")
      );

  };

  const handleLoginFacebook = () => {
    setError("");
    Meteor.loginWithFacebook(
      {
        requestPermissions: ["public_profile", "email",
          //  "user_birthday", "user_age_range","user_gender"
        ]
      },
      function (err) {
        err ? setError(err.message) : history.push("/pelis");
      }
    );
  };

  const handleLoginGoogle = () => {
    setError("");
    Meteor.loginWithGoogle(
      {
        requestPermissions: ["profile", "email",
          //  "user_birthday", "user_age_range","user_gender"
        ]
      },
      function (err) {
        err ? setError(err.message) : history.push("/pelis");
      }
    );
  };

  const handleOauth = (event) => {
    event.preventDefault();
    setError("");

    //@ts-ignore
    Meteor.loginWithFusionAuth({ requestPermissions: ["email"] }, (error) => {
      error ? setError(error.message) : history.push("/dashboard");
    });
  };
  const versionapk = useTracker(() => {

    Meteor.subscribe("versions", { type: "apk" }).ready()
   let version = VersionsCollection.findOne({ type: "apk" })
    return version?version.version:"";
  });

  return (
    <>
      <form onSubmit={handleSubmit} className={className}>
        <Grid
          container
          direction="column"
          justify="center"
          alignContent="center"
        >
          {error && (
            <Typography
              className={classes.errorContainer}
              variant="body1"
              component="p"
            >
              {error}
            </Typography>
          )}
          <TextField
            required
            label="email"
            variant="outlined"
            className={classes.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            label="Password"
            variant="outlined"
            className={classes.input}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
            startIcon={<ExitToAppIcon />}
          >
            Login
          </Button>
        </Grid>
      </form>
      <br />
      <Divider />
      <Grid container direction="column" justify="center" alignContent="center">
        <Grid item xs={12}>
          <Tooltip
            title={
              "Inicia Session con su cuenta de Facebook o Crea una cuenta nueva en caso de que no se haya Registrado anteriormente"
            }
          >
            <Button
              onClick={handleLoginFacebook}
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              startIcon={<FacebookIcon />}
            >
              Registrarse con Facebook
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container direction="column" justify="center" alignContent="center" style={{ paddingBottom: 10 }}>
        <Grid item xs={12}>
          <Tooltip
            title={
              "Inicia Session con su cuenta de Google o Crea una cuenta nueva en caso de que no se haya Registrado anteriormente"
            }
          >
            <Button
              onClick={handleLoginGoogle}
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              startIcon={<GoogleIcon />}
            >
              Registrarse con Google
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Divider />
      <Grid container direction="column" justify="center" alignContent="center">
        <Grid item xs={10}>
          <Tooltip
            title={
              "Puede descargar la aplicación para Android y asi tener al día el estado de su cuenta VidKar"
            }
          >
            <Button
              onClick={() => { window.open("/apk/VidKar.apk").focus(); }}
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              startIcon={<FacebookIcon />}
            >
              Descargar APK {versionapk}
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginForm;
