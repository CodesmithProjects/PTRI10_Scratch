import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import getOAuthURL from "../utils/getOAuthURL";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ButtonAppBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleLogout = () => {
  //   fetch('/api/sessions/logout')
  //         .catch((err) => {
  //           console.log(err);
  //         })
  // }

  // const handleLogin = () => {
  //   return window.open(getOAuthURL(), "_blank")
  // }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div>
            <IconButton
              onClick={handleMenu}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{ marginTop: "2rem" }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Link to="/favoriteTrails" style={{ textDecoration: "none" }}>
                <MenuItem sx={{ color: "#fff" }} onClick={handleClose}>Favorite trails</MenuItem>
              </Link>
            </Menu>
          </div>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, letterSpacing: "1px" }}
          >
            <Link
              to="/"
              style={{
                textDecoration: "none",
                boxShadow: "none",
                color: "#fff",
              }}
            >
              Trail Blazers
            </Link>
          </Typography>
          {/* <Button onClick={handleLogin} hidden={!props.currentUser}>Login</Button> */}
          <Button component="a" href="http://localhost:4000/auth/google" hidden={!props.currentUser}>Login</Button>
          {/* <Button color="inherit" onClick={handleLogout} hidden={props.currentUser}>Logout</Button> */}
          <Button color="inherit" component="a" href="http://localhost:4000/logout" hidden={props.currentUser}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
