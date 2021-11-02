import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// RCE CSS
import 'react-chat-elements/dist/main.css';

import { ChatList } from 'react-chat-elements'

import { Meteor } from "meteor/meteor";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import {
    Grid,
} from "@material-ui/core";

import { MensajesCollection } from "../collections/collections";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: 12
    }
}));

export default Chat = () => {
    const classes = useStyles();
    const history = useHistory();

    const [acti, setActi] = useState(false)
    const [from, setFrom] = useState()
    const [input, setInput] = useState("")
    
    const user = (id) => { Meteor.subscribe("user",id); return Meteor.users.findOne(id) }

    const listFromMensajes = useTracker(() => {
        Meteor.subscribe("mensajes");
        let usersubs = Meteor.subscribe("user").ready();
        let listaIdUsersMensajes = []

        let list = []
        let mensajes = MensajesCollection.find({ $or: [
            // { from: Meteor.userId() },
            { to: Meteor.userId() }
        ] }, { sort: { createdAt: -1 } }).fetch()

        mensajes = mensajes.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.from === thing.from 
                // && 
                // t.to === thing.to
            ))
        )

        mensajes = mensajes.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                // t.from === thing.from 
                // // && 
                t.to === thing.to
            ))
        )

        mensajes.map(element => {
            let iam = element.from == Meteor.userId()
            let firstName = user(iam?element.to:element.from) && user(iam?element.to:element.from).profile && user(iam?element.to:element.from).profile.firstName
            let lastName = user(iam?element.to:element.from) && user(iam?element.to:element.from).profile && user(iam?element.to:element.from).profile.lastName
            list.push({
                from: iam?element.to:element.from,
                avatar: user(iam?element.to:element.from) && user(iam?element.to:element.from).services && user(iam?element.to:element.from).services.facebook && user(iam?element.to:element.from).services.facebook.picture.data.url,
                alt: "N/A",
                title: <p style={{ color: 'black', margin: 0 }}>{firstName + " " + lastName}</p>,
                subtitle: element.mensaje,
                date: element.createdAt,
                unread: MensajesCollection.find({ from: iam ? element.to : element.from, to: Meteor.userId(), leido: false }).count(),
                // unread: MensajesCollection.find({ $or: [{ $and: [{ from: element.from, to: Meteor.userId() }] }, { $and: [{ from: Meteor.userId(), to: element.from }] }], leido:false }, { sort: { createdAt: -1 } }).count(),
            })
        })
        return list;
    });
    
    return <>
        <Grid
            container
            justify="flex-start"
            alignItems="center"
        >
            <h2>Mensajes</h2>

            <Grid item xs={12}
            // style={acti ? styles.active : styles.inactive}
            >
                <ChatList
                    className='chat-list'
                    dataSource={listFromMensajes}
                    onClick={(elemento) =>
                    (
                        MensajesCollection.find({ from: elemento.from, to: Meteor.userId() }).map(e =>
                            MensajesCollection.update(e._id, { $set: { leido: true } }, { multi: true })
                        ),
                        history.push(`/chat/${elemento.from}`))
                    }
                />
            </Grid>
        </Grid>
    </>
}