import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "preact/hooks";
import Loadding from "../../helpers/Loadding";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { toast } from "sonner";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import PocketBase from "pocketbase";

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

export default function CreateProfile({ user_id }) {
  //console.log("RENDER CreateProfile");
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  const [isLoadding, setIsLoadding] = useState(false);
  let navigate = useNavigate();
  if (isLoadding) {
    return <Loadding />;
  }
  if (!isLoadding) {
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
            intereses: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (
            { nombres_apellidos, edad, provincia, sexo, intereses },
            { resetForm }
          ) => {
            setIsLoadding(true);
            //console.log(user_id, nombres_apellidos, edad, provincia, sexo);
            // Aquí irá la lógica para enviar los datos del formulario al servidor
            try {
              const data = {
                "user": user_id,
                "nombres_apellidos": nombres_apellidos,
                "edad": edad,
                "provincia": provincia,
                "sexo": sexo,
                "intereses": intereses,
              };
              const record = await pb.collection("profile").create(data);
              const data2 = {
                profile: record.id,
              };
              await pb.collection("users").update(user_id, data2);
              resetForm();
              setIsLoadding(false);
              toast.success("Perfil Creado, Ahora Suba sus fotos...");
              navigate("/profile", { replace: true });
            } catch (error) {
              //console.log(JSON.parse(error));
              toast.error(error.message);
              setIsLoadding(false);
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
                deactivated={isLoadding}
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
