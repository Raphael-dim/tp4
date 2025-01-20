import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setIsLoggedIn(true);
            setUserEmail(user.email);
        }
    }, []);

    const handleProfilePage = () => {
        window.location.href = "/profile";
    };



    return (
        <AppBar position="static" style={{ marginBottom: "20px", backgroundColor: "#7192ad" }}>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Split Application
                </Typography>
                {isLoggedIn ? (
                    <div>
                        <Button color="inherit" onClick={handleProfilePage}>
                            {userEmail}
                        </Button>
                    </div>
                ) : (
                    <Button href="/login">
                        Se connecter
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
