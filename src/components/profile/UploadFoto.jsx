import { signal } from "@preact/signals";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Compressor from "compressorjs";
import LinearProgress from "@mui/material/LinearProgress";
import PocketBase from "pocketbase";

const Box1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: "24px",
  p: 4,
};
const validationSchema = Yup.object().shape({
  fotos: Yup.mixed()
    .required("La imagen es requerida")
    .test("fileFormat", "Solo se permiten imágenes", (value) => {
      return value && value.type && value.type.startsWith("image/");
    })
    .test(
      "fileType",
      "Solo se permiten imágenes jpg, jpeg, png y webp",
      (value) => {
        const allowedTypes = [
          "image/jpg",
          "image/jpeg",
          "image/png",
          "image/webp",
        ];
        return value && allowedTypes.includes(value.type);
      }
    )
    .test("fileSize", "La imagen no debe ser mayor de 5Mb", (value) => {
      return value && value.size <= 5 * 1024 * 1024;
    }),
});

const resizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        blob.name = file.name;
        resolve(blob);
      }, file.type);
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
};
const compressImagePromise = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.4, //0 0.2 0.4 0.6 0.8 1
      success: (compressedFile) => {
        resolve(compressedFile);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

const loading = signal(false);

export default function UploadFoto({ modal3Status, data, setDataChange }) {
  //console.log("RENDER UploadFoto");
  //console.log(data);
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  const closeModal = () => {
    modal3Status.value = false;
  };
  return (
    <Modal
      open={modal3Status.value}
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
          Subir fotos
        </Typography>
        {loading.value && (
          <>
            <br />
            <br />
            <LinearProgress />
            <br />
            <Typography component="h1" variant="h6" style={{ color: "green" }}>
              subiendo Avatar...
            </Typography>
            <br />
            <br />
            <br />
          </>
        )}
        <Formik
          initialValues={{
            fotos: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (
            { fotos },
            { resetForm, setSubmitting, setFieldError }
          ) => {
            loading.value = true;
            const formData = new FormData();
            try {
              //Redimensionar la imagen a XXXX x XXXX píxeles
              const resizedImage = await resizeImage(fotos, 1280, 720);
              // Comprime la imagen utilizando la función compressImagePromise
              const compressedImage = await compressImagePromise(
                resizedImage
              );
              formData.append('foto', compressedImage);
              const createdRecord = await pb.collection("fotos").create(formData);
              const datos = {
                "nombres_apellidos": data.nombres_apellidos,
                "edad": data.edad,
                "provincia": data.provincia,
                "sexo": data.sexo,
                "intereses": data.intereses,
                "avatar": data.avatar,
                "mis_fotos": [...data.mis_fotos, createdRecord.id],
              };
              const response = await pb.collection("profile").update(data.id, datos);
              setDataChange(response);
              loading.value = false;
              resetForm();
              closeModal();
            } catch (error) {
              loading.value = false;
              setSubmitting(false);
              setFieldError("fotos", error.message);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
            isValid,
          }) => (
            <Form>
              <Field
                margin="normal"
                required
                fullWidth
                id="fotos"
                label="fotos"
                name="fotos"
                type="file"
                autoComplete="fotos"
                accept={["image/jpg", "image/jpeg", "image/png", "image/webp"]}
                //multiple
                onChange={(event) => {
                  setFieldValue("fotos", event.currentTarget.files[0]);
                  // const files = event.currentTarget.files;
                  // for (let i = 0; i < files.length; i++) {
                  //   setFieldValue("fotos", files[i]);
                  //   compressImage(files[i], setFieldValue);
                  // }
                }}
                onBlur={handleBlur}
                value={values.fotos}
              />
              <ErrorMessage
                name="fotos"
                component={() => (
                  <Alert severity="warning">{errors.fotos}</Alert>
                )}
              />
              <Button
                type="submit"
                fullWidth
                color="success"
                variant="contained"
                sx={{ mt: 1, mb: 1 }}
                disabled={isSubmitting || !isValid}
              >
                Upload fotos
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
