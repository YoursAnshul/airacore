import { Dispatch, useEffect, useState } from "react";
import Logo from "../../assets/images/shan_and_co_logo.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { HiOutlineKey } from "react-icons/hi2";
import { Form, Button } from "react-bootstrap";
import OTPInput from "react-otp-input";
import { Label } from "../Common/Label/Label";

import "./login.scss";
import { Controller, useForm } from "react-hook-form";
import WebService from "../../Services/WebService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../config/Store";
import { reduxState } from "../../reducer/CommonReducer";
import HelperService from "../../Services/HelperService";
import { FORGET_PASSWORD_DATA, setDataInRedux } from "../../action/CommonAction";


const Otp = () => {
  const commonData: any = useSelector<RootState, reduxState>((state: any) => state.commonData);
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
    reset: resetOtp,
    control,
  } = useForm();
  const navigate = useNavigate()
  const [userOtp, setUserOtp] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const dispatch: Dispatch<any> = useDispatch();


  useEffect(() => {
    if (commonData && commonData?.forget_pass && !HelperService.isEmptyObject(commonData?.forget_pass)) {
      setUserEmail(commonData?.forget_pass?.email)
    } else {
      navigate("/login")
    }

  }, [])


  const handleChange = (value: any) => {
    setUserOtp(value);
  };


  const onSubmitOtp = (data: any) => {
    var obj = {
      email: userEmail,
      otp: userOtp,
    };
    WebService.postAPI({
      action: "verify/otp",
      body: obj,
      id: "otp-button",
    })
      .then((res: any) => {
        toast.success(res.message)
        dispatch(setDataInRedux({ type: FORGET_PASSWORD_DATA, value: obj }));
        navigate("/reset-password")
      })
      .catch(() => { });
  };

  const resendOtp = () => {
    WebService.postAPI({
      action: "resend/otp",
      body: { email: userEmail },
    })
      .then((res: any) => {
        toast.success(res.message);
      })
      .catch(() => { });
  }

  return (
    <>
      <div className="login-page">
        <div className="row justify-content-center min-vh-100 align-items-center mx-0">
          <div className="col-lg-5 d-flex align-items-center justify-content-center">
            <div className="w-100 login-card rounded-4">
              <div className="px-lg-5 px-3 py-5 ">
                <div className="mb-5 text-center">
                  <img src={Logo} width="186" height={30} alt="Logo" />
                </div>
                <div className=" ">
                  <div className=" ">
                    <h1 className="text-light font-bold mb-4 h2 text-center">
                      OTP Verification
                    </h1>
                    <p className="text-white text-center">
                      Enter 5 digits code we sent to your email address <br />
                      {userEmail && userEmail}
                    </p>
                    {/* <div className="d-flex gap-3 otp-controlls mb-3" id="inputs">
                      <input type="text" className="form-control text-center" maxLength={1} />
                      <input type="text" className="form-control text-center" maxLength={1} />
                      <input type="text" className="form-control text-center" maxLength={1} />
                      <input type="text" className="form-control text-center" maxLength={1} />
                      <input type="text" className="form-control text-center" maxLength={1} />
                    </div> */}
                    <form
                      className="form-style"
                      id="otp-form"
                      onSubmit={handleSubmitOtp(onSubmitOtp)}
                    >
                      {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Controller
                          control={control}
                          name="otp"
                          render={({ field }) => (
                           
                          )}
                        />
                        {errorsOtp.otp && (
                          <div className="text-center mt-3">
                            <Label title="Please enter otp" modeError={true} />
                          </div>
                        )}
                      </Form.Group> */}

                      <div className="d-flex justify-content-center">
                        <OTPInput
                          onChange={handleChange}
                          value={userOtp}
                          inputStyle="otpInputStyle form-control mx-2"
                          numInputs={5}
                          shouldAutoFocus={true}
                          renderSeparator={<span></span>}
                          renderInput={(props, index) => (
                            <input
                              {...props}
                              style={{ width: "80px", color: "black" }}
                            />
                          )}
                        />
                      </div>


                      <div className="text-center">
                        <Button
                          variant="dark"
                          className="btn-brand-1 px-5 mt-3 mb-3"
                          type="submit"
                          id="otp-button"
                          disabled={userOtp.length < 4 ? true : false}
                        >
                          Verify
                        </Button>
                      </div>
                    </form>
                  </div>
                  {/* <Link to="/reset-pawword" className="btn btn-brand-1 w-100">Verify</Link> */}

                  <div className="text-center my-3 text-white">
                    Didn't received verification OTP?{" "}
                    <Link to={"#"} onClick={resendOtp} id="resend-button"
                      className="text-brand font-14">
                      {" "}
                      Resed OTP
                    </Link>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Otp;




