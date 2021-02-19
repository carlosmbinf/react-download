import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Rotate from 'react-reveal/Rotate';


import { useTracker } from "meteor/react-meteor-data";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import PersistentDrawerLeft from './App'

import Loading from '../ui/components/loading/loading'

import LoginPage from '../ui/pages/login/index'
import {Login} from '../ui/pages/login/Login'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

export default function App() {
  const classes = useStyles();

  const userActual = useTracker(() => {
    return Meteor.user();
  });


  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        
        {!userActual && 
        <Switch>
        <Route path="/loading">
        <Loading />
        </Route>
        <Route path="/">
          <LoginPage />
        </Route>
        </Switch>
        }
        {userActual && (
          
            <PersistentDrawerLeft />
         
        )}
      </div>
    </Router>
  );
}

