import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {Grid, Paper} from '@material-ui/core';

import CodeEditor from '@yozora/react-code-editor'
import '@yozora/react-code-editor/lib/esm/index.css'




const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        // maxWidth: 275,
        borderRadius: 20,
        padding: "2em",
    }
}));

export default function CodeDetails(option) {
    const [code, setCode] = useState('let a: number = 1 + 2;')

    return (
        <Paper elevation={5} style={{ padding: 5 }}>
            <Grid container spacing={3}>
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