import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signal } from "@preact/signals";
import Loadding from "../../helpers/Loadding";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useAlertStore } from "../../store/Store";
import { useMutation } from "@apollo/client";
import { MutationNewProfile } from "../../querys/mutations/ProfileMutations";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";

const isLoadding = signal(false);

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

export default function CreateProfile({ user_id }) {
  const [NewProfile] = useMutation(MutationNewProfile);
  const {
    ChangeMsgOpen,
    ChangeSeverity,
    ChangeMsg,
    ChangeDuration,
    ChangePositionV,
    ChangePositionH,
  } = useAlertStore();
  let navigate = useNavigate();
  if (isLoadding.value) {
    return <Loadding />;
  }
  if (!isLoadding.value) {
    return (
      <>
        <Typography component="h1" variant="h3">
          Crear Perfil
        </Typography>
        <Formik
          initialValues={{
            nombres_apellidos: "",
            edad: "",
            provincia: "",
            sexo: "",
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
              await NewProfile({
                variables: {
                  user_id,
                  nombres_apellidos,
                  edad,
                  provincia,
                  sexo,
                },
              });
              resetForm();
              isLoadding.value = false;
              navigate("/profile", { replace: true });
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
                    <Alert severity="warning">{errors.nombres_apellidos}</Alert>
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
                  <MenuItem value={"Pinar del Río"}>Pinar del Río</MenuItem>{" "}
                  <MenuItem value={"Artemisa"}>Artemisa</MenuItem>{" "}
                  <MenuItem value={"La Habana"}>La Habana</MenuItem>{" "}
                  <MenuItem value={"Mayabeque"}>Mayabeque</MenuItem>{" "}
                  <MenuItem value={"Matanzas"}>Matanzas</MenuItem>{" "}
                  <MenuItem value={"Cienfuegos"}>Cienfuegos</MenuItem>{" "}
                  <MenuItem value={"Villa Clara"}>Villa Clara</MenuItem>{" "}
                  <MenuItem value={"Sancti Spíritus"}>Sancti Spíritus</MenuItem>{" "}
                  <MenuItem value={"Ciego de Ávila"}>Ciego de Ávila</MenuItem>{" "}
                  <MenuItem value={"Camagüey"}>Camagüey</MenuItem>{" "}
                  <MenuItem value={"Las Tunas"}>Las Tunas</MenuItem>{" "}
                  <MenuItem value={"Granma"}>Granma</MenuItem>{" "}
                  <MenuItem value={"Holguín"}>Holguín</MenuItem>{" "}
                  <MenuItem value={"Santiago de Cuba"}>
                    Santiago de Cuba
                  </MenuItem>{" "}
                  <MenuItem value={"Guantánamo"}>Guantánamo</MenuItem>{" "}
                  <MenuItem value={"Isla de la Juventud"}>
                    Isla de la Juventud (Municipio Especial)
                  </MenuItem>
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
                  <MenuItem value={"Masculino"}>Masculino</MenuItem>
                  <MenuItem value={"Femenino"}>Femenino</MenuItem>
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
                Crear Perfil
              </Button>
            </Form>
          )}
        </Formik>
      </>
    );
  }
}
