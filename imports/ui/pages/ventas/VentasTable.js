import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import {
  Paper,
  Box,
  Grid,
  Icon,
  Divider,
  Zoom,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./VentasTable.css";
import { Dropdown } from "primereact/dropdown";
//icons
import EditIcon from '@material-ui/icons/Edit';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

//Collections
import {
  VentasCollection,
} from "../collections/collections";
import { useHistory } from "react-router-dom";
import dateFormat from "dateformat";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);
const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down("sm")]: {},
  [theme.breakpoints.down("md")]: {},
  [theme.breakpoints.up("md")]: {
    columnSmoll: {
    }
  },
  clasificado: {
    background: theme.palette.secondary.main,
    padding: 10,
    borderRadius: 25,
  },
  noclasificado: {
    background: theme.palette.primary.main,
    padding: 10,
    borderRadius: 25,
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
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function VentasTable(option) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedOnline, setSelectedOnline] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [selectedLimites, setSelectedLimites] = React.useState(null);
  const [selectedConProxy, setSelectedConProxy] = React.useState(null);
  const dt = React.useRef(null);
  const history = useHistory();
  const [precio, setPrecio] = React.useState(0);
  const [comentario, setComentario] = React.useState("");
  const [ganancias, setGanancias] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [idVentaAModificar, setIdVentaAModificar] = React.useState(null);
  
  const actualizarPrecio = (id) => {
    console.log('Actualizar precio:', id, precio);
    Meteor.call('actualizarPrecio', id, {precio,comentario, ganancias}, (error) => {
      if (error) {
        console.error('Error al actualizar el precio:', error);
      } else {
        console.log('Precio actualizado correctamente');
      }
    });
  };

  // var userOnline = useTracker(() => {

  //   return OnlineCollection.find({"userId" : Meteor.userId()}).fetch();
  // });

  const isAdminOficial = useTracker(() => {
    return Meteor.settings.public.administradores.includes(Meteor.user().username) 
  })
  const user = (id) =>{
    Meteor.subscribe("user",id,{fields:{
      username: 1
    }});
    return Meteor.users.findOne(id)
  }
  const ventas = useTracker(() => {
    
    let a = [];

    Meteor.subscribe("ventas", isAdminOficial ? {} : { adminId: Meteor.userId() }).ready() &&   

    VentasCollection.find(isAdminOficial ? {} : { adminId: Meteor.userId() }, {
      sort: { createdAt: -1 }
    }).map(
      (data) =>
        data &&
        a.push({
          id: data._id,
          adminId: user(data.adminId)?user(data.adminId).username:"N/A",
          userId: user(data.userId)?user(data.userId).username:"N/A",
          createdAt: data.createdAt&&data.createdAt.toString(),
          precio: data.precio&&data.precio,
          comentario: data.comentario&&data.comentario,
          cobrado: data.cobrado&&data.cobrado,
          ganancias: data.gananciasAdmin?data.gananciasAdmin:0,
          cobradoAlAdmin:data.cobradoAlAdmin&&data.cobradoAlAdmin
        })
    );

    return a;
  });

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );
  const iDBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">ID</span>
        {rowData.id}
      </React.Fragment>
    );
  };
  const adminIdBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Admin:</span>
        {rowData.adminId}
      </React.Fragment>
    );
  };
  const userIdBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Usuario:</span>
        {rowData.userId}
      </React.Fragment>
    );
  };
  const createdAtBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Creado:</span>
        {rowData.createdAt}
      </React.Fragment>
    );
  };
  const gananciasBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Ganancias:</span>
        {rowData.ganancias}
      </React.Fragment>
    );
  };
  const precioBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Precio</span>
        <Chip color="primary" label={rowData.precio} />
      </React.Fragment>
    );
  };
  const comentarioBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Comentarios</span>
        {rowData.comentario}
      </React.Fragment>
    );
  };
  

  const eliminarVenta = (id) => {
    VentasCollection.remove(id);
  };
  const eliminarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip
          title={`Eliminar Compra`}
        >
          <IconButton
            // disabled
            aria-label="delete"
            color="primary"
            onClick={() => {
              eliminarVenta(rowData.id);
            }}
          >
            <DeleteIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  };
  const editarBodyTemplate = (rowData) => {
  
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip
          title={`Editar Compra`}
        >
          <IconButton
            // disabled
            aria-label="edit"
            color="primary"
            onClick={() => {
              setIdVentaAModificar(rowData.id)
              setPrecio(rowData.precio)
              setOpenDialog(true)
              setComentario(rowData.comentario)
              setGanancias(rowData.ganancias)
              // Add your edit logic here
            }}
          >
            <EditIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        
      </React.Fragment>
    );
  };
  const cobradoBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Cobrado: </span>
        <Tooltip
          title={
            rowData.cobrado ? "Cobrado" : "Sin Cobrar"
          }
        >
          <IconButton
            // disabled
            aria-label="delete"
            color={rowData.cobrado ? "primary" : "secondary"}
            onClick={() => {
              try {
              VentasCollection.update(rowData.id, { $set: { cobrado: rowData.cobrado ? false : true } })
              } catch (error) {
                console.log(error)
              }
              
            }}
          >
            {rowData.cobrado
              ? <RadioButtonCheckedIcon fontSize="large"/>
              : <RadioButtonUncheckedIcon fontSize="large"/>}
          </IconButton>
          {/* <Button
            color={rowData.cobrado ? "primary" : "secondary"}
            // variant="contained"
            onClick={VentasCollection.update(rowData._id,{$set:{cobrado: !rowData.cobrado}})}
            label={rowData.cobrado?"Cobrado":"Sin Cobrar"}
          >
            {rowData.cobrado
              ? <RadioButtonCheckedIcon fontSize="large"/>
              : <RadioButtonUncheckedIcon fontSize="large"/>}
          </Button> */}
        </Tooltip>
      </React.Fragment>
    );
  };

  
  const cobradoAlAdminBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Cobrado Al Admin: </span>
        <Tooltip
          title={
            rowData.cobradoAlAdmin ? "Cobrado" : "Sin Cobrar"
          }
        >
          <IconButton
            // disabled
            aria-label="delete"
            color={rowData.cobradoAlAdmin ? "primary" : "secondary"}
            onClick={() => {
              try {
                // rowData.cobradoAlAdmin ?
                //   Meteor.call("desabilitarProxyUserinVentas", rowData.userId, rowData.adminId) :
                //   Meteor.call("habilitarProxyUserinVentas", rowData.userId, rowData.adminId)
              VentasCollection.update(rowData.id, { $set: { cobradoAlAdmin: rowData.cobradoAlAdmin ? false : true } })
              } catch (error) {
                console.log(error)
              }
              
            }}
          >
            {rowData.cobradoAlAdmin
              ? <RadioButtonCheckedIcon fontSize="large"/>
              : <RadioButtonUncheckedIcon fontSize="large"/>}
          </IconButton>
          {/* <Button
            color={rowData.cobrado ? "primary" : "secondary"}
            // variant="contained"
            onClick={VentasCollection.update(rowData._id,{$set:{cobrado: !rowData.cobrado}})}
            label={rowData.cobrado?"Cobrado":"Sin Cobrar"}
          >
            {rowData.cobrado
              ? <RadioButtonCheckedIcon fontSize="large"/>
              : <RadioButtonUncheckedIcon fontSize="large"/>}
          </Button> */}
        </Tooltip>
      </React.Fragment>
    );
  };

  return (
    <>
      <div className={classes.drawerHeader}></div>

      <Zoom in={true}>
        <div style={{ width: "100%", padding: 10 }}>
          <div className="datatable-responsive-demo">
            <div className="card">
              <DataTable
                ref={dt}
                className="p-shadow-5 p-datatable-responsive-demo"
                value={ventas}
                paginator
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={5}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
                // reorderableColumns={true}
                // resizableColumns={true}
              >
                {/* <Column
                  field="id"
                  body={iDBodyTemplate}
                  wrap="nowrap"
                  header="ID"
                  filter
                  filterPlaceholder="ID"
                  filterMatchMode="contains"
                /> */}
                <Column
                  field="adminId"
                  header="Admin"
                  body={adminIdBodyTemplate}
                  filter
                  filterPlaceholder="Admin"
                  filterMatchMode="contains"
                />
                <Column
                  field="userId"
                  header="Usuario"
                  body={userIdBodyTemplate}
                  filter
                  filterPlaceholder="Usuario"
                  filterMatchMode="contains"
                />
                <Column
                  field="createdAt"
                  header="Fecha de Creado"
                  body={createdAtBodyTemplate}
                  filter
                  filterPlaceholder="Fecha"
                  filterMatchMode="contains"
                />
                <Column
                  field="precio"
                  header="Precio"
                  body={precioBodyTemplate}
                  filter
                  filterPlaceholder="Precio"
                  filterMatchMode="contains"
                />
                <Column
                  field="ganancias"
                  header="Ganancias"
                  body={gananciasBodyTemplate}
                  filter
                  filterPlaceholder="Precio"
                  filterMatchMode="contains"
                />
                <Column
                  field="comentario"
                  header="Comentario"
                  body={comentarioBodyTemplate}
                  filter
                  filterPlaceholder="Comentario:"
                  filterMatchMode="contains"
                />
                {isAdminOficial &&
                <Column
                  field="cobrado"
                  header="Cobrado"
                  body={cobradoBodyTemplate}
                />}
                <Column
                  field="cobradoAlAdmin"
                  header="Cobrado Al Admin"
                  body={cobradoAlAdminBodyTemplate}
                />
                
                {isAdminOficial &&
                  <Column
                    field="eliminar"
                    // header="Eliminar"
                    body={eliminarBodyTemplate}
                  />
                  
                  }
                  {isAdminOficial &&
                  <Column
                    field="editar"
                    header="Editar"
                    body={editarBodyTemplate}
                  />
                  }
              </DataTable>
            </div>
          </div>
        </div>
      </Zoom>
      <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Editar Compra</DialogTitle>
      <DialogContent>
      <TextField
      variant="outlined"
        autoFocus
        margin="normal"
        id="nuevoPrecio"
        label="Nuevo Precio"
        type="number"
        fullWidth
        value={precio}
        onChange={(e) => {setPrecio(e.target.value)}}
        color="secondary"
      />
      <TextField
      variant="outlined"
        autoFocus
        margin="normal"
        id="nuevoComentario"
        label="Nuevo Comentario"
        type="text"
        fullWidth
        value={comentario}
        onChange={(e) => {setComentario(e.target.value)}}
        color="secondary"
      />
      <TextField
      variant="outlined"
        autoFocus
        margin="normal"
        id="nuevoGanancias"
        label="Nueva Ganancias"
        type="number"
        fullWidth
        value={ganancias}
        onChange={(e) => {setGanancias(e.target.value)}}
        color="secondary"
      />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={() => {
          actualizarPrecio(idVentaAModificar)
          setOpenDialog(false)
          }} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
