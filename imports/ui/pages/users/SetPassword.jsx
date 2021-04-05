import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useTracker } from "meteor/react-meteor-data";
import { Grid, TextField } from '@material-ui/core';
import { Meteor } from "meteor/meteor";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function SetPassword() {
  const [valueusername, setvalueusername] = React.useState("");
  const [valuepassword, setvaluepassword] = React.useState("");
  const [repeatPassword, setrepeatPassword] = React.useState("");
  const [todoOK, settodoOk] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const userActual = useTracker(() => {
    return Meteor.user();
  });
 
  const usernameexist = userActual&&userActual.username ? true : false
  const passwordexist = userActual && userActual.services && userActual.services.password && userActual.services.password.bcrypt ? true : false
  
  useTracker(() => {
    setTimeout(() => {
      setOpen(!usernameexist || !passwordexist)
    }, 3000);
    
   });

  const saveData = () => {
    
    let data = {
      id: Meteor.userId(),
      username : valueusername,
      password : valuepassword,
    }
    if (usernameexist || passwordexist) {
      usernameexist ? data = {
        id: Meteor.userId(),
        password: valuepassword,
      } : data = {
        id: Meteor.userId(),
        username: valueusername,
      }
    }
    setvaluepassword("")
    setvalueusername("")
    $.post("/userpass", data)
    .done(function (data) {
      
      alert("Gracias!!!, sus datos fueron guardados correctamente.")
    })
    .fail(function (data) {
      alert("Ocurrio un Problema. Reintentelo nuevamente")
    })
  };
  const handleLogout = (event) => {
    event.preventDefault();
    Meteor.logout((error) => {
      error && error ? console.log(error.message) : "";
    });
  };
  const handleChangeusername = (event) => {
    setvalueusername(event.target.value);
  };
  const handleChangepassword = (event) => {
    setvaluepassword(event.target.value);
  };
  const handleChangerepeatPassword = (event) => {
    setrepeatPassword(event.target.value);
    
  };
 
  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}>
      <DialogTitle id="customized-dialog-title">Actualizar usuario y contraseña.</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Debe agregar un usuario y una contraseña para su cuenta de VIDKAR,
          <br/>
          Su Cuenta se cerrara cuando inserte los Datos
          y entonces podra iniciar session mediante su <strong>Usuario y Contraseña</strong> o mediante el <strong>Login de Facebook</strong>
        </Typography>
        <Grid container direction="column" justify="center" alignItems="center">
          {!usernameexist &&
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Usuario"
              type="text"
              value={valueusername}
              onChange={handleChangeusername}
              fullWidth
            />}
          {!passwordexist &&
            <>
              <TextField
                margin="dense"
                id="password"
                label="Contraseña"
                type="password"
                value={valuepassword}
                onChange={handleChangepassword}
                fullWidth
              />
              <TextField
                margin="dense"
                id="repeatPassword"
                label="Repita la Contraseña"
                type="password"
                value={repeatPassword}
                onChange={handleChangerepeatPassword}
                fullWidth
              />
            </>}
          
          
        </Grid>
      </DialogContent>
      <DialogActions>
      <Button onClick={handleLogout} variant="contained" color="secondary">
            Logout
          </Button>
        {valueusername && passwordexist||valueusername && repeatPassword && repeatPassword === valuepassword || usernameexist &&
        repeatPassword &&
        repeatPassword === valuepassword ? (
          <Button onClick={saveData} variant="contained" color="primary">
            Guardar
          </Button>
        ) : (
          <Button onClick={saveData} variant="contained" color="primary" disabled>
            Guardar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
