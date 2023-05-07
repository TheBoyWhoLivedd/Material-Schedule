import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { InputAdornment, Link as MaterialLink } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import UserIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Lock";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const Login = () => {
  useTitle("Employee Login");

  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("Warren");
  const [password, setPassword] = useState("7890");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.primary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <MaterialLink color="inherit" href="https://ura.go.ug/">
          Uganda Revenue Authority
        </MaterialLink>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <PulseLoader color={"#FFF"} />;

  const content = (
    <>
      <CssBaseline />
      <section className="">
        {/* <header>
          <h1>DEEMED VAT UNIT</h1>
        </header> */}
        <main className="">
          <Typography ref={errRef} className={errClass} aria-live="assertive">
            {errMsg}
          </Typography>

          <>
            <Grid container component="main" sx={{ height: "100vh" }}>
              <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                  backgroundImage: "url(./img/ura.jpg)",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: (t) =>
                    t.palette.mode === "light"
                      ? t.palette.grey[50]
                      : t.palette.grey[900],
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
              >
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Employee Login
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1, p: 4 }}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="off"
                      autoFocus
                      inputRef={userRef}
                      value={username}
                      onChange={handleUserInput}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{
                              backgroundColor: (theme) =>
                                theme.palette.background.paper,
                              borderTopLeftRadius: 50,
                              borderBottomLeftRadius: 50,
                            }}
                          >
                            <UserIcon />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: "50px 50px 50px 50px",
                        },
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={handlePwdInput}
                      value={password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PasswordIcon />
                          </InputAdornment>
                        ),
                        style: { borderRadius: 50 },
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="remember"
                          color="primary"
                          id="persist"
                          onChange={handleToggle}
                          checked={persist}
                        />
                      }
                      label="Trust This Device"
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ pt: 1, pb: 1, borderRadius: 50 }}
                    >
                      Sign In
                    </Button>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </>
        </main>
      </section>
    </>
  );

  return content;
};
export default Login;
