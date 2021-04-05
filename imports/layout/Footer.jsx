import React from 'react';
import { makeStyles,createStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { useHistory } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

//ICONS
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import GroupIcon from '@material-ui/icons/Group';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const useStyles = makeStyles((theme) =>
createStyles({
    root: {
        width: "100%",
      position: "fixed",
      bottom: 0,
      color:"white",
      boxShadow: "0 0 20px 0px rgb(0 0 0 / 46%);",
      backgroundColor: '#3f51b561',
      zIndex: "1",
      backdropFilter: "blur(30px)",
      [theme.breakpoints.up('sm')]: {
        display:"none",
      },
       "&$selected": {
            color: theme.palette.secondary.main,
          },
      },
      selected: {
        color: "white",
         "&$selected": {
            color: "white",
          },
          
          
      }
}));

export default function Footer() {
   
  
    const history = useHistory();
    const classes = useStyles();
    const [value, setValue] = React.useState('pelis');
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { id } = useParams();

    const listaDeLinks = [
      // { title: "dashboard", icon: <DashboardIcon />, url: "dashboard" },
      // {title: "guest",
      //   icon: <InboxIcon />,
      // },
      
      { title: "USUARIOS", icon: <GroupIcon />, url: "users" },
      // {title: "calendar",
      //   icon: <InboxIcon />,
      // },
      // {title: "login",
      //   icon: <InboxIcon />,
      // },
      // {title: "create-user",
      //   icon: <InboxIcon />,
      // },
      { title: "Television", icon: <LiveTvIcon />, url: "tv" },
      { title: "Peliculas", icon: <MovieFilterIcon />, url: "pelis" },
      // {title: "create-pelis",
      //   icon: <InboxIcon />,
      // },
      { title: "Youtube", icon: <CloudDownloadIcon />, url: "downloads" },
    ];

    const handleChange = (event, newValue) => {
      setValue(newValue);
      history.push("/" + newValue);
    };
    return (
      <BottomNavigation
      value={value}
      onChange={handleChange}
      className={classes.root}
    >
      {listaDeLinks.map((data, index) =>
      Meteor.user().profile && Meteor.user().profile.role == "admin" ? (
        <BottomNavigationAction
          key={index}
          label={data.title}
          value={data.url}
          showLabel={data.url == id || (data.url==="pelis"&& id=="")}
          icon={data.icon}
          className={classes.selected}
        />
      ) : data.url == "users" ? (
        ""
      ) : (
        <BottomNavigationAction
          key={index}
          label={data.title}
          value={data.url}
          showLabel={data.url == id || (data.url==="pelis"&& id=="")}
          icon={data.icon}
          className={classes.selected}
        />
      )
    )}
    </BottomNavigation>
    )
  }