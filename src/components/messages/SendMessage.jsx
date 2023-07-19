import { Formik, Form, ErrorMessage } from "formik";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useMutation } from "@apollo/client";
import { SendMensaje } from "../../querys/mutations/MessagesMutations";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import SendIcon from "@mui/icons-material/Send";

export default function SendMessage({ user_id, destinatario, refetch }) {
  const [CreateMensaje, { loading }] = useMutation(SendMensaje);
  return (
    <>
      <Formik
        initialValues={{ mensaje: "" }}
        //validationSchema={validationSchema}
        onSubmit={async (
          { mensaje },
          { resetForm, setSubmitting, setFieldError }
        ) => {
          // Aquí irá la lógica para enviar los datos del formulario al servidor
          //console.log(user_id, destinatario, mensaje);
          try {
            await CreateMensaje({
              variables: { user_id, destinatario, mensaje },
            });
            resetForm();
            refetch();
            setSubmitting(false);
          } catch (error) {
            console.log(error.message);
            setSubmitting(false);
            setFieldError("mensaje", error.message);
          }
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          isSubmitting,
          isValid,
        }) => (
          <Form>
            {loading && (
              <>
                <br />
                <br />
                <LinearProgress />
                <br />
                <Typography
                  component="h1"
                  variant="h6"
                  style={{ color: "green" }}
                >
                  Enviando Mensaje...
                </Typography>
                <br />
                <br />
                <br />
              </>
            )}
            <br />
            <>
              <div>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  multiline
                  rows={2}
                  id="mensaje"
                  label="Escriba su Mens@je aquí:"
                  name="mensaje"
                  autoComplete="mensaje"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mensaje}
                  autoFocus
                />
                <ErrorMessage
                  name="mensaje"
                  component={() => (
                    <Alert severity="warning">{errors.mensaje}</Alert>
                  )}
                />
              </div>
            </>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 1, mb: 1 }}
              disabled={isSubmitting || !isValid}
              endIcon={<SendIcon />}
            >
              Enviar Mensaje
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
