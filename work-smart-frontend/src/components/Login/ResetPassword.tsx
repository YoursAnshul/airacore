import { useEffect, useState } from "react";
import Logo from "../../assets/images/shan_and_co_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Button, Col, Form, Row } from "react-bootstrap";
import "./login.scss";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../Common/Label/Label";
import WebService from "../../Services/WebService";
import { toast } from "react-toastify";
import { Dispatch } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { SET_SIGNUP_DATA, setDataInRedux } from "../../action/CommonAction";
import { RootState } from "../../config/Store";
import { reduxState } from "../../reducer/CommonReducer";
import HelperService from "../../Services/HelperService";

const ResetPassword = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    getValues,
    register,
  } = useForm<any>({});
  const watchAllFields = watch();
  const navigate = useNavigate();
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex =
    /^^(?=.*[A-Za-z0-9])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
  const mobileRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  const nameRegex = /^[A-Za-z][A-Za-z_ ]{2,30}$/;
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPassword1, setShowPassword1] = useState<boolean>(false);
  const commonData: any = useSelector<RootState, reduxState>((state: any) => state.commonData);
  const [email,setEmail] =useState<any>("");
  const [otp,setOtp] =useState<any>("");


  useEffect(() => {
    if (commonData && commonData?.forget_pass && !HelperService.isEmptyObject(commonData?.forget_pass)) {
        setEmail(commonData?.forget_pass.email)
        setOtp(commonData?.forget_pass.otp)

    } else {
      navigate("/login")
    }
  }, [])

  const onReset = (data:any) => {

    var obj = {
        email: email,
        otp: otp,
        password:data.comfirmpassword
      };
    WebService.postAPI({
      action: "reset/password",
      body: obj,
      id: "reset-btn",
    })
      .then((res: any) => {
        toast.success(res?.message);
        navigate("/login");
      })
      .catch((e) => {});
  };

  return (
    <>
      <div className="login-page">
        <div className="row justify-content-center min-vh-100 align-items-center mx-0">
          <div className="col-lg-5 d-flex align-items-center justify-content-center">
            <div className="w-100 login-card rounded-4">
              <form onSubmit={handleSubmit(onReset)}>
                <div className="px-lg-5 px-3 py-4">
                  <div className="mb-4 text-center">
                    <img src={Logo} width="186" height={30} alt="Logo" />
                  </div>
                  <div className=" ">
                    <h1 className="text-light mb-4 font-bold text-center h3">
                      Reset Password?
                    </h1>

                    <Row className="mb-2 text-center">
                      {/* <Col lg={12}>
                        <h4 className="text-light mb-3">Account Credentials</h4>
                      </Col> */}

                      <Col lg={12} className="mb-3 " >
                        {/* Password */}
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
                                  type={showPassword ? "text" : "password"}
                                  className="form-control border-end-0 border-start-0"
                                  placeholder="Password"
                                  onChange={onChange}
                                  onBlur={onBlur}
                                />
                                <span
                                  className="input-group-text text-secondary bg-white border-start-0 cursor-pointer"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
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
                                  !passwordRegex.test(
                                    watchAllFields.password
                                  ))) && (
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
                      <Col lg={12} className="mb-2">
                        {/* Confirm Password */}
                        <Controller
                          control={control}
                          name="comfirmpassword"
                          rules={{
                            required: "Please Enter Password",
                            validate: (value: any) => {
                              const { password } = getValues();
                              return (
                                password === value || "Passwords must match"
                              );
                            },
                          }}
                          render={({
                            field: { onChange, onBlur },
                            fieldState: { isTouched },
                          }) => (
                            <div className="mb-3">
                              <div className="input-group mb-2">
                                <input
                                  type={showPassword1 ? "text" : "password"}
                                  className="form-control border-end-0 border-start-0"
                                  placeholder="Confirm Password"
                                  onChange={onChange}
                                  onBlur={onBlur}
                                />
                                <span
                                  className="input-group-text text-secondary bg-white border-start-0 cursor-pointer"
                                  onClick={() =>
                                    setShowPassword1(!showPassword1)
                                  }
                                >
                                  {showPassword1 ? (
                                    <BsEyeSlash size={16} />
                                  ) : (
                                    <BsEye size={16} />
                                  )}
                                </span>
                              </div>
                              {(errors["comfirmpassword"]?.message ||
                                Boolean(errors["comfirmpassword"]?.message) ||
                                (isTouched &&
                                  !watchAllFields.comfirmpassword) ||
                                (watchAllFields.comfirmpassword &&
                                  watchAllFields.password !=
                                    watchAllFields.comfirmpassword)) && (
                                <div className="login-error">
                                  <Label
                                    title={
                                      errors.comfirmpassword?.message ||
                                      watchAllFields.comfirmpassword
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
                    </Row>

                 
                  
                  </div>
                  <div className="text-center ">
                    <Button
                      type="submit"
                      id="reset-btn"
                      className="btn btn-brand-1 w-100 mb-2"
                      disabled={!isValid }
                    >
                      Reset Password
                    </Button>
                    {/* <p className="text-white mt-3 mb-0">
                      Back to{" "}
                      <Link to="/login" className="text-brand">
                        login
                      </Link>
                    </p> */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ResetPassword;



