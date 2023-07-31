import { signal } from "@preact/signals";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Loadding from "../../helpers/Loadding";
import PocketBase from "pocketbase";

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

const intereses = ["Hombres", "Mujeres", "Ambos"];

const validationSchema = Yup.object().shape({
  nombres_apellidos: Yup.string()
    .required("Los nombres y apellidos son obligatorios")
    .min(6, "Debe tener mínimo 6 caracteres")
    .max(20, "Los caracteres no puede exceder de 99"),
  edad: Yup.number()
    .required("La edad es obligatoria")
    .min(15, "La edad debe ser mayor a 15")
    .max(99, "La edad debe ser menor a 99")
    .positive("La edad debe ser positiva")
    .integer("La edad debe ser entera"),
  provincia: Yup.string()
    .required("La provincia es obligatoria")
    .min(6, "Debe tener mínimo 6 caracteres")
    .max(20, "Los caracteres no puede exceder de 99"),
  sexo: Yup.string()
    .required("El sexo es obligatorio")
    .min(6, "Debe tener mínimo 6 dígitos")
    .matches(/^(Masculino|Femenino)$/, "El sexo debe ser Masculino o Femenino"),
  intereses: Yup.string()
    .required("Los Intereses son obligatorios")
    .min(5, "Debe tener mínimo 5 dígitos")
    .matches(
      /^(Hombres|Mujeres|Ambos)$/,
      "Los Intereses deben ser Hombres, Mujeres o Ambos"
    ),
});

function Edit({ modalStatus, data, setDataChange }) {
  //console.log("RENDER Edit");
  //console.log(data);
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  const closeModal = () => {
    modalStatus.value = false;
  };

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
                user: data.user_id,
                nombres_apellidos: data.nombres_apellidos,
                edad: data.edad,
                provincia: data.provincia,
                sexo: data.sexo,
                intereses: data.intereses,
              }}
              validationSchema={validationSchema}
              onSubmit={async (
                { user, nombres_apellidos, edad, provincia, sexo, intereses },
                { resetForm }
              ) => {
                isLoadding.value = true;
                //console.log(id, nombres_apellidos, edad, provincia, sexo, intereses);
                // Aquí irá la lógica para enviar los datos del formulario al servidor
                try {
                  const datos = {
                    "user": user,
                    "nombres_apellidos": nombres_apellidos,
                    "edad": edad,
                    "provincia": provincia,
                    "sexo": sexo,
                    "intereses": intereses,
                  };
                  const response = await pb.collection("profile").update(data.id, datos);
                  setDataChange(response);
                  resetForm();
                  isLoadding.value = false;
                  closeModal();
                } catch (error) {
                  //console.log(JSON.parse(error));
                  toast.error(error.message);
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
                  <div>
                    <Select
                      required
                      fullWidth
                      id="intereses"
                      labelId="select-intereses"
                      label="Interés"
                      name="intereses"
                      autoComplete="intereses"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.intereses}
                    >
                      {intereses.map((interes) => (
                        <MenuItem key={interes} value={interes}>
                          {interes}
                        </MenuItem>
                      ))}
                    </Select>
                    <ErrorMessage
                      name="intereses"
                      component={() => (
                        <Alert severity="warning">{errors.intereses}</Alert>
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
