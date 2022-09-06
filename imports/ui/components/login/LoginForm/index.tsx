import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useHistory } from "react-router-dom";
import { colors, Divider, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';


import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import FacebookIcon from "@material-ui/icons/Facebook";
import Tooltip from "@material-ui/core/Tooltip";
import GoogleIcon from '@mui/icons-material/Google';
import { VersionsCollection } from "../../../pages/collections/collections";



import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      marginBottom: theme.spacing(1),
      minWidth: "80%",
    },
    button: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      borderRadius: 20
    },
    errorContainer: {
      marginBottom: theme.spacing(2),
      color: colors.red[500],
      textAlign: "center",
    },
    form: {
      transitionDelay: `600ms !important`,
      borderRadius: "13%",
      // background: "#0ebaf775",
      backgroundImage: "radial-gradient(circle, rgba(2,0,36,0) 0%, rgba(112,96,255,0.7727901158707865) 67%)",
      opacity: 1,
      padding: "25px",
      paddingBottom: 10
      // backdropFilter: "blur(5px)",
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
  const [openTerminos, setOpenTerminos] = React.useState(false);
  const [openPrivacidad, setOpenPrivacidad] = React.useState(false);

  const STATE_MACHINE_NAME = "Login Machine"
  const { rive, RiveComponent } = useRive({
    src: "/animations/animated_login_screen.riv",
    autoplay: true,
    animations: "idle",
    // artboard:"Teddy",
    stateMachines: STATE_MACHINE_NAME
  });

  var isChecking = useStateMachineInput(rive, STATE_MACHINE_NAME, "isChecking")
  var isHandsUp = useStateMachineInput(rive, STATE_MACHINE_NAME, "isHandsUp")
  var trigFail = useStateMachineInput(rive, STATE_MACHINE_NAME, "trigFail")
  var trigSuccess = useStateMachineInput(rive, STATE_MACHINE_NAME, "trigSuccess")
  
 
  // const actualizarBear = (type) => {
  //   switch (type) {
  //     case "user":
  //       isChecking.value = true
  //       break;
  //     case "password":
  //       isHandsUp.value = true
  //       break;
  //     case "error":
  //       trigFail.fire()
  //       break;
  //     case "ok":
  //       trigSuccess.fire()
  //       break;
  //     default:
  //       break;
  //   }
  // }

  const history = useHistory();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const handleClickOpenTerminos = () => {
    setOpenTerminos(true);
  };

  const handleCloseTerminos = () => {
    setOpenTerminos(false);
  };

  const handleClickOpenPrivacidad = () => {
    setOpenPrivacidad(true);
  };

  const handleClosePrivacidad = () => {
    setOpenPrivacidad(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    

    !email || !password
      ? setError("Wrong credentials")
      :  Meteor.loginWithPassword(email, password, (error) =>
        error
          ? ((trigFail&&trigFail.fire()),setError(`Login failed, please try again`))
          :((trigSuccess&trigSuccess.fire()), history.push("/pelis"))
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
    return version ? version.version : "";
  });

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={openTerminos}
        onClose={handleCloseTerminos}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Términos y condiciones"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            La Empresa de Streaming de Cuba S.A. (VidKar) le ofrece el servicio de Streaming y búsqueda de información y de publicidad sujeto a estos términos y condiciones, los cuales establecen el acceso y el uso del sitio web de VidKar, incluyendo los contenidos y servicios, puestos su disposición.
          </DialogContentText>
          <DialogContentText>
            Se le recomienda que periódicamente consulte los términos y condiciones establecidos en el presente documento puesto que VidKar se reserva el derecho de modificarlos cuando lo estime oportuno. Las modificaciones realizadas tendrán plena vigencia a partir de su publicación en el sitio web. La utilización de este sitio web, implica la aceptación integral de los términos y condiciones establecidos en el presente documento.
          </DialogContentText>
          Información legal
          <DialogContentText>
            El acceso al sitio web de VidKar es gratuito. Esta información legal se complementa con la Política de Privacidad y con estos Términos y Condiciones de Uso.
          </DialogContentText>
          <DialogContentText>
            Todo el contenido de esta web es propiedad intelectual de VidKar, quedando reservados todos los derechos. Se prohíbe su reproducción total o parcial. Cualquier utilización de los mismos contraria a las normas en materia de propiedad intelectual e industrial será tratada con apego a la legislación vigente.
          </DialogContentText>
          <DialogContentText>
            Para consultas generales sobre este sitio y además con otros productos o servicios como realización, edición y distribución de la Informacion que ofrecemos, podrán contactarnos a través de un mensjae de Whatsapp a travez del telefono <a href="tel:+17028140002">+1 702 814 0002</a>
          </DialogContentText>
          <DialogContentText>
            VidKar realizará todos los esfuerzos que sean razonables para intentar garantizar la disponibilidad y accesibilidad a este sitio web, así como a sus servicios, durante las 24 horas al día durante todos los días del año. No obstante, podrán producirse interrupciones por el tiempo que resulte necesario debido a causas de fuerza mayor, entendida ésta como todo evento o hecho extraordinario proveniente de la naturaleza o del actuar humano, imprevisible o imposible de evitar, que paralice de modo total o parcial el cumplimiento de las obligaciones, además las operaciones de mantenimiento necesarias que impliquen la suspensión del acceso o utilización del sitio web.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTerminos} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openPrivacidad}
        onClose={handleClosePrivacidad}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Política de privacidad"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta Política de Privacidad establece los términos en que se utiliza y protege la información y los datos personales que son proporcionados por los usuarios, al momento de su publicación en el sitio web de VidKar.
          </DialogContentText>
          <DialogContentText>
            A los efectos de la presente "Política", se entiende por Usuario a la persona que voluntariamente se registre en este sitio web, mediante los formularios establecidos por el sitio web de VidKar, en tanto Visitante es aquella persona que accede libremente a la información disponible en este sitio Web sin necesidad de registrarse previamente.
          </DialogContentText>
          <DialogContentText>
            VidKar y el Usuario asumen la obligación de mantener el principio de confidencialidad de dicha información, así como de utilizar ésta exclusivamente en los términos pactados en el correspondiente contrato.
          </DialogContentText>
          <DialogContentText>
            El tratamiento a la información y los datos personales que se realiza en el sitio https://vidkar.ddns.net de VidKar, se rige por las siguientes reglas:

            <li>Los datos personales de los Usuarios serán utilizados para el cumplimiento de los fines indicados en el formulario correspondiente y siempre dentro de la competencia y atribuciones de VidKar.</li>
            <li>VidKar asegurará la confidencialidad de los datos personales de los usuarios, requeridos para su registro en el sitio web de VidKar.</li>
            <li>VidKar publicará el contenido de la información suministrada y el sitio de enlace, respetando la integridad de los contenidos que se suministran, siempre y cuando estos no comprendan algún elemento que atente contra la dignidad de personas, ideas, religiones o símbolos de cualquier país o de una entidad nacional o internacional; sean contrarios a la ley, a la moral, a las buenas costumbres, a las normas de conducta generalmente aceptadas o atenten contra el orden público.</li>
            <li>VidKar realizará el filtrado y tratamiento de datos mediante mecanismos automatizados, con el objetivo de generar registros de la actividad de los visitantes y registros de audiencia y sólo utilizará dicha información para la elaboración de informes que cumplan con los objetivos de evaluación del comportamiento del servicio en cuestión. En ningún caso realizará operaciones que impliquen asociar dicha información a algún usuario identificado o identificable o relacionar a este con otro sitio web sin su consentimiento.</li>
            <li>Ambas partes respetarán las disposiciones vigentes sobre derechos de Propiedad Intelectual.</li>
            <li>El Usuario garantiza y declara que es legítimo titular de los derechos de Propiedad Intelectual asociados a los contenidos, informaciones y datos objeto de publicidad en el sitio web de VidKar o que en su defecto cuenta con la debida autorización del titular de tales derechos. Los derechos antes mencionados comprenden sin limitación: las marcas, nombres comerciales, lemas comerciales, emblemas empresariales, rótulos de establecimientos, indicaciones de procedencia; nombres de dominio; dibujos industriales y diseños industriales; derechos de autor que comprenden cualquier manifestación de las artes sin que se limiten: a las obras escritas y orales, las obras musicales, con letra o sin ella; las obras audiovisuales; las obras radiofónicas; las obras de dibujo, pintura, grabado, diseño y otras similares; las obras fotográficas y otras de carácter similar; las obras de artes plásticas; los mapas, planos, croquis y otras obras similares; las traducciones, versiones, adaptaciones, arreglos musicales y demás transformaciones de carácter creativo de una obra científica, literaria, artística o educacional; las antologías, enciclopedias y otras compilaciones.</li>
            <li>El Usuario garantiza que las informaciones, contenidos y datos proporcionados para su publicaciín en el sitio web, no violan los derechos de Propiedad Intelectual de terceros, ni atentan contra la dignidad de las personas. El Usuario será responsable ante posibles reclamaciones y perjuicios que se generen por tales motivos.</li>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrivacidad} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item container justify="center" alignContent="center" xs={12}>
      <RiveComponent
            // onMouseEnter={() => rive && rive.play()}
            // onMouseLeave={() => rive && rive.pause()}
            // onMouseOver={()=> rive.play()}
            onClick={() => console.log(rive)}
            // onLoad={() => console.log(rive)}
            width={200}
            height={150}
          style={{ width: 200, height: 150}}
          />
      </Grid>
      
      <Grid item className={classes.form} >
        
        <form onSubmit={handleSubmit} className={className}>
          

          <Grid
            container
            direction="column"
            justify="center"
            alignContent="center"
          >

            <TextField
              required
              color="secondary"
              label="email"
              variant="outlined"
              className={classes.input}
              value={email}
              onChange={(e) => {
                e.preventDefault()
                setEmail(e.target.value)
              }}
              onFocus={(event) => {
                isChecking && (isChecking.value = true)
              }}
              onBlur={(event) => {
                // console.log("PERDIO EL FOCUS")
                isChecking && (isChecking.value = false)
              }}
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
              color="secondary"
              label="Password"
              variant="outlined"
              className={classes.input}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(event) => {
                isHandsUp & (isHandsUp.value = true)
              }}
              onBlur={(event) => {
                // console.log("PERDIO EL FOCUS")
                isHandsUp && (isHandsUp.value = false)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography
                className={classes.errorContainer}
                variant="body1"
                component="p"
              >
                {error}
              </Typography>
            )}
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
      </Grid>
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
              disabled
            >
              Registrarse con Facebook
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container direction="column" justify="center" alignContent="center">
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
            // startIcon={<FacebookIcon />}
            >
              Descargar APK {versionapk}
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Divider />
      <Grid container justify="center" alignContent="center" >
        <Grid item container justify="center" alignContent="center" xs={12} sm={6} md={4}>
          <Tooltip
            title={
              "Términos y condiciones"
            }
          >
            <Button
              onClick={handleClickOpenTerminos}
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
            // startIcon={<FacebookIcon />}
            >
              Términos y condiciones
            </Button>
          </Tooltip>
        </Grid>
        <Grid item container justify="center" alignContent="center" xs={12} sm={6} md={4}>
          <Tooltip
            title={
              "Política de privacidad"
            }
          >
            <Button
              onClick={handleClickOpenPrivacidad}
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
            // startIcon={<FacebookIcon />}
            >
              Política de privacidad
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

    </>
  );
};

export default LoginForm;
