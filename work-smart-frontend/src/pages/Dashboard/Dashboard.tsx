import { useEffect, useRef, useState } from "react";
import { Row, Col, Card, Button, Dropdown, Modal, Form, Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../config/Store";
import WebService from "../../Services/WebService";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Label } from "../../components/Common/Label/Label";
import HelperService from "../../Services/HelperService";
import { Controller } from "react-bootstrap-icons";
import { reduxState } from "../../reducer/CommonReducer";
import { useNavigate } from "react-router-dom";
import Grid, {
  GridColumn,
  GridHeader,
  GridRow,
} from "../../components/Grid/Grid";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdLockReset, MdOutlineModeEditOutline } from "react-icons/md";

const headers: GridHeader[] = [
  {
    title: "Sr. No.",
    class: "text-center",
  },
  {
    title: "Start Date",
    class: "text-center",
  },
  {
    title: "End Date",
    class: "text-center",
  },
  {
    title: "Status",
    class: "text-center",
  },
  {
    title: "Note",
    class: "text-center",
  },
  {
    title: "Approved By",
    class: "text-center",
  }
];

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const userInfoData: any = useSelector<RootState, any>((state: any) => state.userInfoData);
  const loggedId = useRef<number>(0);
  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);
  const [logoutDescription, setLogoutDescription] = useState("");
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<any>();
  const RolePermission: any = useSelector<RootState, reduxState>(
    (state: any) => state.RolePermission
  );
  const navigate = useNavigate();
  const permissionCompute: any = useRef<any>(null);
  const [rows, setRows] = useState<GridRow[]>([]);
  const [ShowLoader, setShowLoader] = useState(false);
  const rowCompute = useRef<GridRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageCount = useRef<number>(0);

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    getValues,
    register,
    reset,
    setValue
  } = useForm<any>();

  const handleCloseAddUser = () => {
    setShow(false);
  };

  useEffect(() => {
    if (
      RolePermission &&
      RolePermission?.rolePermission &&
      !HelperService.isEmptyObject(RolePermission?.rolePermission)
    ) {
      if (
        RolePermission?.rolePermission?.menus &&
        RolePermission?.rolePermission?.menus.length > 0
      ) {
        const data = RolePermission?.rolePermission?.menus.find(
          (item: any) => item.name == "Admin User Management"
        );
        if (data && data.isRead) {
          setPermission(data);
          permissionCompute.current = data;
        } else {
          navigate("/login");
        }
      }
    }
  }, [RolePermission]);

  const getUserData = (id: any) => {
    if (id) {
      WebService.getAPI({ action: `api/login-logout-logs/status/${id}`, id: "status-check" })
        .then((response: any) => {
          if (response?.success) {
            const { loggedIn, loginId } = response?.data;
            setIsLoggedIn(loggedIn);
            if (loggedIn && loginId) {
              loggedId.current = loginId;
            }
          }
        })
        .catch((error: any) => {
          console.error("Error fetching user data", error);
        });
    }
  };


  const handleAuthToggle = () => {
    if (isLoggedIn) {
      handleLogoutClick();
    } else {
      login();
    }
  };

  const login = () => {
    WebService.postAPI({
      action: `api/login-logout-logs/login/${userInfoData?.user_info?.id}?loginType=WEB_CLOCK_IN`,
      id: "login-btn",
    })
      .then((response: any) => {
        if (response?.success) {
          setIsLoggedIn(true);
          toast.success("Logged in successfully");
        }
      })
      .catch((error: any) => {
        console.error("Login failed", error);
      });
  };

  const handleLogoutClick = () => {
    setLogoutDescription("");
    setIsLogoutPopupVisible(true);
  };

  const handleLogoutSubmit = () => {
    logout();
  };

  const logout = () => {
    WebService.getAPI({ action: `api/login-logout-logs/status/${userInfoData?.user_info?.id}`, id: "status-check" })
      .then((response: any) => {
        if (response?.success) {
          const { loggedIn, loginId } = response?.data;
          setIsLoggedIn(loggedIn);
          if (loggedIn && loginId) {
            WebService.postAPI({
              action: `api/login-logout-logs/logout/${loginId}`,
              id: "logout-btn",
              body: { description: logoutDescription }
            })
              .then((response: any) => {
                if (response?.success) {
                  setIsLoggedIn(false);
                  toast.success("Logged out successfully");
                  setIsLogoutPopupVisible(false);
                }
              })
              .catch((error: any) => {
                console.error("Logout failed", error);
              });
          }
        }
      })
      .catch((error: any) => {
        console.error("Error fetching user data", error);
      });
  };

  const requestLeave = (data: any) => {
    console.log("Form Data:", data);

    const payload = {
      fromDate: data.fromDate,
      toDate: data.toDate,
      leaveType: data.leaveType,
      note: data.note,
    };

    const userId = userInfoData?.user_info?.id;

    if (!userId) {
      toast.error("User not logged in. Please try again.");
      return;
    }

    WebService.postAPI({
      action: `api/leave-requests/${userId}`,
      body: payload,
      id: "request_leave"
    })
      .then((res: any) => {
        setShow(false)
        toast.success("Leave request submitted successfully");
        reset({});
      })
      .catch((err: any) => {
      });
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

  const handleDateChange = (event: any, fieldName: any) => {
    const dateValue = event.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split("-");
      const formattedDate = `${day}/${month}/${year}`;
      setValue(fieldName, formattedDate);
    }
  };

  const getCustomers = (
    page: number,
    keyword?: string,
    startDate?: Date,
    endDate?: Date
  ) => {
    pageCount.current = page;
    setShowLoader(true);
    WebService.getAPI({
      action: `api/leave-requests/requests/${page}?keyword=${keyword ? keyword : ""
        }&type=${"true"}&date_from=${startDate ? startDate : ""}&date_to=${endDate ? endDate : ""
        }`,
      body: null,
    })
      .then((res: any) => {
        setShowLoader(false);
        let rows: GridRow[] = [];
        if (page == 1) {
          setTotalCount(res.count);
        }
        let startCount = (page - 1) * 10 + 1;
        if (page == 1) {
          setTotalCount(res.count);
        }

        for (var i in res.list) {
          const fullName = `${res.list[i].firstName ? res.list[i].firstName : ""
            } ${res.list[i].lastName ? res.list[i].lastName : ""}`.trim();
          let columns: GridColumn[] = [];
          // columns.push({ value: `${page - 1}${Number(i) + 1}` });
          columns.push({ value: `${startCount++}` });

          columns.push({
            value:
              res.list[i].startDate	&&
              HelperService.getFormattedDatebyText(res.list[i].startDate),
          });
          columns.push({
            value:
              res.list[i].endDate	&&
              HelperService.getFormattedDatebyText(res.list[i].endDate),
          });
          columns.push({
            value: statusList(
              res.list[i].leaveStatus	 ? res.list[i].leaveStatus	 : "N/A"
            ),
          });

          // columns.push({ value: res.list[i].firstName ? res.list[i].firstName : "N/A" });
          columns.push({
            value: res.list[i].description ? res.list[i].description : "N/A",
          });
         
          columns.push({
            value: actionList(Number(i), "ACTION", res.list[i]),
            type: "COMPONENT",
          });
          rowCompute.current.push({ data: columns });
          rows.push({ data: columns });
        }
        rowCompute.current = rows;
        setRows(rowCompute.current);
      })
      .catch((e) => {
        setShowLoader(false);
      });
  };

  const onEdit = (val: any) => {
    reset(val);
    // setEditData(val);
    // setShowPassword(false);
    // setShowAddUser(true);
  };

  const onConfirmDelete = (val: any) => {
    // setEditData(val);
    // setDeleteModal(true);
  };

  const actionList = (value: number, type: string, data: any) => {
      return (
        <div className="action-btns">
          <button
            type="button"
            onClick={() => onEdit(data)}
            className="btn btn-edit"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          >
            <MdOutlineModeEditOutline className="icon" />
          </button>
  
          <button
            type="button"
            className="btn btn-delete"
            onClick={() => onConfirmDelete(data)}
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
          >
            <FaRegTrashAlt className="icon" />
          </button>
        </div>
      );
    };

  const statusList = (status: string) => {
    if (status === "APPROVED") {
      return (
        <span className="badge bg-success-subtle text-success">Approved</span>
      );
    } else if (status === "PENDING") {
      return (
        <span className="badge bg-warning-subtle text-secondary">Pending</span>
      );
    } else {
      return (
        <span className="badge bg-secondary-subtle text-secondary">
          {status}
        </span>
      );
    }
  };

  const onPageChange = (data: any, value: string, startDate: any, endDate: any) => {
    setPage(data);
    getCustomers(data, value, startDate, endDate);
  };

  const { hours, minutes, seconds, ampm } = formatTime();

  return (
    <div className="app-page page-dashboard">
      <div className="d-flex justify-content-between mb-4 align-items-center">
        <h1 className="page-heading mb-lg-0 mb-3">Dashboard</h1>
      </div>

      <Row className="mb-4">
        <Col lg={6}>
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
                  style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                >
                  <span>{hours}</span>
                  <span>:</span>
                  <span>{minutes}</span>
                  <span style={{ fontSize: "0.8rem", marginLeft: "0px" }}>
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
                    fontSize: "12px",
                    textWrap: "nowrap"
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

        <Col lg={6}>
          <Card
            className="p-4"
            style={{
              backgroundColor: "#d0c4a1",
              color: "#000",
              borderRadius: "10px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5
                  className="mb-3"
                  style={{ fontSize: "1.1rem", fontWeight: 600, color: "white" }}
                >
                  Leave Balances
                </h5>
                <div className="d-flex gap-4 align-items-center">
                  {/* Unpaid Leave */}
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        border: "3px solid #a5d8ff",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "auto",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>∞</span>
                    </div>
                    <p className="mt-2 mb-0" style={{ fontSize: "0.9rem", color: "white" }}>UNPAID LEAVE</p>
                  </div>

                  {/* Privilege Leave */}
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        border: "3px solid #a5d8ff",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "auto",
                      }}
                    >
                      <span style={{ fontSize: "1rem", fontWeight: "bold" }}>0</span>
                    </div>
                    <p className="mt-2 mb-0" style={{ fontSize: "0.9rem", color: "white" }}>PRIVILEGE LEAVE</p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <a
                  href="#request-leave"
                  className="mb-2"
                  style={{
                    display: "inline-block",
                    color: "white",
                    fontWeight: "500",
                    textDecoration: "none",
                    marginBottom: "10px",
                  }}
                  onClick={() => setShow(true)}
                >
                  Request Leave
                </a>
                <br />
                <a
                  href="#view-balances"
                  style={{
                    display: "inline-block",
                    color: "white",
                    fontWeight: "500",
                    textDecoration: "none",
                  }}
                  onClick={() => console.log("View All Balances")}
                >
                  View All Balances
                </a>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="mb-3">
        {permission && permission?.isRead && (
          <Grid
            rows={rows}
            headers={headers}
            showDateFilter={true}
            showSearch={true}
            ShowLoader={ShowLoader}
            count={totalCount}
            onPageChange={onPageChange}
            errorMessage={"No Admin Found"}
          />
        )}
      </Row>

      <Modal show={isLogoutPopupVisible} onHide={() => setIsLogoutPopupVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Logout Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="logoutDescription">
            <Form.Label>Enter Completed Task</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={logoutDescription}
              onChange={(e) => setLogoutDescription(e.target.value)}
              placeholder="Enter any updates or reason for logging out..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsLogoutPopupVisible(false)}>
            Cancel
          </Button>
          <Button disabled={!logoutDescription} className="btn-brand-1"
            onClick={handleLogoutSubmit}>
            Submit and Logout
          </Button>
        </Modal.Footer>
      </Modal>

      <Offcanvas show={show} onHide={handleCloseAddUser} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Request Leave</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="form-style d-flex flex-column">
          <form className="mb-3 flex-grow-1" onSubmit={handleSubmit(requestLeave)}>
            {/* Date Selection */}
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <label>From</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="dd/mm/yyyy"
                  {...register("fromDate", { required: true })}
                />
              </div>
              <div>
                <label>To</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="dd/mm/yyyy"
                  {...register("toDate", { required: true })}
                />
              </div>
            </div>
            {errors.fromDate && (
              <div className="login-error">
                <Label title={"From date is required"} modeError={true} />
              </div>
            )}
            {errors.toDate && (
              <div className="login-error">
                <Label title={"To date is required"} modeError={true} />
              </div>
            )}

            {/* Leave Type */}
            <label className="mt-3">Select type of leave you want to apply</label>
            <select
              className="form-control"
              {...register("leaveType", { required: true })}
            >
              <option value="">Select</option>
              <option value="SICK_LEAVE">Sick Leave</option>
              <option value="CASUAL_LEAVE">Casual Leave</option>
              <option value="PRIVILEGE_LEAVE">Privilege Leave</option>
            </select>
            {errors.leaveType && (
              <div className="login-error">
                <Label title={"Leave type is required"} modeError={true} />
              </div>
            )}

            {/* Notes */}
            <label className="mt-3">Note</label>
            <textarea
              className="form-control"
              placeholder="Type here"
              rows={3}
              {...register("note", { required: true })}
            />
            {errors.note && (
              <div className="login-error">
                <Label title={"Note is required"} modeError={true} />
              </div>
            )}
          </form>

          {/* Buttons at Bottom */}
          <div className="mt-auto d-flex justify-content-end">
            <Button
              variant="secondary"
              className="me-2"
              onClick={handleCloseAddUser}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-brand-1"
              style={{ backgroundColor: "#6c63ff", borderColor: "#6c63ff" }}
              onClick={handleSubmit(requestLeave)} // Attach handler here if needed
            >
              Request
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>;

    </div>
  );
};

export default Dashboard;
