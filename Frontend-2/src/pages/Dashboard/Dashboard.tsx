import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../config/Store";
import WebService from "../../Services/WebService";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const userInfoData: any = useSelector<RootState, any>((state: any) => state.userInfoData);
  const [loginId, setLoginId] = useState<number | null>(null);

  // This function will check the user login status and update the UI accordingly
  const getUserData = (id: any) => {
    if (id) {
      WebService.getAPI({ action: `api/login-logout-logs/status/${id}`, id: "status-check" })
        .then((response: any) => {
          if (response?.success) {
            const { loggedIn, loginId } = response?.data;
            setIsLoggedIn(loggedIn);
            if (loggedIn && loginId) {
              // Store loginId or use it for other operations
              setLoginId(loginId);  // Assuming you use `loginId` somewhere
            }
          }
        })
        .catch((error: any) => {
          console.error("Error fetching user data", error);
        });
    }
  };
  

  // Handle Login/Logout toggle
  const handleAuthToggle = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login();
    }
  };

  // Call to API to log the user in
  const login = () => {
    WebService.postAPI({
      action: `api/login-logout-logs/login/${userInfoData?.user_info?.id}?loginType=WEB_CLOCK_IN`,
      id: "login-btn",
    })
      .then((response: any) => {
        if (response?.success) {
          setIsLoggedIn(true);
          console.log("Logged in successfully");
        }
      })
      .catch((error: any) => {
        console.error("Login failed", error);
      });
  };

  // Call to API to log the user out
  const logout = () => {
    if (loginId) {  // Ensure loginId exists before sending it
      WebService.postAPI({
        action: `api/login-logout-logs/logout/${loginId}`,
        id: "logout-btn",
      })
        .then((response: any) => {
          if (response?.success) {
            setIsLoggedIn(false);
            console.log("Logged out successfully");
          }
        })
        .catch((error: any) => {
          console.error("Logout failed", error);
        });
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userInfoData?.user_info?.id) {
      getUserData(userInfoData?.user_info?.id);
    }
  }, [userInfoData?.user_info]);

  const formatTime = () => {
    const hours = currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      hour12: true,
    }).replace(/\s[APap][Mm]/, "");
    const minutes = currentTime.toLocaleTimeString("en-US", {
      minute: "2-digit",
    });
    const seconds = currentTime.toLocaleTimeString("en-US", {
      second: "2-digit",
    });
    const ampm = currentTime.toLocaleTimeString("en-US", {
      hour12: true,
    }).match(/[APap][Mm]/);

    return { hours, minutes, seconds, ampm: ampm ? ampm[0] : "" };
  };

  const { hours, minutes, seconds, ampm } = formatTime();

  return (
    <div className="app-page page-dashboard">
      <div className="d-flex justify-content-between mb-4 align-items-center">
        <h1 className="page-heading mb-lg-0 mb-3">Dashboard</h1>
      </div>

      <Row className="mb-4">
        <Col lg={12}>
          <Card
            className="p-4"
            style={{
              backgroundColor: "#74c0fc",
              color: "#fff",
              borderRadius: "10px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5
                  className="mb-2"
                  style={{ fontSize: "1.1rem", fontWeight: 500 }}
                >
                  Time Today -{" "}
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h5>
                <p
                  className="mb-1"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 400,
                    paddingTop: "10px",
                  }}
                >
                  CURRENT TIME
                </p>
                <div
                  className="d-flex align-items-baseline"
                  style={{ fontSize: "3rem", fontWeight: "bold" }}
                >
                  <span>{hours}</span>
                  <span>:</span>
                  <span>{minutes}</span>
                  <span style={{ fontSize: "1.5rem", marginLeft: "0px" }}>
                    <span>:</span>{seconds}
                  </span>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      marginLeft: "10px",
                      fontWeight: "500",
                    }}
                  >
                    {ampm}
                  </span>
                </div>
              </div>
              <div className="d-flex gap-3">
                <Button
                  variant="light"
                  onClick={handleAuthToggle}
                  style={{
                    color: isLoggedIn ? "#d9534f" : "#5cb85c",
                    borderRadius: "5px",
                    fontWeight: "500",
                  }}
                >
                  {isLoggedIn ? "Logout" : "Web Clock-In"}
                </Button>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-basic"
                    style={{
                      borderRadius: "5px",
                      fontWeight: "500",
                    }}
                  >
                    Other
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => console.log("Work from home Clicked")}
                    >
                      Work from home
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => console.log("Partial Day Clicked")}
                    >
                      Partial Day
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
