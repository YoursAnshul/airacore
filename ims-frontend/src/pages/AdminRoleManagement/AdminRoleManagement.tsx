import React, { useEffect, useRef, useState, Dispatch } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/Common/PageTitle";
import Grid, {
  GridColumn,
  GridHeader,
  GridRow,
} from "../../components/Grid/Grid";
import WebService from "../../Services/WebService";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import DeleteModal from "../../components/Common/DeleteModal/DeleteModal";
import { ADD_ROLE_DATA, setDataInRedux } from "../../action/CommonAction";
import { RootState } from "../../config/Store";
import { reduxState } from "../../reducer/CommonReducer";
import HelperService from "../../Services/HelperService";
import { Button, Card } from "react-bootstrap";

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
    title: "Status",
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

const AdminRoleManagement = () => {
  const permissionCompute: any = useRef<any>(null);
  const pageCount = useRef<number>(0);
  const rowCompute = useRef<GridRow[]>([]);
  const navigate = useNavigate();
  const dispatch: Dispatch<any> = useDispatch();
  const [rows, setRows] = useState<GridRow[]>([]);
  const [ShowLoader, setShowLoader] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [editData, setEditData] = useState<any>();
  const [showDeleteModal, setDeleteModal] = useState<boolean>(false);
  const [permission, setPermission] = useState<any>();
  const [isloginUserId, setloginUserId] = useState<any>();
  const userInfoData: any = useSelector<RootState, any>(
    (state: any) => state.userInfoData
  );
  const RolePermission: any = useSelector<RootState, reduxState>(
    (state: any) => state.RolePermission
  );
  const [page, setPage] = useState(1)


  useEffect(() => {
    getAdminRole(1);
  }, []);

  useEffect(() => {
    if (
      userInfoData &&
      userInfoData?.user_info &&
      !HelperService.isEmptyObject(userInfoData?.user_info)
    ) {
      setloginUserId(userInfoData.user_info.id);
    }
  }, []);

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
        console.log(RolePermission);
        const data = RolePermission?.rolePermission?.menus.find(
          (item: any) => item.name == "Admin Role Management"
        );
        if (data && data.isRead) {
          setPermission(data);
          permissionCompute.current = data;
        } else {
          navigate("/dashboard");
        }
      }
    }
  }, [RolePermission]);

  const getAdminRole = (
    page: number,
    keyword?: string,
    startDate?: Date,
    endDate?: Date
  ) => {
    pageCount.current = page;
    setShowLoader(true);
    WebService.getAPI({
      action: `api/user/roles/${page}?keyword=${keyword ? keyword : ""}&date_from=${
        startDate ? startDate : ""
      }&date_to=${endDate ? endDate : ""}`,
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
          let columns: GridColumn[] = [];
          columns.push({ value: `${startCount++}` });
          columns.push({ value: res.list[i].name ? res.list[i].name : "N/A" });
          columns.push({
            value: statusList(res.list[i].status ? res.list[i].status : "N/A"),
          });
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
  };

  const onEdit = (val: any) => {  
    dispatch(setDataInRedux({ type: ADD_ROLE_DATA, value: val }));
    setTimeout(() => {
      console.log("role data --> ", val);
      navigate("/add-role");
    }, 100);
  };

  const onConfirmDelete = (val: any) => {
    setEditData(val);
    setDeleteModal(true);
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
        getAdminRole(page);
      })
      .catch((e) => {
        setShowLoader(false);
        setEditData("");
      });
  };

  const actionList = (data: any) => {
    const isCurrentUser = data.id == isloginUserId;
    return (
      <div className="action-btns">
        <button
          disabled={ isCurrentUser || !permission?.isUpdate}
          onClick={() => onEdit(data)}
          className="btn btn-edit"
          data-toggle="tooltip" data-placement="top" title="Edit"
        >
          <MdOutlineModeEditOutline className="icon" />
        </button>
        <button
          disabled={isCurrentUser || !permission?.isDelete}
          className="btn btn-delete"
          onClick={() => onConfirmDelete(data)}
          data-toggle="tooltip" data-placement="top" title="Delete"

        >
          <FaRegTrashAlt className="icon" />
        </button>
      </div>
    );
  };

  const statusList = (status: string) => {
    if (status === "ACTIVE") {
      return (
        <span className="badge bg-success-subtle text-success">Active</span>
      );
    } else if (status === "PENDING") {
      return (
        <span className="badge bg-warning-subtle text-warning">Pending</span>
      );
    } else {
      return (
        <span className="badge bg-secondary-subtle text-secondary">
          {status}
        </span>
      );
    }
  };


  const onPageChange = (data: any, value: string,startDate:any, endDate:any) => {
    setPage(data)
    getAdminRole(data, value,startDate, endDate)
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
          <PageTitle title="Admin Role Management" backArrow={false} />
          <Button
            disabled={!permission?.isCreate}
            onClick={() => navigate("/add-role")}
            className="btn-brand-1 mb-3"
          >
            + Add Role
          </Button>
        </div>

        <Card className="table-card">
    
          {permission && permission?.isRead && (
            <Grid
              rows={rows}
              headers={headers}
              ShowLoader={ShowLoader}
              showSearch={true}
              count={totalCount}
              onPageChange={onPageChange}
              errorMessage={"No Customer Group Found"}
            />
          )}
        </Card>
      </div>
    </>
  );
};
export default AdminRoleManagement;
