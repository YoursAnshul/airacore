import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Card, Form, Button, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import PageTitle from "../../components/Common/PageTitle";
import { Controller, useForm } from "react-hook-form";

import { Label } from "../../components/Common/Label/Label";
import WebService from "../../Services/WebService";
import { toast } from "react-toastify";
import Grid, {
  GridColumn,
  GridHeader,
  GridRow,
} from "../../components/Grid/Grid";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import DeleteModal from "../../components/Common/DeleteModal/DeleteModal";
import { MdLockReset } from "react-icons/md";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import HelperService from "../../Services/HelperService";
import SetPassword from "../../components/ChangePassword/changePassword";
import { useSelector } from "react-redux";
import { RootState } from "../../config/Store";
import { reduxState } from "../../reducer/CommonReducer";
import ShancoSelect from "../../components/Common/Select/ShancoSelect";

const headers: GridHeader[] = [
  {
    title: "Sr. No.",
    class: "text-center",
  },
  {
    title: "Date",
    class: "text-center",
  },
  {
    title: "Name",
    class: "text-center",
  },
  {
    title: "Email Id",
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

const AdminUserManagement = () => {
  const pageCount = useRef<number>(0);
  const navigate = useNavigate();
  const passwordRegex =
    /^^(?=.*[A-Za-z0-9])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
  const userInfoData: any = useSelector<RootState, any>(
    (state: any) => state.userInfoData
  );
  const RolePermission: any = useSelector<RootState, reduxState>(
    (state: any) => state.RolePermission
  );
  const [showAddUser, setShowAddUser] = useState(false);
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
  const watchAllFields = watch();
  const [userID, setUserID] = useState<any>();
  const [rows, setRows] = useState<GridRow[]>([]);
  const [ShowLoader, setShowLoader] = useState(false);
  const rowCompute = useRef<GridRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editData, setEditData] = useState<any>();
  const [showDeleteModal, setDeleteModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [passwordModel, setPasswordModel] = useState<boolean>(false);
  const [permission, setPermission] = useState<any>();
  const permissionCompute: any = useRef<any>(null);
  const [isloginUserId, setloginUserId] = useState<any>();
  const [loginUserAccess, setLoginUserAccess] = useState<any>();
  const [isAllRoleList, setAllRoleList] = useState<any>();
  const [allUserList, setAllUserList] = useState<any>();
  const [twoLevelLeaveApproveOptions, setTwoLevelLeaveApproveOptions] = useState<any[]>([{id: "YES", value: "Yes"}, {id: "NO", value: "No"}]);
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [ adminId, setAdminId ] = useState(0);

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
          navigate("/dashboard");
        }
      }
    }
  }, [RolePermission]);

  useEffect(() => {
    getCustomers(1);
    getAllRoleList();
    getAllUserList();
    if (
      userInfoData &&
      userInfoData?.user_info &&
      !HelperService.isEmptyObject(userInfoData?.user_info)
    ) {
      setloginUserId(userInfoData.user_info.id);
    }
  }, []);

  const handleCloseAddUser = () => {
    reset({});
    setEditData("");
    setShowAddUser(false);
  };

  const onChangePassword = (data: any) => {
    setEditData(data);
    setPasswordModel(true);
  };

  const handleCloseChangePassword = () => {
    setPasswordModel(false);
  };

  const handleShowAddUser = () => {
    getAllUserList();
    reset({});
    setEditData("");
    setShowAddUser(true);
    setShowPassword(true);
  };

  const getAllRoleList = () => {
    WebService.getAPI({
      action: `api/user/roles`,
    })
      .then((res: any) => {
        let temp: any[] = [];
        for (var i in res) {
          temp.push({ id: res[i].id, value: res[i].name });
          if(res[i].name == "ADMIN"){
            setAdminId(res[i].id);
          }
        }
        setAllRoleList(temp);
      })
      .catch(() => { });
  };

  const getAllUserList = () => {
    WebService.getAPI({
      action: `api/user/users-dropdown`,
    })
      .then((res: any) => {
        let temp: any[] = [];
        for (var i in res) {
          temp.push({ id: res[i].id, value: res[i].userName });
        }
        setAllUserList(temp);
      })
      .catch(() => { });
  };

  const addUser = (data: any) => {
    if (data.id) {
      var { createdDate, ...dataToUpdate } = data;
      if(adminId == data.role){
        const { reporting_manager, ...updatedData } = dataToUpdate;
        dataToUpdate = updatedData;
      }
      WebService.putAPI({
        action: "api/user/update/user/" + data.id,
        body: dataToUpdate,
        id: "add_country",
      })
        .then((res: any) => {
          reset({});
          setShowAddUser(false);
          getCustomers(page);
          toast.success("User Updated Successfully");
        })
        .catch(() => {
          toast.error("User Updatation Failed try again.");
        });
    } else {
      if(adminId == data.role){
        const { reporting_manager, ...updatedData } = data;
        data = updatedData;
      }
      WebService.postAPI({ action: "api/auth/signup", body: data, id: "add_country" })
        .then((res: any) => {
          reset({});
          setShowAddUser(false);
          getCustomers(1);
          toast.success("User Created Successfully");
        })
        .catch(() => {
        });
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
      action: `api/user/users/${page}?keyword=${keyword ? keyword : ""
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
              res.list[i].createdDate &&
              HelperService.getFormattedDatebyText(res.list[i].createdDate),
          });

          columns.push({ value: fullName ? fullName : "N/A" });
          // columns.push({ value: res.list[i].firstName ? res.list[i].firstName : "N/A" });
          columns.push({
            value: res.list[i].email ? res.list[i].email : "N/A",
          });
          columns.push({
            value: statusList(
              res.list[i].status ? res.list[i].status : "N/A"
            ),
          });
          columns.push({
            value: actionList(Number(i), "ACTION", res.list[i]),
            type: "COMPONENT",
          });

          if (res.list[i].id === isloginUserId) {
            setLoginUserAccess(true);
          }

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

  const statusList = (status: string) => {
    if (status === "ACTIVE") {
      return (
        <span className="badge bg-success-subtle text-success">Active</span>
      );
    } else if (status === "offline") {
      return (
        <span className="badge bg-warning-subtle text-secondary">Offline</span>
      );
    } else {
      return (
        <span className="badge bg-secondary-subtle text-secondary">
          {status}
        </span>
      );
    }
  };

  const onEdit = (val: any) => {
    reset(val);
    setEditData(val);
    setShowPassword(false);
    setShowAddUser(true);
  };

  const onConfirmDelete = (val: any) => {
    setEditData(val);
    setDeleteModal(true);
  };

  const onDelete = () => {
    setDeleteModal(false);
    setShowLoader(true);
    WebService.deleteAPI({
      action: `api/user/delete/user/${editData?.id}`,
      body: null,
    })
      .then((res: any) => {
        setShowLoader(false);
        toast.success(res.message);
        setEditData("");
        getCustomers(page);
      })
      .catch((e) => {
        setShowLoader(false);
        setEditData("");
      });
  };

  const actionList = (value: number, type: string, data: any) => {
    const isCurrentUser = data.id === isloginUserId;
    return (
      <div className="action-btns">
        <button
          type="button"
          disabled={isCurrentUser || !permission?.isUpdate}
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
          disabled={isCurrentUser || !permission?.isDelete}
          className="btn btn-delete"
          onClick={() => onConfirmDelete(data)}
          data-toggle="tooltip"
          data-placement="top"
          title="Delete"
        >
          <FaRegTrashAlt className="icon" />
        </button>

        <button
          type="button"
          disabled={isCurrentUser || !permission?.isUpdate}
          className="btn btn-pass"
          onClick={() => onChangePassword(data)}
          data-toggle="tooltip"
          data-placement="top"
          title="Change Password"
        >
          <MdLockReset />
        </button>
      </div>
    );
  };

  const onPageChange = (data: any, value: string, startDate: any, endDate: any) => {
    setPage(data);
    getCustomers(data, value, startDate, endDate);
  };

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
          <PageTitle title="Admin User Management" backArrow={false} />
          <Button
            disabled={!permission?.isCreate}
            className="btn-brand-1 mb-3"
            onClick={handleShowAddUser}
          >
            + Add User
          </Button>
        </div>

        <Card className="table-card">
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

          {/* <div className="table-wrap">
                        <table className="table table-style-1">
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Email ID</th>
                                    <th>User ID</th>
                                    <th>status</th>
                                    <th className="action-col">Action</th>
                                </tr>
                            </thead>
                        </table>
                    </div> */}
        </Card>

        <SetPassword
          isShow={passwordModel}
          isClose={handleCloseChangePassword}
          adminID={editData?.id}
        />
      </div>

      {/* Add User  */}
      <Offcanvas show={showAddUser} onHide={handleCloseAddUser} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {editData ? "Edit" : "Add"} Admin User
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="form-style">
          <form className="mb-3" onSubmit={handleSubmit(addUser)}>
            <label className="mt-2">First name</label>
            <div className="input-group mb-1 mt-2">
              <input
                type="text"
                className="form-control ps-3 p-2"
                placeholder="First Name"
                {...register("firstName", { required: true })}
              />
            </div>
            {errors.firstName && (
              <div className="login-error">
                <Label title={"First name required"} modeError={true} />
              </div>
            )}

            <label className="mt-3">Last name</label>
            <div className="input-group mb-1 mt-2">
              <input
                type="text"
                className="form-control ps-3 p-2"
                placeholder="Last Name"
                {...register("lastName", { required: true })}
              />
            </div>
            {errors.lastName && (
              <div className="login-error">
                <Label title={"Last name required"} modeError={true} />
              </div>
            )}

            <label className="mt-3">Mobile Number</label>
            <div className="input-group mb-1 mt-2">
              <input
                type="text"
                className="form-control ps-3 p-2"
                placeholder="Mobile Number"
                onKeyPress={HelperService.mobileNumberValidation}
                {...register("mobileNumber", { required: true })}
              />
            </div>
            {errors.mobileNumber && (
              <div className="login-error">
                <Label title={"Mobile Number required"} modeError={true} />
              </div>
            )}

            {/* <label className="mt-3">Email Id</label>
                        <div className="input-group mb-1 mt-2">
                            <input type="text" className="form-control  ps-3 p-2" placeholder="Email" {...register("email", { required: true })} />
                        </div>
                       
                        {
                            errors.email &&
                            <div className="login-error">
                                <Label
                                    title={"Email required"}
                                    modeError={true}
                                />
                            </div>
                        } */}

            <label className="mt-3">Email</label>
            <Form.Control
              type="email"
              placeholder="Email"
              {...register("email", {
                required: true,
                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              })}
            />
            {errors.email?.type == "required" && (
              <Label title="Please enter email" modeError={true} />
            )}
            {errors.email?.type == "pattern" && (
              <Label title="Please enter valid email" modeError={true} />
            )}

            {showPassword && (
              // <>
              //   <label className="mt-3">Password</label>
              //   <div className="input-group mb-1 mt-2">
              //     <input
              //       type="password"
              //       className="form-control ps-3 p-2"
              //       placeholder="Password"
              //       {...register("password", { required: true })}
              //     />
              //   </div>
              //   {errors.password && (
              //     <div className="login-error">
              //       <Label title={"Password required"} modeError={true} />
              //     </div>
              //   )}
              // </>
              <Col lg={12} className="mb-3 mt-3">
                {/* Password */}
                <Form.Label> Password</Form.Label>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "Please Enter Password",
                    pattern: {
                      value: passwordRegex,
                      message:
                        "Between 8 to 20 characters and at least one upper case, lower case, number and special character.",
                    },
                  }}
                  render={({
                    field: { onChange, onBlur },
                    fieldState: { isTouched },
                  }) => (
                    <div className="form-group mb-2">
                      <div className="input-group mb-2">
                        <input
                          type={isShowNewPassword ? "text" : "password"}
                          className="form-control border-end-0 "
                          placeholder="Password"
                          onChange={onChange}
                          onBlur={onBlur}
                        />
                        <span
                          className="input-group-text text-secondary bg-white border-start-0 cursor-pointer"
                          onClick={() =>
                            setIsShowNewPassword(!isShowNewPassword)
                          }
                        >
                          {isShowNewPassword ? (
                            <BsEyeSlash size={16} />
                          ) : (
                            <BsEye size={16} />
                          )}
                        </span>
                      </div>
                      {(errors["password"]?.message ||
                        Boolean(errors["password"]?.message) ||
                        (isTouched && !watchAllFields.password) ||
                        (watchAllFields.password &&
                          !passwordRegex.test(watchAllFields.password))) && (
                          <div className="login-error">
                            <Label
                              title={
                                errors.password?.message ||
                                  watchAllFields.password
                                  ? "Between 8 to 20 characters and at least one upper case, lower case, number and special character."
                                  : "Please Enter Password."
                              }
                              modeError={true}
                            />
                          </div>
                        )}
                    </div>
                  )}
                />
              </Col>
            )}

            <Col lg={12}>
              <Controller
                control={control}
                name="role"
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Form.Group className="mb-1 mt-3">
                    <Form.Label>Role Options</Form.Label>
                    <Form.Control
                      as="select"
                      {...field}
                      className="form-select"
                    >
                      <option value="">Select Role</option>
                      {isAllRoleList.map((role: { id: number; value: string }) => (
                        <option key={role.id} value={role.id}>
                          {role.value}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}
              />
              {errors.role && (
                <div className="login-error mt-2">
                  <Label title={"Please Select Role."} modeError={true} />
                </div>
              )}
            </Col>

            <Col lg={12}>
              <Controller
                control={control}
                name="twoLevelLeaveApprove"
                rules={{
                  required: false,
                }}
                render={({ field }) => (
                  <Form.Group className="mb-1 mt-3">
                    <Form.Label>Two Level Leave Varification</Form.Label>
                    <Form.Control
                      as="select"
                      {...field}
                      className="form-select"
                    >
                      <option value="">Select Two Level Leave Varification</option>
                      {twoLevelLeaveApproveOptions.map((role: { id: string; value: string }) => (
                        <option key={role.id} value={role.id}>
                          {role.value}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}
              />
            </Col>

            <Col lg={12}>
            {watchAllFields.role != adminId && (
              <Controller
                control={control}
                name="reporting_manager"
                rules={{
                  required: false,
                }}
                render={({ field }) => (
                  <Form.Group className="mb-1 mt-3">
                    <Form.Label>Reporting Manager</Form.Label>
                    <Form.Control
                      as="select"
                      {...field}
                      className="form-select"
                    >
                      <option value="">Select Reporting Manager</option> {/* Default placeholder */}
                      {allUserList.map((role: { id: number; value: string }) => (
                        <option key={role.id} value={role.id}>
                          {role.value}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}
              />
            )}
            </Col>

            <Button
              id="add_country"
              className="btn-brand-1 w-100 mt-4"
              type="submit"
            >
              Save
            </Button>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
export default AdminUserManagement;
