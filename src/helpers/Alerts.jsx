import { forwardRef } from 'preact/compat';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { useAlertStore } from "../store/Store";
import { shallow } from "zustand/shallow";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Alerts() {
  const { MsgOpen, SeverityMsg, Msg, Duration, PositionV, PositionH } =
    useAlertStore(
      (state) => ({
        MsgOpen: state.MsgOpen,
        SeverityMsg: state.SeverityMsg,
        Msg: state.Msg,
        Duration: state.Duration,
        PositionV: state.PositionV,
        PositionH: state.PositionH,
      }),
      shallow
    );
  const { ChangeMsgOpen } = useAlertStore();

  const CloseMsg = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    ChangeMsgOpen(false);
  };

  return (
    <Snackbar
      open={MsgOpen}
      anchorOrigin={{ vertical: PositionV, horizontal: PositionH }}
      TransitionComponent={Slide}
      autoHideDuration={Duration}
      onClose={CloseMsg}
    >
      <Alert onClose={CloseMsg} severity={SeverityMsg} sx={{ width: "100%" }}>
        {Msg}
      </Alert>
    </Snackbar>
  );
}

export default Alerts;
