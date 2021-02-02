import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/layout/index';
import LoginPage from '../imports/ui/pages/login/index';
import { useTracker } from "meteor/react-meteor-data";



Meteor.startup(() => {
  
    render(<App />, document.getElementById('react-target'));
  
});
