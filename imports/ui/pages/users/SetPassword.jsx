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
  const [valueusername, setvalueusername] = React.useState();
  const [valuepassword, setvaluepassword] = React.useState();
  const [valueemail, setvalueemail] = React.useState();
  const [valuemovil, setvaluemovil] = React.useState();
  const [repeatPassword, setrepeatPassword] = React.useState();
  const [todoOK, settodoOk] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const userActual = useTracker(() => {
    return Meteor.user();
  });
 
  const usernameexist = userActual&&userActual.username
  const passwordexist = 
  // true
  userActual && userActual.services && userActual.services.password && userActual.services.password.bcrypt
  const emailexist = userActual && userActual.emails && userActual.emails[0] && userActual.emails[0].address
  const movilexist = userActual&&userActual.movil
  
  useTracker(() => {
    setTimeout(() => {
      setOpen(!usernameexist || !passwordexist || !emailexist || !movilexist)
    }, 3000);
    
   });

  const saveData = () => {
    
    let data = {
      id: Meteor.userId(),
      username : valueusername,
      password : valuepassword,
      email : valueemail,
      movil : valuemovil,
    }
    // if (usernameexist || passwordexist) {
    //   usernameexist
    //     ? (data = {
    //       id: Meteor.userId(),
    //       password: valuepassword,
    //     },
    //       Meteor.users.update(Meteor.userId(), { $set: { "passvpn": valuepassword } }))
    //     : data = {
    //       id: Meteor.userId(),
    //       username: valueusername,
    //     }
    // }
    !passwordexist && Meteor.users.update(Meteor.userId(), { $set: { "passvpn": valuepassword } })

    setvaluepassword()
    setvalueusername()
    setvalueemail()
    setvaluemovil()
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
  const handleChangeemail = (event) => {
    setvalueemail(event.target.value);
    
  };
  const handleChangemovil = (event) => {
    setvaluemovil(event.target.value);
    
  };
 
  const validarSave = () => {
    let username = usernameexist || valueusername && valueusername != ""
    let password = passwordexist || valuepassword && valuepassword == repeatPassword
    let email = emailexist || valueemail && valueemail != ""
    let movil = movilexist || valuemovil && valuemovil > 51000000 && valuemovil < 60000000

    return (username && password && email && movil)
  }

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}>
      <DialogTitle id="customized-dialog-title">Actualizar datos.</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Debe llenar los datos para su cuenta de VIDKAR,
          <br/>
          Puede que su cuenta se cierre cuando inserte los Datos
          y entonces podra iniciar session mediante su <strong>Usuario y Contraseña</strong> o mediante el <strong>Login de Facebook/Google</strong>
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
            {!emailexist &&
              <TextField
                margin="dense"
                id="email"
                label="Email"
                type="email"
                value={valueemail}
                onChange={handleChangeemail}
                fullWidth
              />}
            {!movilexist &&
              <TextField
                margin="dense"
                id="movil"
                label="Movil"
                type="number"
                value={valuemovil}
                onChange={handleChangemovil}
                fullWidth
              />}
          
        </Grid>
      </DialogContent>
      <DialogActions>
      <Button onClick={handleLogout} variant="contained" color="secondary">
            Logout
          </Button>
        
        <Button onClick={saveData} variant="contained" color="primary" disabled={validarSave() ? false : true}>
            Guardar
          </Button>

      </DialogActions>
    </Dialog>
  );
}
