import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTracker } from "meteor/react-meteor-data";

import { Grid, IconButton, Paper } from '@material-ui/core';

import LoopIcon from '@material-ui/icons/Loop';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CodeEditor from '@yozora/react-code-editor'
import '@yozora/react-code-editor/lib/esm/index.css'

import { useParams } from "react-router-dom";

import { FilesCollection } from "../collections/collections"

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        // maxWidth: 275,
        borderRadius: 20,
        padding: "2em",
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function CodeDetails(option) {
    const [code, setCode] = useState('')

    const classes = useStyles();

    const file = useTracker(() => {
        Meteor.subscribe("files", useParams().id)
      return  FilesCollection.findOne(useParams().id)
      });

    const getFile = () => {

        $.post("/getfile", file)
            .done(function (data) {
                console.log("DATA: " + data);
                console.log("File " + file.nombre + " obtenido correctamente");
                setCode(data)

            })
            .fail(function (data) {
                console.log("Ocurrio un error: " + data)
            })

    }

    const setFile = () => {

        let datos = {
            url: file.url,
            data: code
        }
        $.post("/setfile", datos)
            .done(function (data) {
                alert(data);
                console.log("File " + file.nombre + " Guardados correctamente");

            })
            .fail(function (data) {
                alert("Ocurrio un error: " + data)
                console.log("Ocurrio un error: " + data)
            })

    }


    return (
        <Paper elevation={5} style={{ padding: 5 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <IconButton
                        color="primary"
                        aria-label="update"
                        className={classes.margin}
                        onClick={() => { getFile() }}
                    >
                        <LoopIcon fontSize="large" color="secondary" />
                    </IconButton>
                    <IconButton
                        color="primary"
                        aria-label="update"
                        className={classes.margin}
                        onClick={() => { setFile() }}

                    >
                        <SaveOutlinedIcon fontSize="large" color="secondary" />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <CodeEditor
                        lang="typescript"
                        code={code}
                        darken={true}
                        onChange={codes => setCode(codes)}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}