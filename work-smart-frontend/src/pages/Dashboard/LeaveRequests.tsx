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
import DatePicker from "react-datepicker";
import { format, differenceInCalendarDays, differenceInDays } from "date-fns";
import Grid, {
  GridColumn,
  GridHeader,
  GridRow,
} from "../../components/Grid/Grid";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdLockReset, MdOutlineModeEditOutline } from "react-icons/md";
import PageTitle from "../../components/Common/PageTitle";
import DeleteModal from "../../components/Common/DeleteModal/DeleteModal";
import CancelLeave from "../../components/Common/DeleteModal/Cancel Leave Request";

const headers: GridHeader[] = [
  {
    title: "Leave Date",
    class: "text-center",
  },
  {
    title: "Leave Type",
    class: "text-center",
  },
  {
    title: "Status",
    class: "text-center",
  },
  {
    title: "Requested By",
    class: "text-center",
  },
  {
    title: "Action Taken on",
    class: "text-center",
  },
  {
    title: "Leave Note",
    class: "text-center",
  },
  {
    title: "Reject Reason",
    class: "text-center",
  },
  {
    title: "Action",
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
  const totalLeaves = useRef<number>(0);
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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const openedId = useRef<number>(0);
  const [showDeleteModal, setDeleteModal] = useState<boolean>(false);

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
          (item: any) => item.name == "Dashboard"
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
            const { loggedIn, loginId, totalLeave } = response?.data;
            setIsLoggedIn(loggedIn);
            if (loggedIn && loginId) {
              loggedId.current = loginId;
            }
            if (totalLeave) {
              totalLeaves.current = totalLeave
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

  const format = (date: any, formatString: string): string => {
    const pad = (num: number) => (num < 10 ? `0${num}` : num.toString());

    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());

    switch (formatString) {
      case "yyyy-MM-dd":
        return `${yyyy}-${MM}-${dd}`;
      default:
        throw new Error("Unsupported format string");
    }
  };

  const requestLeave = (data: any) => {
    const payload: any = {
      fromDate: format(startDate, "yyyy-MM-dd"),
      toDate: format(endDate, "yyyy-MM-dd"),
      leaveType: data.leaveType,
      note: data.note,
    };
    if (daysApplied == 1) {
      payload["applyFor"] = data.applyFor;
    }
    const userId = userInfoData?.user_info?.id;

    if (!userId) {
      toast.error("User not logged in. Please try again.");
      return;
    }

    WebService.putAPI({
      action: `api/leave-requests/${userId}/${openedId.current}`,
      body: payload,
      id: "request_leave"
    })
      .then((res: any) => {
        setShow(false)
        if (userInfoData?.user_info?.id) {
          getUserData(userInfoData?.user_info?.id);
          getCustomers(1);
        }
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
          columns.push({
            value: leaveDate(res.list[i].startDate, res.list[i].endDate, res.list[i].applyType),
            type: "COMPONENT",
          });
          columns.push({
            value: leaveTypeAndRequestedOn(res.list[i].createdDate, res.list[i].leaveType),
            type: "COMPONENT",
          });
          columns.push({
            value: statusList(
              res.list[i].leaveStatus ? res.list[i].leaveStatus : "-"
            ),
          });

          columns.push({
            value:
              res.list[i].username ? res.list[i].username : "-",
          });
          columns.push({
            value: res.list[i].updateDate ? HelperService.getFormattedDatebyText(res.list[i].updateDate) : "N/A",
          });
          columns.push({
            value: res.list[i].description ? res.list[i].description : "-",
          });
          columns.push({
            value: res.list[i].rejectReason ? res.list[i].rejectReason : "-",
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
    setStartDate(new Date(val.startDate));
    setEndDate(new Date(val.endDate));
    openedId.current = val.id;
    // setEditData(val);
    // setShowPassword(false);
    // setShowAddUser(true);
  };

  const onConfirmDelete = (val: any) => {
    // setEditData(val);
    openedId.current = val.id
    setDeleteModal(true);
  };

  const onDelete = () => {
    setDeleteModal(false);
    setShowLoader(true);
    WebService.postAPI({
      action: `api/leave-requests/cancel/${userInfoData?.user_info?.id}/${openedId.current}`,
      body: null,
    })
      .then((res: any) => {
        setShowLoader(false);
        toast.success(res.message);
        // setEditData("");
        getCustomers(page);
      })
      .catch((e) => {
        setShowLoader(false);
        // setEditData("");
      });
  };

  const handleOnEdit = (data: any) => {
    data.note = data.description
    console.log(data.startDate, data.endDate)
    data.fromDate = data.startDate;
    data.toDate = data.endDate;
    openedId.current = data.id;
    onEdit(data);
    reset(data);
    setShow(true);
  }

  const actionList = (value: number, type: string, data: any) => {
    return (
      <div className="action-btns">
        <button
          type="button"
          onClick={() => handleOnEdit(data)}
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

  const leaveDate = (startDate: string, endDate: string, type: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    var dayDifference = differenceInDays(end, start) + 1;
    if (type == 'FIRST_HALF' || type == 'SECOND_HALF') {
      dayDifference = 0.5;
    }
    return (
      <div>
        <div>
          {dayDifference > 1
            ? `${HelperService.getFormattedDatebyText(start)} to ${HelperService.getFormattedDatebyText(end)}`
            : HelperService.getFormattedDatebyText(start)}
        </div>
        <div>{dayDifference === 1 ? "1 day" : `${dayDifference} days`}</div>
      </div>
    );
  };

  const leaveTypeAndRequestedOn = (requestDate: any, type: string) => {
    const end = new Date(requestDate);
    return (
      <div>
        <div>{type === "PRIVILEGE_LEAVE" ? "Privilege Leave" : 'Unpaid Leave'}</div>
        <div style={{fontSize: "11px", color: "#847d7d", textWrap: "nowrap"}}>Requested On {HelperService.getFormattedDatebyText(end)}
        </div>
      </div>
    );
  }

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

  const calculateDayDifference = (start: Date | null, end: Date | null): number => {
    if (!start || !end) return 0;
    return differenceInCalendarDays(end, start) + 1;
  };
  const daysApplied = calculateDayDifference(startDate, endDate);

  const { hours, minutes, seconds, ampm } = formatTime();

  return (
    <div className="app-page page-dashboard">
      <CancelLeave
        isShow={showDeleteModal}
        close={() => {
          setDeleteModal(false);
        }}
        onDelete={() => {
          onDelete();
        }}
      />
      <div className="d-flex justify-content-between align-items-center ">
        <PageTitle
          title="Leave"
          backArrow={true}
        />
      </div>
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
            errorMessage={"No Leave Request Found"}
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
              <div className="col-6">
                <label>From</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                  // minDate={new Date()}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="form-control"
                  placeholderText="Select start date"
                />
              </div>
              <div className="col-6">
                <label>To</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date) => setEndDate(date)}
                  minDate={startDate || new Date()}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  className="form-control"
                  placeholderText="Select end date"
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
            {startDate && endDate && (
              <div className="mt-2">
                <strong>Days Applied:</strong> {calculateDayDifference(startDate, endDate)} days
              </div>
            )}

            {/* Leave Type */}
            {/* <label className="mt-3">Select type of leave you want to apply</label>
            <select
              className="form-control"
              {...register("leaveType", { required: true })}
            >
              <option value="">Select</option>
              <option value="UNPAID_LEAVE">Unpaid Leave</option>
              <option value="PRIVILEGE_LEAVE" disabled={daysApplied > totalLeaves.current}>Privilege Leave</option>
            </select>
            {errors.leaveType && (
              <div className="login-error">
                <Label title={"Leave type is required"} modeError={true} />
              </div>
            )} */}

            {daysApplied == 1 ?
              <>
                <label className="mt-3">Apply For</label>
                <select
                  className="form-control"
                  {...register("applyFor", { required: true })}
                >
                  <option value="">Select</option>
                  <option value="FIRST_HALF">First half</option>
                  <option value="SECOND_HALF" disabled={daysApplied > totalLeaves.current}>Second half</option>
                  <option value="FULL_DAY">Full day</option>
                </select>
                {errors.applyFor && (
                  <div className="login-error">
                    <Label title={"Field is required"} modeError={true} />
                  </div>
                )}
              </> : <></>
            }


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
              onClick={handleSubmit(requestLeave)}
            >
              Request
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

    </div>
  );
};

export default Dashboard;
