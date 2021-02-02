import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import LoginForm from "../../components/login/LoginForm";
import {
  Grid,
  Typography,
  Link,
  ThemeProvider,
  Fade,
} from "@material-ui/core";
import { theme } from "../../../startup/client/theme";
import {
  BrowserRouter as Router,
  Route,
  useRouteMatch,
  useParams
} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: "hidden",
      backgroundImage: 'url("/bg_home.png")',
      backgroundPosition: "center",
      backgroundSize: "cover",
    },
    path: {
      position: "fixed",
      height: "100vh",
      width: "60vw",
      opacity: 0,
      background: theme.palette.primary.main,
      clipPath: `polygon(0% 0%, 50% 0, 80% 80%, 55% 100%, 0% 100%)`,
      animation: "descend 1s ease",
      animationFillMode: "forwards",
    },
    pathSecondary: {
      height: "100vh",
      background: theme.palette.primary.main,
      opacity: 0,
      clipPath: `polygon(50% 5%, 60% 5%, 90% 81%, 65% 100%, 38% 100%)`,
      animation: "translate-left 1s ease",
      animationFillMode: "forwards",
    },
    info: {
      position: "absolute",
      zIndex: 10,
      color: "white",
      maxWidth: "40vw",
      transitionDelay: `500ms !important`,
      top: "50%",
      transform: "translateY(-50%)",
    },
    img: {
      height: "18em",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    title: {
      fontSize: 28,
      marginBottom: theme.spacing(20),
      textAlign: "center",
      maxWidth: 300,
    },
    link: {
      color: "inherit",
      fontFamily: `'Blinker', sans-serif`,
      marginRight: theme.spacing(5),
      marginLeft: theme.spacing(5),
    },
    form: {
      transitionDelay: `600ms !important`,
      borderRadius: "50%",
      background: "#fafafac2",
      opacity: 1,
      padding: "140px",
      width: "100%",
    },
  })
);

const LoginPage = () => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(true);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const handleLoginFacebook = () => {
    Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, function(err){
      if (err) {
          console.log('Handle errors here: ', err);
      }else{
        Router.go("/")
      }
  });
  
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.root}
        justify="center"
      >
        <Grid item xs={5} className={classes.form}>
          <LoginForm />
          
<button onClick={handleLoginFacebook}>loguin to facebook</button>
        </Grid>
        {/* <Slide direction="up" in={checked} mountOnEnter>

            </Slide> */}

        <Grid item xs={7}>
          <Fade in>
            <Grid
              container
              className={classes.info}
              direction="column"
              alignItems="center"
            >
              <Grid item>
                {/* <img src="/bg_home.png" className={classes.img} /> */}
              </Grid>
              {/* <Grid item>
                <Typography
                  component="p"
                  variant="body1"
                  className={classes.title}
                >
                  Sistema de Env&iacute;o de Certificados Vacacionales
                </Typography>
              </Grid>
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Link href="#" className={classes.link}>
                      Contact
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" className={classes.link}>
                      Support
                    </Link>
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
          </Fade>
          <div className={classes.path}></div>
          <div className={classes.pathSecondary}></div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default LoginPage;
