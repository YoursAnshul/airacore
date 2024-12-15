import React, { Dispatch, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,

} from "react-bootstrap";
import {  useNavigate } from "react-router-dom";
import PageTitle from "../../components/Common/PageTitle";
import { useForm } from "react-hook-form";
import { Label } from "../../components/Common/Label/Label";
import { toast } from "react-toastify";
import WebService from "../../Services/WebService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../config/Store";
import { reduxState } from "../../reducer/CommonReducer";
import HelperService from "../../Services/HelperService";
import { ADD_ROLE_DATA, setDataInRedux } from "../../action/CommonAction";

const listData: any[] = [
  {
    name: "Dashboard",
    isRead: false,
    isUpdate: false,
    isDelete: false,
    isCreate: false,
  },
  {
    name: "Admin User Management",
    isRead: false,
    isUpdate: false,
    isDelete: false,
    isCreate: false,
  },
  {
    name: "Admin Role Management",
    isRead: false,
    isUpdate: false,
    isDelete: false,
    isCreate: false,
  },
  {
    name: "Login Logout Logs",
    isRead: false,
    isUpdate: false,
    isDelete: false,
    isCreate: false,
  },
  {
    name: "Admin Leave Management",
    isRead: false,
    isUpdate: false,
    isDelete: false,
    isCreate: false,
  }
];

const AddRole = () => {
  const commonData: any = useSelector<RootState, reduxState>(
    (state: any) => state.commonData
  );
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    register,
    reset,
  } = useForm<any>({});
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<any[]>(listData);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const dispatch: Dispatch<any> = useDispatch();

    useEffect(() => {
    if (
      commonData &&
      commonData?.role &&
      !HelperService.isEmptyObject(commonData?.role)
    ) {
      console.log("commonData--->", commonData.role.id);
      onRoleDetails(commonData.role.id)
      // reset(commonData?.role);
     
      dispatch(setDataInRedux({ type: ADD_ROLE_DATA, value: {} }));
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, []);

  const onRoleDetails = (id: any) => {
    WebService.getAPI({
      action: `api/user/roles/${id}/details`
    })
      .then((res: any) => {
        reset(res); // Assuming this resets your form or UI with the role details
  
        const updatedTableData = listData.map((item) => {
          // Find the matching menu from the response
          const matchedMenu = res?.menus?.find(
            (menu: any) => menu.name === item.name
          );
  
          // Update the menu data if a match is found; otherwise, keep the default
          return matchedMenu
            ? {
                ...item,
                isCreate: matchedMenu.isCreate,
                isRead: matchedMenu.isRead,
                isUpdate: matchedMenu.isUpdate,
                isDelete: matchedMenu.isDelete,
                status: matchedMenu.status,
                createdAt: matchedMenu.createdAt,
                updatedAt: matchedMenu.updatedAt,
              }
            : item;
        });
  
        // Update the table with the merged data
        setTableData(updatedTableData);
      })
      .catch(() => {
        // Handle any errors if needed
      });
  };
  

  // const onChangeField = (id: number, type: string) => {
  //   setTableData(
  //     tableData.map((item: any, i: number) => {
  //       if (i == id) {
  //         if (type == "create") {
  //           item.isCreate = !item.isCreate;
  //           return { ...item };
  //         } else if (type == "read") {
  //           item.isRead = !item.isRead;
  //           return { ...item };
  //         } else if (type == "update") {
  //           item.isUpdate = !item.isUpdate;
  //           return { ...item };
  //         } else if (type == "delete") {
  //           item.isDelete = !item.isDelete;
  //           return { ...item };
  //         }
  //       } else {
  //         return { ...item };
  //       }
  //     })
  //   );
  // };

  const onChangeField = (id: number, type: string) => {
    setTableData(
      tableData.map((item: any, i: number) => {
        if (i === id) {
          if (type === "create") {
            const updatedItem = {
              ...item,
              isCreate: !item.isCreate,
              isRead: !item.isCreate, // Automatically set "Read" based on "Create"
            };
            return updatedItem;
          } else if (type === "read") {
            item.isRead = !item.isRead;
            return { ...item };
          } else if (type === "update") {
            item.isUpdate = !item.isUpdate;
            return { ...item };
          } else if (type === "delete") {
            item.isDelete = !item.isDelete;
            return { ...item };
          }
        } else {
          return { ...item };
        }
      })
    );
  };
  
  const onSave = (data: any) => {
    const requestBody = { ...data, ...{ menus: tableData } };
    WebService[data.id ? "putAPI" : "postAPI"]({
      action: `api/user/role/add${data.id ? "/" + data.id : ""}`,
      body: requestBody,
      id: "onsave",
    })
      .then((res: any) => {
        navigate("/role-management");
        toast.success(res.message || "Role Created Successfully");
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };


  
const checkAllCheckboxes = () => {
  const allChecked = tableData.every(item => 
    item.isCreate && item.isRead && item.isUpdate && item.isDelete
  );

  const updatedTableData = tableData.map(item => ({
    ...item,
    isCreate: !allChecked,
    isRead: !allChecked,
    isUpdate: !allChecked,
    isDelete: !allChecked,
  }));

  setTableData(updatedTableData);
};

  return (
    <>
      <div className="app-page page-dashboard">
        <div className="d-flex justify-content-between align-items-center ">
          <PageTitle
            title={isEdit ? "Edit Role" : "Add Role"}
            backArrow={true}
          />
        </div>

        <Card className="table-card">
          <form onSubmit={handleSubmit(onSave)}>
            <Row className="mb-3">
              <Col lg={3} className="d-flex gap-3 align-items-center">
                <label className=" text-nowrap">Role Name</label>
                <div>
                  <input
                    type="text"
                    className=" form-control"
                    value={watch().name}
                    {...register("name", { required: true })}
                  />
                  {errors.name && (
                    <div className="login-error">
                      <Label title={"Role name required"} modeError={true} />
                    </div>
                  )}
                </div>
              </Col>

              <Col lg={9} className="d-flex justify-content-end gap-3">
                <Button
                  className="btn-brand-1"
                  type="button"
                  onClick={checkAllCheckboxes}
                >
                  Check All
                </Button>
                

                <Button className="btn-brand-1" type="submit" id="onsave"
                >
                  Save
                </Button>
                <Button
                  className="btn-outline-brand"
                  type="button"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </form>
          <div className="table-wrap">
            <table className="table table-style-1">
              <thead>
                <tr>
                  <th className="action-col">Menu</th>
                  <th className="action-col">Create</th>
                  <th className="action-col">Read</th>
                  <th className="action-col">Update</th>
                  <th className="action-col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item: any, i: number) => {
                  return (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>
                        <Form.Check
                          className="d-flex justify-content-center"
                          type="checkbox"
                          checked={item.isCreate}
                          onChange={() => onChangeField(i, "create")}
                          id="create"
                        />
                      </td>
                      <td>
                        <Form.Check
                          className="d-flex justify-content-center"
                          type="checkbox"
                          checked={item.isRead}
                          onChange={() => onChangeField(i, "read")}
                          id="Read"
                        />
                      </td>
                      <td>
                        <Form.Check
                          className="d-flex justify-content-center"
                          type="checkbox"
                          checked={item.isUpdate}
                          onChange={() => onChangeField(i, "update")}
                          id="Update"
                        />
                      </td>
                      <td>
                        <Form.Check
                          className="d-flex justify-content-center"
                          type="checkbox"
                          checked={item.isDelete}
                          onChange={() => onChangeField(i, "delete")}
                          id="Delete"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};
export default AddRole;
