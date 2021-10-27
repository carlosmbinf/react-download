import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
// RCE CSS
import 'react-chat-elements/dist/main.css';

import { ChatList } from 'react-chat-elements'
import { Meteor } from "meteor/meteor";
import { MessageList } from 'react-chat-elements'


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
    FormHelperText,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@material-ui/core";

import { MensajesCollection } from "../collections/collections";

export default Chat = () => {
    const [acti, setActi] = useState(false)
    const [from, setFrom] = useState("")
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
    const user = (id) => Meteor.users.findOne(id)

    const mensajesList = useTracker(() => {
        Meteor.subscribe("mensajes");
        let usersubs = Meteor.subscribe("user").ready();
        let listaIdUsersMensajes = []

        let list = []
        let mensajes = a()

        mensajes.map(element => {
            let firstName = user(element.from) && user(element.from).profile && user(element.from).profile.firstName
            let lastName = user(element.from) && user(element.from).profile && user(element.from).profile.lastName
            list.push({
                id: element.from,
                avatar: user(element.from) && user(element.from).services && user(element.from).services.facebook && user(element.from).services.facebook.picture.data.url,
                alt: 'Reactjs',
                title: <p style={{ color: 'black', margin: 0 }}>{firstName + " " + lastName}</p>,
                subtitle: element.mensaje,
                date: element.createdAt,
                unread: MensajesCollection.find({ $or: [{ from: Meteor.userId() }, { to: Meteor.userId() }], $and: [{ leido: false }] }, { sort: { createdAt: -1 } }).count(),
            })
        })
        return list;
    });

    const styles = {
        active: {
            display: "none"
        },
        inactive: {
            display: "block"
        }
    }

    return <>
        <Grid
            container
            justifyContent="center"
            alignItems="center"
        >
            <Grid item xs={12} style={acti ? styles.active : styles.inactive}>
                <ChatList
                    className='chat-list'
                    dataSource={mensajesList}
                    onClick={(element => setfrom(!element.id))}
                />
            </Grid>
            {from && <Grid item xs={12} style={acti ? styles.inactive : styles.active}>
                <MessageList
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={[
                        {
                            position: 'right',
                            type: 'text',
                            text: <p style={{ color: 'black', margin: 0 }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>,
                            date: new Date(),
                        },
                        {
                            position: 'left',
                            type: 'text',
                            text: <p style={{ color: 'black', margin: 0 }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>,
                            date: new Date(),
                        },
                    ]} />
            </Grid>}


        </Grid>
    </>
}