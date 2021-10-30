import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// RCE CSS
import 'react-chat-elements/dist/main.css';

import { Meteor } from "meteor/meteor";
import { MessageList } from 'react-chat-elements'

import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { Button } from 'react-chat-elements'

import {
    Grid,
    IconButton,
} from "@material-ui/core";

import { MensajesCollection } from "../collections/collections";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Input from "./Input";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: 12
    }
}));

export default ChatDetails = () => {
    const classes = useStyles();
    const history = useHistory();
    const [inputMessage, setInputMessage] = React.useState("")

    let {id} = useParams()
    const user = useTracker(() => {
        Meteor.subscribe("user",id);
        return Meteor.users.findOne(id);
    });


    
    const mensajesList = useTracker(() => {
            Meteor.subscribe("mensajes");

            let list = []
            // let mensajes = MensajesCollection.find({ $or: [{ from: Meteor.userId() }, { from: from }, { to: Meteor.userId() }, { to: from }] }, { sort: { createdAt: -1 } }).fetch()
        let mensajes = MensajesCollection.find({ $or: [{ $and: [{ from: id, to: Meteor.userId() }] }, { $and: [{ from: Meteor.userId(), to: id }] }] }, { sort: { createdAt: -1 } }).fetch()

            mensajes.forEach(element => {
                // let firstName = user(element.from) && user(element.from).profile && user(element.from).profile.firstName
                // let lastName = user(element.from) && user(element.from).profile && user(element.from).profile.lastName
                list.push(
                    {
                        position: element.from == Meteor.userId() ? "right" : "left",
                        type: 'text',
                        text: <p style={{ color: 'black', margin: 0 }}>{element.mensaje}</p>,
                        date: new Date(element.createdAt),
                    }
                )
            })

            return list;
        });

    return <>
        <Grid
            container
            justify="flex-start"
            alignItems="center"
        >
            {id ?
                <Grid item >
                    <Grid container
                        justify="space-between"
                        alignItems="center">
                        <IconButton
                            color="primary"
                            aria-label="delete"
                            className={classes.margin}
                            onClick={() => {history.push('/chat')}}
                        >
                            <ArrowBackIcon fontSize="large" color="secondary" />
                        </IconButton>
                        <h2>{`${user && user.profile.firstName} ${user && user.profile.lastName}`}</h2>
                    </Grid>
                </Grid>
                :
                <h2>Mensajes</h2>
                }
            
                <Grid item xs={12}
                // style={acti ? styles.inactive : styles.active}
                >
                    <MessageList
                    style
                        className='message-list'
                        lockable={true}
                        toBottomHeight={'100%'}
                        dataSource={mensajesList} />
                    
                </Grid>
                

        </Grid>
        {/* <Grid item xs={12} style={{ bottom: 0, position: 'absolute',width:'100%', height:"100%" }}>
                <Input
                    // onChange={mensaj => { 
                    //     setInputMessage(mensaj)
                    //     alert(JSON.stringify(mensaj) + "")
                    //  }}
                    // ref={mensaj => (setInputMessage(mensaj))}
                    // placeholder="Type here..."
                    multiline={true}
                    rightButtons={
                        <Button
                            // type="transparent"
                            // disabled={inputMessage=="" ? true : false}
                            color='white'
                            backgroundColor='black'
                            text='Send'
                            onClick={() => {
                                inputMessage != "" ? alert(MensajesCollection.insert({
                                    "from": Meteor.userId(),
                                    "to": id,
                                    "mensaje": JSON.stringify( inputMessage) + "",
                                })) :
                                    alert("Escriba primeramente algun mensaje antes de enviar!!!")
                            }}
                        />
                    }
                    placeholder="Escriba el mensaje aqui!!!"
                />
            </Grid> */}
            <Input />
    </>
}