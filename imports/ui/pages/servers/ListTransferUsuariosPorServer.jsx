import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { ServersCollection } from '../collections/collections';

function not(a, b) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function ListTransferUsuariosPorServer() {
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(['uno','dos']);
  const [right, setRight] = React.useState([4, 5, 6, 7]);
  const {id} = useParams();

  const listaDeUsuariosEnServidor = useTracker(() => {
    Meteor.subscribe("servers",{},{fields:{_id:1,usuariosAprobados:1}})
    let list = ServersCollection.findOne(id,{fields:{_id:1,usuariosAprobados:1}});
    console.log(list&&list.usuariosAprobados)
    return list ? (list.usuariosAprobados?list.usuariosAprobados:[]) : []
  })

  const listaDeUsusarios = useTracker(() => {
    let ready = Meteor.subscribe("user",{},{fields:{_id:1,username:1}}).ready();
    let list = ready && Meteor.users.find({},{fields:{_id:1,username:1}}).fetch();
    
    //limpiar list para que no contenta ningun dato de listaDeUsuariosEnServidor
    return list ? list.filter(element => listaDeUsuariosEnServidor ? !listaDeUsuariosEnServidor.includes(element.username):true).map(element => element.username) : []
  });

  const leftChecked = intersection(checked, listaDeUsusarios);
  const rightChecked = intersection(checked, listaDeUsuariosEnServidor);


  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    let server = ServersCollection.findOne(id);
    console.log("ususariosAprobados", server.usuariosAprobados);
    console.log("result", (server.usuariosAprobados ? server.usuariosAprobados : []).concat(leftChecked))
    ServersCollection.update(id,{$set:{usuariosAprobados: (server.usuariosAprobados ? server.usuariosAprobados : []).concat(leftChecked)}})
    // setRight(right.concat(leftChecked));
    // setLeft(not(left, leftChecked));
    // setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    let server = ServersCollection.findOne(id);
    const updatedUsuariosAprobados = (server.usuariosAprobados ? server.usuariosAprobados : []).filter(user => !rightChecked.includes(user));
    ServersCollection.update(id, { $set: { usuariosAprobados: updatedUsuariosAprobados } });

    // setLeft(left.concat(rightChecked));
    // setRight(not(right, rightChecked));
    // setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          // width: 300,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton
              style={{width:"100%"}}
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid
      container
      spacing={2}
      paddingTop={5}
      sx={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <Grid item xs={11} md={4}>{customList('Lista de Usuarios', listaDeUsusarios)}</Grid>
      <Grid item xs={11} md={2}>
        <Grid container direction="column" sx={{ alignItems: 'center' }}>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={11} md={4}>{customList('Usuarios Aprobados a conectarse', listaDeUsuariosEnServidor)}</Grid>
    </Grid>
  );
}