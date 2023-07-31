import { useState } from "preact/hooks";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { toast } from "sonner";
import Alert from "@mui/material/Alert";
import Loadding from "../../helpers/Loadding";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.webp";
import PocketBase from 'pocketbase';

const currentYear = new Date().getFullYear();

function Copyright(props) {
  return (
    <>
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
        {"Copyright Flechazo© "}
        {currentYear}
        {"."}{" "}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        Al Entrar Usted Acepta Nuestros{" "}
        <NavLink to={"/terms"} end>
          Términos y Condiciones
        </NavLink>{" "}
      </Typography>
    </>
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
  //console.log("RENDER Login");
  const [isLoading, setIsLoading] = useState(false);
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  let navigate = useNavigate();
  if (isLoading) {
    return <Loadding />;
  }
  if (!isLoading) {
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
              Flechazo
            </Typography>
            <Formik
              initialValues={{ username: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async ({ username, password }, { resetForm }) => {
                setIsLoading(true);
                // Aquí irá la lógica para enviar los datos del formulario al servidor
                try {
                  await pb.collection('users').authWithPassword(username, password);
                  resetForm();
                  setIsLoading(false);
                  toast.success(`Bienvenido/a ${ pb.authStore.model.username }`);
                  pb.authStore.model.profile ? navigate("/home", { replace: true }) : navigate("/profile/create", { replace: true });
                } catch (error) {
                  toast.error(error.message);
                  setIsLoading(false);
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
                    disabled={isLoading}
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
