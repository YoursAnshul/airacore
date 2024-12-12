import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageTitle from "../../components/Common/PageTitle";
import Grid, {
  GridColumn,
  GridHeader,
  GridRow,
} from "../../components/Grid/Grid";
import WebService from "../../Services/WebService";
import { toast } from "react-toastify";
import DeleteModal from "../../components/Common/DeleteModal/DeleteModal";
import { RootState } from "../../config/Store";
import { reduxState } from "../../reducer/CommonReducer";
import HelperService from "../../Services/HelperService";
import { Card } from "react-bootstrap";
import { FaInfoCircle, FaRegEye } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";

const headers: GridHeader[] = [
  {
    title: "Sr. No.",
    class: "text-center",
  },
  {
    title: "Name",
    class: "text-center",
  },
  {
    title: "Date",
    class: "text-center",
  },
  {
    title: "Login Time",
    class: "text-center",
  },
  {
    title: "Logout Time",
    class: "text-center",
  },
  {
    title: "Status",
    class: "text-center",
  },
  {
    title: "Summary",
    class: "text-center",
  },
  {
    title: "Action",
    class: "text-center freeze-column",
    isSorting: false,
    isFilter: false,
    isFreeze: true,
  },
];

const detailsHeaders: GridHeader[] = [
  {
    title: "Sr. No.",
    class: "text-center",
  },
  {
    title: "Login Time",
    class: "text-center",
  },
  {
    title: "Logout Time",
    class: "text-center",
  },
  {
    title: "Description",
    class: "text-center",
  }
];

const LoginLogoutLogs = () => {
  const permissionCompute: any = useRef<any>(null);
  const pageCount = useRef<number>(0);
  const rowCompute = useRef<GridRow[]>([]);
  const detailsRowCompute = useRef<GridRow[]>([]);
  const navigate = useNavigate();
  const [rows, setRows] = useState<GridRow[]>([]);
  const [detailsRows, setDetailsRow] = useState<GridRow[]>([]);
  const [ShowLoader, setShowLoader] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [detailsTotalCount, setDetailsTotalCount] = useState(0);
  const [editData, setEditData] = useState<any>();
  const [showDeleteModal, setDeleteModal] = useState<boolean>(false);
  const [permission, setPermission] = useState<any>();
  const [isloginUserId, setloginUserId] = useState<any>();
  const userInfoData: any = useSelector<RootState, any>(
    (state: any) => state.userInfoData
  );
  const openedId = useRef<number>(0);
  const openedName = useRef<String>("");
  const openedDate = useRef<String>("");
  const openedDescription = useRef<String>("");

  const RolePermission: any = useSelector<RootState, reduxState>(
    (state: any) => state.RolePermission
  );
  const [page, setPage] = useState(1);
  const [show, setShowModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  useEffect(() => {
    if (
      userInfoData &&
      userInfoData?.user_info &&
      !HelperService.isEmptyObject(userInfoData?.user_info)
    ) {
      setloginUserId(userInfoData.user_info.id);
      console.log("isloginUserId------------>", isloginUserId);

    }
  }, [isloginUserId, userInfoData]);

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
          (item: any) => item.name === "Login Logout Logs"
        );
        if (data && data.isRead) {
          setPermission(data);
          permissionCompute.current = data;
        } else {
          navigate("/dashboard");
        }
      }
    }
  }, [RolePermission, navigate]);

  const actionListSummary = useCallback(
    (data: any) => {
      return (
        <div className="action-btns">
          <button
            onClick={() => openSummaryModal(data)}
            className="btn btn-eye"
            data-toggle="tooltip"
            data-placement="top"
            title="View"
          >
            <FaInfoCircle className="icon" />
          </button>
        </div>
      );
    },
    []
  );

  const actionList = useCallback(
    (data: any) => {
      return (
        <div className="action-btns">
          <button
            onClick={() => openModal(data)}
            className="btn btn-eye"
            data-toggle="tooltip"
            data-placement="top"
            title="View"
          >
            <FaRegEye className="icon" />
          </button>
        </div>
      );
    },
    []
  );

  const getLoginLogoutLogs = useCallback(
    (page: number, keyword?: string, startDate?: Date, endDate?: Date) => {
      pageCount.current = page;
      setShowLoader(true);
      WebService.getAPI({
        action: `api/login-logout-logs/logs/${page}?keyword=${keyword ? keyword : ""}&date_from=${startDate ? startDate : ""}&date_to=${endDate ? endDate : ""}`,
        body: null,
      })
        .then((res: any) => {
          setShowLoader(false);
          let rows: GridRow[] = [];
          if (page === 1) {
            setTotalCount(res.count);
          }
          let startCount = (page - 1) * 10 + 1;

          for (var i in res.list) {
            let columns: GridColumn[] = [];
            columns.push({ value: `${startCount++}` });
            columns.push({ value: res.list[i].username ? res.list[i].username : "N/A" });
            columns.push({ value: res.list[i].date ? HelperService.getFormattedDatebyText(res.list[i].date) : "N/A" });
            columns.push({ value: res.list[i].loginTime ? HelperService.getFormatedIST(res.list[i].loginTime) : "N/A" });
            columns.push({ value: res.list[i].logoutTime ? HelperService.getFormatedIST(res.list[i].logoutTime) : "N/A" });
            columns.push({ value: statusList(res.list[i].currentStatus ? res.list[i].currentStatus : "N/A") });
            columns.push({ value: actionListSummary(res.list[i]), type: "COMPONENT" });
            columns.push({ value: actionList(res.list[i]), type: "COMPONENT" });
            rowCompute.current.push({ data: columns });
            rows.push({ data: columns });
          }
          rowCompute.current = rows;
          setRows(rowCompute.current);
        })
        .catch((e) => {
          setShowLoader(false);
        });
    },
    [actionList]
  );

  useEffect(() => {
    getLoginLogoutLogs(1);
  }, [getLoginLogoutLogs]);

  const getLoginLogoutLogsDetails = (
    page: number,
    logId: number,
    keyword?: string,
    startDate?: Date,
    endDate?: Date
  ) => {
    pageCount.current = page;
    setShowLoader(true);
    WebService.getAPI({
      action: `api/login-logout-logs/logs-details/${logId}/${page}?keyword=${keyword ? keyword : ""}&date_from=${startDate ? startDate : ""
        }&date_to=${endDate ? endDate : ""}`,
      body: null,
    })
      .then((res: any) => {
        setShowLoader(false);
        let rows: GridRow[] = [];
        if (page === 1) {
          setDetailsTotalCount(res.count);
        }
        let startCount = (page - 1) * 10 + 1;
        if (page === 1) {
          setDetailsTotalCount(res.count);
        }

        for (var i in res.list) {
          let columns: GridColumn[] = [];
          columns.push({ value: `${startCount++}` });
          columns.push({ value: res.list[i].loginTime ? HelperService.getFormatedIST(res.list[i].loginTime) : "N/A" });
          columns.push({ value: res.list[i].logoutTime ? HelperService.getFormatedIST(res.list[i].logoutTime) : "N/A" });
          columns.push({
            value: res.list[i].description
              ? res.list[i].description.split("\n").map((line: any, index: any) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))
              : "N/A",
          });
          columns.push({ value: actionList(res.list[i]), type: "COMPONENT" });
          detailsRowCompute.current.push({ data: columns });
          rows.push({ data: columns });
        }
        detailsRowCompute.current = rows;
        setDetailsRow(detailsRowCompute.current);
      })
      .catch((e) => {
        setShowLoader(false);
      });
  };


  const onDelete = () => {
    setDeleteModal(false);
    setShowLoader(true);
    WebService.deleteAPI({
      action: `api/user/delete/role/${editData?.id}`,
      body: null,
    })
      .then((res: any) => {
        setShowLoader(false);
        toast.success(res.message);
        setEditData("");
        getLoginLogoutLogs(page);
      })
      .catch((e) => {
        setShowLoader(false);
        setEditData("");
      });
  };

  const openModal = (data: any) => {
    console.log(data)
    openedId.current = data.id
    openedName.current = data.username
    openedDate.current = data.date
    setShowModal(true);
  };

  const openSummaryModal = (data: any) => {
    console.log(data)
    openedId.current = data.id
    openedName.current = data.username
    openedDate.current = data.date
    openedDescription.current = data.description
    setShowSummaryModal(true);
  };

  const handleClose = () => {
    setDetailsRow([]);
    setShowModal(false);
  };

  const handleSummaryClose = () => {
    setShowSummaryModal(false);
  };


  const statusList = (status: string) => {
    if (status === "LOGIN") {
      return (
        <span className="badge bg-success-subtle text-success">Login</span>
      );
    } else if (status === "LOGOUT") {
      return (
        <span className="badge bg-warning-subtle text-danger">Logout</span>
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
    setPage(data)
    getLoginLogoutLogs(data, value, startDate, endDate)
  }

  const onDetailsPageChange = (data: any, value: string, startDate: any, endDate: any) => {
    console.log("date------------>", data)
    console.log("id ----------->", data.id)
    getLoginLogoutLogsDetails(data, openedId.current, value, startDate, endDate)
  }

  return (
    <>
      <div className="app-page page-dashboard">
        <DeleteModal
          isShow={showDeleteModal}
          close={() => {
            setDeleteModal(false);
            setEditData("");
          }}
          onDelete={() => {
            onDelete();
          }}
        />
        <div className="d-flex justify-content-between align-items-center ">
          <PageTitle title="Login Logout Logs" backArrow={false} />
        </div>

        <Card className="table-card">
          {permission && permission?.isRead && (
            <Grid
              rows={rows}
              headers={headers}
              ShowLoader={ShowLoader}
              showSearch={true}
              count={totalCount}
              showDateFilter={true}
              onPageChange={onPageChange}
              errorMessage={"No Customer Group Found"}
            />
          )}
        </Card>
      </div>

      <Modal
        size="lg"
        show={showSummaryModal}
        onHide={handleSummaryClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Task Summary - {openedName.current}({HelperService.getFormattedDatebyText(openedDate.current)})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              maxHeight: "60vh", 
              overflowY: "auto", 
              padding: "10px",
            }}
          >
            {openedDescription && openedDescription.current
              ? openedDescription.current
                .split("@@@@@")
                .map((day, dayIndex) => (
                  <div key={dayIndex} style={{ marginBottom: "1em" }}>
                    <strong>Logout {dayIndex + 1}</strong>
                    <div>
                      {day
                        .split("\n")
                        .map((line, lineIndex) => (
                          <React.Fragment key={lineIndex}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      <hr />
                    </div>
                  </div>
                ))
              : "No description available"}
          </div>
        </Modal.Body>

      </Modal>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Day History - {openedName.current}({HelperService.getFormattedDatebyText(openedDate.current)})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {permission && permission?.isRead && (
              <Grid
                rows={detailsRows}
                headers={detailsHeaders}
                ShowLoader={ShowLoader}
                showSearch={false}
                count={detailsTotalCount}
                onPageChange={onDetailsPageChange}
                errorMessage={"No Customer Group Found"}
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default LoginLogoutLogs;
