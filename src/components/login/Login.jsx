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
import { MutationLogin } from "../../querys/mutations/LoginMutations";
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
      No está Registrado???{" "}
      <NavLink to={"/register"} end>
        Registrarse
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
    .required("El Em@il es obligatorio")
    .email("No es una dirección Email"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(6, "Debe tener mínimo 6 dígitos"),
});

function Login() {
  const [NewLogin] = useMutation(MutationLogin);
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
              initialValues={{ username: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async ({ username, password }, { resetForm }) => {
                isLoadding.value = true;
                // Aquí irá la lógica para enviar los datos del formulario al servidor
                try {
                  const GET = await NewLogin({
                    variables: { username, password },
                  });
                  const token = GET.data.login.jwt;
                  ChangeToken(token);
                  const user_data = GET.data.login.user;
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
                    error.message === "Invalid identifier or password"
                      ? "Email o Password Incorrecto!"
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
                      label="Em@il"
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
                      id="password"
                      label="Contraseña"
                      name="password"
                      type="password"
                      autoComplete="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      autoFocus
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
                    Iniciar Sesión
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

export default Login;
