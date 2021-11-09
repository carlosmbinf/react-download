import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Zoom,
} from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import {
    Tooltip,
    PieChart,
    Pie,
} from "recharts";

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 300,
        maxWidth: "100%",
        borderRadius: 20,
        padding: "2em",
    },
    primary: {
        minWidth: 370,
        width: "100%",
        borderRadius: 20,
        padding: "2em",
        background:
            "linear-gradient(0deg, rgba(36,83,162,1) 15%, rgba(245,0,87,0) 100%)",
    },
    secundary: {
        minWidth: 370,
        width: "100%",
        borderRadius: 20,
        padding: "2em",
        background:
            "linear-gradient(0deg, rgba(245,0,87,1) 15%, rgba(245,0,87,0) 100%)",
    },
    boton: {
        borderRadius: 20,
        padding: 0,
    },
    rootADD: {
        minWidth: 275,
        maxWidth: 275,
        borderRadius: 20,
        padding: "2em",
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    createUsers: {
        color: "#114c84",
    },
    link: {
        borderRadius: 20,
        textDecoration: "none",
        color: "#8b8b8b",
        fontSize: 16,
        fontWeight: "bold",
    },
    root2: {
        display: "flex",
        alignItems: "center",
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    padding10: {
        margin: "13px 0",
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-start",
    },
    margin: {
        margin: theme.spacing(2),
    },
}));

export default function GraphicsPieChart() {
    const classes = useStyles();

    const datausers = useTracker(() => {

        let data01 = [
            // { name: "Group A", value: 400 },
            // { name: "Group B", value: 300 },
            // { name: "Group C", value: 300 },
            // { name: "Group D", value: 200 },
            // { name: "Group E", value: 278 },
            // { name: "Group F", value: 189 },
        ];
        Meteor.subscribe("user");
        let users = Meteor.users.find({});
        let adminsCount = 0
        let usersCount = 0
        users.map((usersGeneral) => (

            (usersGeneral.profile.role == "admin") ? adminsCount++ : usersCount++

        ));
        data01.push({ name: "Admin", value: adminsCount })
        data01.push({ name: "Users", value: usersCount })
        return data01;
    });

    return (
        <Zoom in={true}>
            <PieChart width={200} height={200}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={datausers}
                    // cx={100}
                    // cy={100}
                    innerRadius={40}
                    outerRadius={80}
                    fill="#82ca9d"
                    label

                />
                <Tooltip />
            </PieChart>
        </Zoom>
    );
}
