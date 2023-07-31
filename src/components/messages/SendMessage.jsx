import { Formik, Form, ErrorMessage } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import SendIcon from "@mui/icons-material/Send";
import PocketBase from "pocketbase";


export default function SendMessage({ user_id, destinatario, messages, setMessages }) {
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);

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
          setSubmitting(true);
          try {
            const data = {
              "mensaje": mensaje,
              "remitente": user_id,
              "destinatario": destinatario,
            };
            const msg = await pb.collection("mensajes").create(data);
            setMessages([...messages, msg]);
            resetForm();
            setSubmitting(false);
          } catch (error) {
            //console.log(error.message);
            setFieldError("mensaje", error.message);
            setSubmitting(false);
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
                  //autoFocus
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
              disabled={isSubmitting}
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
