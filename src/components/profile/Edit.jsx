import { signal } from "@preact/signals";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useMutation } from "@apollo/client";
import { MutationUpdateProfile } from "../../querys/mutations/ProfileMutations";
import Loadding from "../../helpers/Loadding";
import { useAlertStore } from "../../store/Store";

const isLoadding = signal(false);

const Box1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fixed",
  height: "fixed",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const provincias = [
  "Pinar del Río",
  "Artemisa",
  "La Habana",
  "Mayabeque",
  "Matanzas",
  "Cienfuegos",
  "Villa Clara",
  "Sancti Spíritus",
  "Ciego de Ávila",
  "Camagüey",
  "Las Tunas",
  "Granma",
  "Holguín",
  "Santiago de Cuba",
  "Guantánamo",
  "Isla de la Juventud",
];

const sexos = ["Masculino", "Femenino"];

const validationSchema = Yup.object().shape({
  nombres_apellidos: Yup.string()
    .required("Los nombres y apellidos son obligatorios")
    .min(8, "Debe tener mínimo 8 caracteres"),
  edad: Yup.number()
    .required("La edad es obligatoria")
    .min(15, "La edad debe ser mayor a 15")
    .max(99, "La edad debe ser menor a 99")
    .positive("La edad debe ser positiva")
    .integer("La edad debe ser entera"),
  provincia: Yup.string()
    .required("La provincia es obligatoria")
    .min(6, "Debe tener mínimo 6 dígitos"),
  sexo: Yup.string()
    .required("El sexo es obligatorio")
    .min(6, "Debe tener mínimo 6 dígitos")
    .matches(/^(Masculino|Femenino)$/, "El sexo debe ser Masculino o Femenino"),
});

function Edit({ modalStatus, data, refetch }) {
  const { id } = data;
  //console.log(data);
  const closeModal = () => {
    modalStatus.value = false;
  };
  const [UpdateProfile] = useMutation(MutationUpdateProfile);
  const {
    ChangeMsgOpen,
    ChangeSeverity,
    ChangeMsg,
    ChangeDuration,
    ChangePositionV,
    ChangePositionH,
  } = useAlertStore();
  if (isLoadding.value) {
    return <Loadding />;
  }
  if (!isLoadding.value) {
    return (
      <>
        <Modal
          open={modalStatus.value}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={Box1}>
            <IconButton
              sx={{ mt: -5, ml: "95%" }}
              aria-label="close"
              color="error"
              size="small"
              onClick={closeModal}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
            <Typography component="h1" variant="h4" style={{ color: "green" }}>
              Editar Perfil
            </Typography>
            <Formik
              initialValues={{
                nombres_apellidos: data.attributes.nombres_apellidos,
                edad: data.attributes.edad,
                provincia: data.attributes.provincia,
                sexo: data.attributes.sexo,
              }}
              validationSchema={validationSchema}
              onSubmit={async (
                { nombres_apellidos, edad, provincia, sexo },
                { resetForm }
              ) => {
                isLoadding.value = true;
                //console.log(user_id, nombres_apellidos, edad, provincia, sexo);
                // Aquí irá la lógica para enviar los datos del formulario al servidor
                try {
                  await UpdateProfile({
                    variables: {
                      id,
                      nombres_apellidos,
                      edad,
                      provincia,
                      sexo,
                    },
                  });
                  resetForm();
                  isLoadding.value = false;
                  refetch();
                  closeModal();
                } catch (error) {
                  //console.log(JSON.parse(error));
                  ChangeMsgOpen(true);
                  ChangeSeverity("error");
                  ChangeMsg(
                    error.message === "Failed to fetch"
                      ? "Error al hacer la petición al Servidor!"
                      : error.message
                  );
                  ChangeDuration(2000);
                  ChangePositionV("top");
                  ChangePositionH("center");
                  isLoadding.value = false;
                }
              }}
            >
              {({ values, errors, handleChange, handleBlur }) => (
                <Form>
                  <div>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="nombres_apellidos"
                      label="Nombres y Apellidos"
                      name="nombres_apellidos"
                      autoComplete="nombres_apellidos"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.nombres_apellidos}
                      autoFocus
                    />
                    <ErrorMessage
                      name="nombres_apellidos"
                      component={() => (
                        <Alert severity="warning">
                          {errors.nombres_apellidos}
                        </Alert>
                      )}
                    />
                  </div>
                  <div>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="edad"
                      label="Edad"
                      name="edad"
                      type="number"
                      autoComplete="edad"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.edad}
                    />
                    <ErrorMessage
                      name="edad"
                      component={() => (
                        <Alert severity="warning">{errors.edad}</Alert>
                      )}
                    />
                  </div>
                  <div>
                    <Select
                      required
                      fullWidth
                      id="provincia"
                      labelId="select-provincia"
                      label="Provincia"
                      name="provincia"
                      autoComplete="provincia"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.provincia}
                    >
                      {provincias.map((provincia) => (
                        <MenuItem key={provincia} value={provincia}>
                          {provincia}
                        </MenuItem>
                      ))}
                    </Select>
                    <ErrorMessage
                      name="provincia"
                      component={() => (
                        <Alert severity="warning">{errors.provincia}</Alert>
                      )}
                    />
                  </div>
                  <div>
                    <Select
                      required
                      fullWidth
                      id="sexo"
                      labelId="select-sexo"
                      label="Sexo"
                      name="sexo"
                      autoComplete="sexo"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.sexo}
                    >
                      {sexos.map((sexo) => (
                        <MenuItem key={sexo} value={sexo}>
                          {sexo}
                        </MenuItem>
                      ))}
                    </Select>
                    <ErrorMessage
                      name="sexo"
                      component={() => (
                        <Alert severity="warning">{errors.sexo}</Alert>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    color="success"
                    variant="contained"
                    sx={{ mt: 1, mb: 1 }}
                  >
                    Editar Perfil
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>
      </>
    );
  }
}

export default Edit;
