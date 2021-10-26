import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
// RCE CSS
import 'react-chat-elements/dist/main.css';

import { ChatList  } from 'react-chat-elements'
import { Meteor } from "meteor/meteor";

import {
    Paper,
    Box,
    Grid,
    Icon,
    Divider,
    Zoom,
    IconButton,
    Switch,
    FormControl,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    InputLabel,
    FormControlLabel,
    FormHelperText ,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
  } from "@material-ui/core";
  
import { MensajesCollection } from "../collections/collections";

export default Chat = () => {
    const[acti,setActi] = useState(false)
    const users = useTracker(() => {
        Meteor.subscribe("user");
        return Meteor.users.find({});
      });

      const a = () => {
          let mensajes = MensajesCollection.find({ $or: [{ from: Meteor.userId() }, { to: Meteor.userId() }] }, { sort: { createdAt: -1 } }).fetch()

        mensajes = mensajes.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.from === thing.from
            ))
        )

        return mensajes
    }
    const user=(id)=> Meteor.users.find(id)

      const mensajesList = useTracker(() => {
        Meteor.subscribe("mensajes");
          let listaIdUsersMensajes = []

          let list = []
          let mensajes = a()
          
       mensajes.map(element => {
           list.push({
           avatar: user(element.from) && user(element.from).services && user(element.from).services.facebook && user(element.from).services.facebook.picture.data.url,
            alt: 'Reactjs',
            title: <p style={{color:'black', margin: 0}}>{element.from}</p>,
            subtitle: element.mensaje,
            date: element.createdAt,
            unread: 3,
           })
       })
        return list ;
      });

    const styles={
        active:{
            display:"none"
        },
        inactive:{
            display:"block"
        }
    }

    return <>
        <Grid
            container
            justifyContent="center"
            alignItems="center"
        >
            <Grid item xs={12}  style={acti?styles.active:styles.inactive}>
                <ChatList
                    className='chat-list'
                    dataSource={mensajesList}
                    onClick={(element => setActi(!acti))}
                />
            </Grid>
            <Grid item xs={12}  style={acti?styles.inactive:styles.active}>
                <ChatList
                    className='chat-list'
                    dataSource={mensajesList}
                    onClick={(element => alert(element.subtitle))}
                />
            </Grid>
                
        </Grid>
    </>
}