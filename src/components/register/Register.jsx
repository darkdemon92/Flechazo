import { signal } from "@preact/signals";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Loadding from "../../helpers/Loadding";
import { useAlertStore } from "../../store/Store";
import { useMutation } from "@apollo/client";
import { MutationRegister } from "../../querys/mutations/RegisterMutations";
import { useUserDataStore } from "../../store/Store";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.webp";

const isLoadding = signal(false);

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      Ya está Registrado???{" "}
      <NavLink to={"/"} end>
        Iniciar Sesión
      </NavLink>{" "}
      <br />
      {"Copyright CubAmor© "}
      {new Date().getFullYear()}
      {"."}{" "}
    </Typography>
  );
}

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("El nombre de usuario es obligatorio")
    .min(4, "Debe tener mínimo 4 caracteres"),
  email: Yup.string()
    .required("El nombre de usuario es obligatorio")
    .email("No es una dirección Email"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(6, "Debe tener mínimo 6 dígitos"),
});

function Register() {
  const [NewRegister] = useMutation(MutationRegister);
  const { ChangeToken, ChangeUser_Data, ChangeLogged } = useUserDataStore();
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
        <>
          <Box
            sx={{
              marginTop: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={Logo}
              alt="logo"
              style={{ width: "20%", height: "auto" }}
            />
            <Typography component="h1" variant="h3">
              CubAmor
            </Typography>
            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async (
                { username, email, password },
                { resetForm }
              ) => {
                isLoadding.value = true;
                // Aquí irá la lógica para enviar los datos del formulario al servidor
                try {
                  const GET = await NewRegister({
                    variables: { username, email, password },
                  });
                  const token = GET.data.register.jwt;
                  ChangeToken(token);
                  const user_data = GET.data.register.user;
                  ChangeUser_Data(user_data);
                  ChangeLogged(true);
                  resetForm();
                  isLoadding.value = false;
                  navigate("/profile", { replace: true });
                } catch (error) {
                  //console.log(error.message);
                  ChangeMsgOpen(true);
                  ChangeSeverity("error");
                  ChangeMsg(
                    error.message === "Email or Username are already taken"
                      ? "El Usuario o el Email ya están en uso!"
                      : error.message === "Failed to fetch"
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
                      id="username"
                      label="Usuario"
                      name="username"
                      autoComplete="username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      autoFocus
                    />
                    <ErrorMessage
                      name="username"
                      component={() => (
                        <Alert severity="warning">{errors.username}</Alert>
                      )}
                    />
                  </div>
                  <div>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Em@il"
                      name="email"
                      autoComplete="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <ErrorMessage
                      name="email"
                      component={() => (
                        <Alert severity="warning">{errors.email}</Alert>
                      )}
                    />
                  </div>
                  <div>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="password"
                      label="Contraseña"
                      name="password"
                      type="password"
                      autoComplete="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <ErrorMessage
                      name="password"
                      component={() => (
                        <Alert severity="warning">{errors.password}</Alert>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1, mb: 1 }}
                  >
                    Registrarse
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
          <Copyright sx={{ mt: 2, mb: 4 }} />
        </>
      </>
    );
  }
}

export default Register;
