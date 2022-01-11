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

import { ChatFeed } from 'react-bell-chat'

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

    function sortFunction(a,b){  
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA < dateB ? 1 : -1;  
    };
    
    const mensajesList = useTracker(() => {
        Meteor.subscribe("mensajes");

        let list = []
        // let mensajes = MensajesCollection.find({ $or: [{ from: Meteor.userId() }, { from: from }, { to: Meteor.userId() }, { to: from }] }, { sort: { createdAt: -1 } }).fetch()
        let mensajes = MensajesCollection.find({ $or: [{ $and: [{ from: id, to: Meteor.userId() }] }, { $and: [{ from: Meteor.userId(), to: id }] }] }, { sort: { createdAt: -1 } }).fetch()

  // console.log(JSON.stringify(mensajes));
        mensajes.map((element,index) => {
            Meteor.subscribe("user", element.from, { fields: { "profile.firstName": 1, "profile.lastName": 1 } })
            element.to == Meteor.userId() && !element.leido && MensajesCollection.update(element._id, { $set: { leido: true } })
            // let firstName = user(element.from) && user(element.from).profile && user(element.from).profile.firstName
            // let lastName = user(element.from) && user(element.from).profile && user(element.from).profile.lastName
            list.push(
                {
                    id: index,
                    authorId: element._id == Meteor.userId() ? 1 : 2,
                    // position: element.from == Meteor.userId() ? "right" : "left",
                    // type: element.type ? element.type : "text",
                    message: element.mensaje,
                    createdOn: element.createdAt,
                    isSend: true,
                    // user: {
                    //     _id: element.from,
                    //     name: Meteor.users.findOne(element.from) && Meteor.users.findOne(element.from).profile.firstName + " " + Meteor.users.findOne(element.from).profile.lastName,
                    //     avatar: element.services && element.services.facebook && element.services.facebook && element.services.facebook.picture.data.url
                    // }
                    // ,
                    // sent: true,
                    // received: element.leido
                    // theme: 'black',
                    // data: {
                    //     videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    //     audioURL: 'https://www.w3schools.com/html/horse.mp3',
                    //     uri: `/favicon.ico`,
                    //     status: {
                    //         click: true,
                    //         loading: 0.5,
                    //         download: element.type === 'video',
                    //     },
                    //     size: "100MB",
                    //     width: 300,
                    //     height: 300,
                    //     latitude: '37.773972',
                    //     longitude: '-122.431297',
                    //     staticURL: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-circle+FF0000(LONGITUDE,LATITUDE)/LONGITUDE,LATITUDE,ZOOM/270x200@2x?access_token=KEY',
                    // }
                }
            )
        })
        list.sort(sortFunction);
        return list;
    });

    return <>
        <Grid
            container
            justify="flex-start"
            alignItems="center"
            style={{ paddingBottom: '6em' }}
        >
            {id &&
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
                }
            
                <Grid item xs={12}
                // style={acti ? styles.inactive : styles.active}
                >
                    <ChatFeed
      messages={mensajesList} // Array: list of message objects
      authors={[
        {
          id: 1,
          name: Meteor.user()&&(Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName),
        //   isTyping: true,
          lastSeenMessageId: 1,
          bgImageUrl: undefined
        },
        {
          id: 2,
          name: `${user && user.profile.firstName} ${user && user.profile.lastName}`,
          isTyping: false,
          lastSeenMessageId: 2,
          bgImageUrl: undefined
        }
      ]} // Array: list of authors
      yourAuthorId={2} // Number: Your author id (corresponds with id from list of authors)
    />
                    
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