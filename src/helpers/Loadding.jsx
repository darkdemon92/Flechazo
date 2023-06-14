import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

function Loadding() {
  return (
    <Box
      sx={{
        marginTop: "35%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CircularProgress color="success" />
    </Box>
  );
}

export default Loadding;
