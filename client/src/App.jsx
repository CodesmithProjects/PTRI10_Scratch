import ButtonAppBar from "./AppBar";
import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { lightBlue, deepOrange } from "@mui/material/colors";
import { IconButton, Paper } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import TrailInfoCard from "./TrailInfoCard";
import TrailDetails from "./TrailDetails";
import FavoriteTrails from "./FavoriteTrails";
import Grid from "@mui/material/Grid";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Slider from "@mui/material/Slider";

const App = () => {
  const [zip, updateZip] = useState("");
  const [isZipInvalid, setIsZipInvalid] = useState(false);
  const [trails, setTrails] = useState([]);
  const [showTrails, setShowTrails] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const validZip = new RegExp("^[0-9]*$");
  const [userData, setUserData] = useState({});
  const [radius, setRadius] = useState(25);

  // this resolves an error that is related to the loading overlay package used for the spinner
  // for more details: https://github.com/derrickpelletier/react-loading-overlay/pull/57
  LoadingOverlay.propTypes = undefined;

  // note that themes can be nested, and theme provider can be passed another instance of a theme obj
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: lightBlue[500],
      },
      error: {
        main: deepOrange[500],
      },
    },
  });

  const getTrailsByLocation = (e) => {
    e.preventDefault();
    if (!isZipInvalid) {
      setShowSpinner(true);
      fetch(`api/trails/${zip}/${radius}`)
        .then((response) => response.json())
        .then((res) => {
          if (res.status === 400) {
            setShowTrails(true);
            setTrails([]);
          } else {
            setTrails(res.data);
            setShowTrails(true);
            setShowSpinner(false);
          }
        })
        // TODO: do something more meaningful with this error
        .catch((err) => {
          setTrails([]);
          console.log("error occurred during get trails by location", err);
        });
    } else {
      setShowTrails(false);
      setTrails([]);
    }
  };

  const handleZipChange = (zip) => {
    updateZip(zip);
    setIsZipInvalid(false);
  };

  const validate = () => {
    if (zip.length === 5 && validZip.test(zip)) {
      setIsZipInvalid(false);
    } else {
      setIsZipInvalid(true);
    }
  };

  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingOverlay active={showSpinner} spinner text="Loading trails...">
        <ButtonAppBar
          userData={userData}
          setUserData={setUserData}
        ></ButtonAppBar>
        <Routes>
          <Route
            path="/favoriteTrails"
            element={<FavoriteTrails></FavoriteTrails>}
          ></Route>
          <Route
            path="/details/:id/:idx"
            element={<TrailDetails userData={userData}></TrailDetails>}
          ></Route>
          <Route
            path="/"
            element={
              <>
                <Paper sx={{ height: "100%" }}>
                  <div className="container">
                    <div className="img-wrapper">
                      <img
                        src="src/assets/homepage-1.jpeg"
                        className="welcome-img"
                      ></img>
                      <img
                        src="src/assets/homepage-2.jpeg"
                        className="welcome-img"
                      ></img>
                    </div>
                    <div className="welcome-msg">
                      <Typography
                        variant="h4"
                        sx={{ marginBottom: "1rem", letterSpacing: "1px" }}
                      >
                        Discover your next adventure
                      </Typography>
                      <form onSubmit={getTrailsByLocation} noValidate hidden={!userData.name}>
                        <TextField
                          required
                          error={isZipInvalid}
                          helperText={
                            isZipInvalid
                              ? "Zipcode must be a 5 digit number"
                              : ""
                          }
                          value={zip}
                          onChange={(e) => handleZipChange(e.target.value)}
                          sx={{
                            backgroundColor: "rgba(0,0,0,.8)",
                            width: "70%",
                          }}
                          variant="filled"
                          label="Search by zipcode"
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                formNoValidate
                                type="submit"
                                onClick={validate}
                              >
                                <SearchIcon />
                              </IconButton>
                            ),
                          }}
                        />
                        <Typography variant="subtitle1" sx={{ marginTop: "1rem" }}>
                          Search distance: {radius} miles
                        </Typography>
                        <Slider
                          value={radius}
                          onChange={(e, value) => setRadius(value)}
                          defaultValue={25}
                          step={1}
                          marks
                          min={1}
                          max={100}
                          valueLabelDisplay="auto"
                          sx={{
                            width: "70%",
                            marginBottom: "1rem",
                            color: "#ffffff",
                            "& .MuiSlider-thumb": {
                              color: "#ffffff",
                            },
                            "& .MuiSlider-track": {
                              color: "#ffffff",
                            },
                            "& .MuiSlider-rail": {
                              color: "#ffffff",
                            },
                          }}
                        />
                      </form>
                      <Typography
                        variant="h4"
                        sx={{ marginBottom: "1rem", letterSpacing: "1px"}}
                        hidden={userData.name}
                      >
                        Please log in
                      </Typography>
                    </div>
                  </div>
                  <div className="grid-wrapper">
                    <Grid
                      container
                      sx={{ marginTop: "3rem" }}
                      direction={"row"}
                      spacing={3}
                    >
                      {showTrails ? (
                        trails === undefined ? (
                          <div className="error-message">
                            <p>
                              Sorry, no matching trails were found within a {radius} mile radius from this zipcode.
                            </p>
                          </div>
                        ) : (
                          trails.map((trail, i) => {
                            return (
                              <Grid
                                item
                                xs={6}
                                s={5}
                                lg={4}
                                xl={3}
                                display="flex"
                                justifyContent="center"
                                key={i}
                              >
                                <Link
                                  to={`/details/${trail.id}/${i}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <TrailInfoCard
                                    key={i}
                                    index={i}
                                    trail={trail}
                                  />
                                </Link>
                              </Grid>
                            );
                          })
                        )
                      ) : undefined}
                    </Grid>
                  </div>
                </Paper>
              </>
            }
          ></Route>
        </Routes>
      </LoadingOverlay>
    </ThemeProvider>
  );
};

export default App;
