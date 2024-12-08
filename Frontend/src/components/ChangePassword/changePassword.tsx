import {
  Modal,
  Button,
  Form,
  InputGroup,
  Col,
  Offcanvas,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import WebService from "../../Services/WebService";
import { Label } from "../Common/Label/Label";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../config/Store";
import { reduxState } from "../../reducer/CommonReducer";
import HelperService from "../../Services/HelperService";

interface PropData {
  isShow: boolean;
  isClose: Function;
  adminID?: any;
}

const SetPassword = (props: PropData) => {

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    getValues,
    register,
    reset,
  } = useForm<any>({});
  const watchAllFields = watch();
  const passwordRegex =
    /^^(?=.*[A-Za-z0-9])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
  const [isShowCurrentPassword, setIsShowCurrentPassword] =
    useState<boolean>(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const [userID, setUserID] = useState<any>();
  const commonData: any = useSelector<RootState, reduxState>(
    (state: any) => state.userInfoData
  );

  useEffect(() => {
    if (commonData &&
      commonData?.user_info &&
      !HelperService.isEmptyObject(commonData?.user_info)
    ) {
      setUserID(commonData?.user_info?.id);
    }
  }, []);



  const handlePasswordChange = (data: any) => {
    if (props.adminID) {
      var id = props.adminID;
    } else {
      console.log("commonData------->", commonData);
      var id = commonData?.user_info?.id;
    }
    
    var obj = {
      user_id: id,
      old_password: data.curret_password,
      password: data.comfirm_password,
    };
    WebService.postAPI({
      action: `api/user/update/password`,
      body: obj,
      id: "changePassword-btn",
    })
      .then((res: any) => {
        toast.success(res.message, { theme: "colored" });
        closeModal();
      })
      .catch(() => {});
  };

  const closeModal = () => {
    reset();
    props.isClose();
  };


  const hideShowCurrentPassword = () => {
    setIsShowCurrentPassword(isShowCurrentPassword ? false : true);
  };

  const hideShowNewPassword = () => {
    setIsShowNewPassword(isShowNewPassword ? false : true);
  };

  const hideShowConfirmPassword = () => {
    setIsShowConfirmPassword(isShowConfirmPassword ? false : true);
  };

  return (
    <>
      <Offcanvas show={props.isShow} onHide={props.isClose} placement="end">
        {/* <Offcanvas show={passwordModel} onHide={handleCloseChangePassword} placement="end"> */}

        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {props.adminID ? "Change Password" : "Change Password"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="form-style">
          <form
            className="form-style"
            onSubmit={handleSubmit(handlePasswordChange)}
          >
            <Col lg={12} className="mb-3">
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
                        onClick={() => setIsShowNewPassword(!isShowNewPassword)}
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
                            errors.password?.message || watchAllFields.password
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

            <Col lg={12} className="mb-2 me-4">
              {/* Confirm Password */}
              <Form.Label>Confirm Password</Form.Label>

              <Controller
                control={control}
                name="comfirm_password"
                rules={{
                  required: "Please Enter Password",
                  validate: (value: any) => {
                    const { password } = getValues();
                    return password === value || "Passwords must match";
                  },
                }}
                render={({
                  field: { onChange, onBlur },
                  fieldState: { isTouched },
                }) => (
                  <div className="mb-3">
                    <div className="input-group mb-2">
                      <input
                        type={isShowConfirmPassword ? "text" : "password"}
                        className="form-control border-end-0  "
                        placeholder="Confirm Password"
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                      <span
                        className="input-group-text text-secondary bg-white border-start-0 cursor-pointer"
                        onClick={() =>
                          setIsShowConfirmPassword(!isShowConfirmPassword)
                        }
                      >
                        {isShowConfirmPassword ? (
                          <BsEyeSlash size={16} />
                        ) : (
                          <BsEye size={16} />
                        )}
                      </span>
                    </div>
                    {(errors["comfirm_password"]?.message ||
                      Boolean(errors["comfirm_password"]?.message) ||
                      (isTouched && !watchAllFields.comfirm_password) ||
                      (watchAllFields.comfirm_password &&
                        watchAllFields.password !=
                          watchAllFields.comfirm_password)) && (
                      <div className="login-error">
                        <Label
                          title={
                            errors.comfirm_password?.message ||
                            watchAllFields.comfirm_password
                              ? "Passwords Must Match"
                              : "Please Enter Confirm Password."
                          }
                          modeError={true}
                        />
                      </div>
                    )}
                  </div>
                )}
              />
            </Col>
            <div className="text-center">
              <Button
                variant="dark"
                className="btn-brand-1 px-5 mt-3 mb-3"
                type="submit"
                id="changePassword-btn"
              >
                Change Password
              </Button>
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </>

    // <>
    //     {
    //         <Modal show={props.isShow} onHide={() => { closeModal() }} className="login-modal" centered  >
    //             <Modal.Header closeButton>
    //                 <Modal.Title className="font-18 font-semibold">Change Password</Modal.Title>
    //             </Modal.Header>
    //             <Modal.Body>
    //                 <form className="form-style" onSubmit={handleSubmit(onSubmit)}>

    //           <Col lg={12} className="mb-3" >
    //                 {/* Password */}
    //                 <Form.Label>Current Password</Form.Label>

    //                 <Controller
    //                   control={control}
    //                   name="curret_password"
    //                   rules={{
    //                     required: "Please Enter Current Password",
    //                     pattern: {
    //                       value: passwordRegex,
    //                       message:
    //                         "Between 8 to 20 characters and at least one upper case, lower case, number and special character.",
    //                     },
    //                   }}
    //                   render={({
    //                     field: { onChange, onBlur },
    //                     fieldState: { isTouched },
    //                   }) => (
    //                     <div className="form-group mb-2">
    //                       <div className="input-group mb-2">
    //                         <input
    //                           type={isShowCurrentPassword ? "text" : "password"}
    //                           className="form-control border-end-0 border-start-0"
    //                           placeholder="Current Password"
    //                           onChange={onChange}
    //                           onBlur={onBlur}
    //                         />
    //                         <span
    //                           className="input-group-text text-secondary bg-white border-start-0 cursor-pointer"
    //                           onClick={() => setIsShowCurrentPassword(!isShowCurrentPassword)}
    //                         >
    //                           {isShowCurrentPassword ? (
    //                             <BsEyeSlash size={16} />
    //                           ) : (
    //                             <BsEye size={16} />
    //                           )}
    //                         </span>
    //                       </div>
    //                       {(errors["curret_password"]?.message ||
    //                         Boolean(errors["curret_password"]?.message) ||
    //                         (isTouched && !watchAllFields.curret_password) ||
    //                         (watchAllFields.curret_password &&
    //                           !passwordRegex.test(
    //                             watchAllFields.curret_password
    //                           ))) && (
    //                         <div className="login-error">
    //                           <Label
    //                             title={
    //                               errors.curret_password?.message ||
    //                               watchAllFields.curret_password
    //                                 ? "Between 8 to 20 characters and at least one upper case, lower case, number and special character."
    //                                 : "Please Enter Password."
    //                             }
    //                             modeError={true}
    //                           />
    //                         </div>
    //                       )}
    //                     </div>
    //                   )}
    //                 />
    //               </Col>

    //                     <Col lg={12} className="mb-3 " >
    //                 {/* Password */}
    //                 <Form.Label> Password</Form.Label>

    //                 <Controller
    //                   control={control}
    //                   name="password"
    //                   rules={{
    //                     required: "Please Enter Password",
    //                     pattern: {
    //                       value: passwordRegex,
    //                       message:
    //                         "Between 8 to 20 characters and at least one upper case, lower case, number and special character.",
    //                     },
    //                   }}
    //                   render={({
    //                     field: { onChange, onBlur },
    //                     fieldState: { isTouched },
    //                   }) => (
    //                     <div className="form-group mb-2">
    //                       <div className="input-group mb-2">
    //                         <input
    //                           type={isShowNewPassword ? "text" : "password"}
    //                           className="form-control border-end-0 border-start-0"
    //                           placeholder="Password"
    //                           onChange={onChange}
    //                           onBlur={onBlur}
    //                         />
    //                         <span
    //                           className="input-group-text text-secondary bg-white border-start-0 cursor-pointer"
    //                           onClick={() => setIsShowNewPassword(!isShowNewPassword)}
    //                         >
    //                           {isShowNewPassword ? (
    //                             <BsEyeSlash size={16} />
    //                           ) : (
    //                             <BsEye size={16} />
    //                           )}
    //                         </span>
    //                       </div>
    //                       {(errors["password"]?.message ||
    //                         Boolean(errors["password"]?.message) ||
    //                         (isTouched && !watchAllFields.password) ||
    //                         (watchAllFields.password &&
    //                           !passwordRegex.test(
    //                             watchAllFields.password
    //                           ))) && (
    //                         <div className="login-error">
    //                           <Label
    //                             title={
    //                               errors.password?.message ||
    //                               watchAllFields.password
    //                                 ? "Between 8 to 20 characters and at least one upper case, lower case, number and special character."
    //                                 : "Please Enter Password."
    //                             }
    //                             modeError={true}
    //                           />
    //                         </div>
    //                       )}
    //                     </div>
    //                   )}
    //                 />
    //               </Col>

    //               <Col lg={12} className="mb-2 me-4">
    //                 {/* Confirm Password */}
    //                 <Form.Label>Confirm Password</Form.Label>

    //                 <Controller
    //                   control={control}
    //                   name="comfirm_password"
    //                   rules={{
    //                     required: "Please Enter Password",
    //                     validate: (value: any) => {
    //                       const { password } = getValues();
    //                       return (
    //                         password === value || "Passwords must match"
    //                       );
    //                     },
    //                   }}
    //                   render={({
    //                     field: { onChange, onBlur },
    //                     fieldState: { isTouched },
    //                   }) => (
    //                     <div className="mb-3">
    //                       <div className="input-group mb-2">
    //                         <input
    //                           type={isShowConfirmPassword ? "text" : "password"}
    //                           className="form-control border-end-0 border-start-0"
    //                           placeholder="Confirm Password"
    //                           onChange={onChange}
    //                           onBlur={onBlur}
    //                         />
    //                         <span
    //                           className="input-group-text text-secondary bg-white border-start-0 cursor-pointer"
    //                           onClick={() =>
    //                             setIsShowConfirmPassword(!isShowConfirmPassword)
    //                           }
    //                         >
    //                           {isShowConfirmPassword ? (
    //                             <BsEyeSlash size={16} />
    //                           ) : (
    //                             <BsEye size={16} />
    //                           )}
    //                         </span>
    //                       </div>
    //                       {(errors["comfirm_password"]?.message ||
    //                         Boolean(errors["comfirm_password"]?.message) ||
    //                         (isTouched &&
    //                           !watchAllFields.comfirm_password) ||
    //                         (watchAllFields.comfirm_password &&
    //                           watchAllFields.password !=
    //                             watchAllFields.comfirm_password)) && (
    //                         <div className="login-error">
    //                           <Label
    //                             title={
    //                               errors.comfirm_password?.message ||
    //                               watchAllFields.comfirm_password
    //                                 ? "Passwords Must Match"
    //                                 : "Please Enter Confirm Password."
    //                             }
    //                             modeError={true}
    //                           />
    //                         </div>
    //                       )}
    //                     </div>
    //                   )}
    //                 />
    //               </Col>
    //                     <div className='text-center'>
    //                         <Button
    //                             variant="dark"
    //                             className="btn-brand-1 px-5 mt-3 mb-3"
    //                             type="submit"
    //                             id=  "changePassword-btn"
    //                             >
    //                             Change Password
    //                         </Button>
    //                     </div>

    //                 </form>
    //             </Modal.Body>
    //         </Modal>
    //     }
    // </>
  );
};

export default SetPassword;
