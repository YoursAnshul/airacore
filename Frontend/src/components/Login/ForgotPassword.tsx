
import { Dispatch, useState } from 'react';
import Logo from '../../assets/images/shan_and_co_logo.png'
import { Link, Route, useNavigate, useNavigation } from 'react-router-dom';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { HiOutlineKey } from "react-icons/hi2";
import "./login.scss";
import { Controller, useForm } from 'react-hook-form';
import { Label } from '../Common/Label/Label';
import WebService from '../../Services/WebService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FORGET_PASSWORD_DATA, setDataInRedux } from '../../action/CommonAction';
import { Row, Col, Card, Form, Button, Offcanvas } from "react-bootstrap";


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState<any>(BsEyeSlash);
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^^(?=.*[A-Za-z0-9])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    const dispatch: Dispatch<any> = useDispatch();
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
    const [showPassword, setShowPassword] = useState<boolean>(true);
    const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(BsEye);
            setType('text')
        } else {
            setIcon(BsEyeSlash)
            setType('password')
        }
    }

    const addUser = (data: any) => {
        WebService.postAPI({ action: "api/auth/signup", body: data, id: "add_country" })
            .then((res: any) => {
                navigate("/login")
                reset({});
                toast.success("User Created Successfully");
            })
            .catch(() => {
            });
    };

    return (
        <>
            <div className="login-page">
                <div className="row justify-content-center min-vh-100 align-items-center mx-0">
                    <div className="col-lg-5 d-flex align-items-center justify-content-center">
                        <div className="w-100 login-card rounded-4">
                            <div className="px-lg-5 px-2 py-3 ">
                                <form className="mb-3" onSubmit={handleSubmit(addUser)}>
                                    <label className="mt-2 text-white">First name</label>
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

                                    <label className="mt-3 text-white">Last name</label>
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

                                    <label className="mt-3 text-white">Mobile Number</label>
                                    <div className="input-group mb-1 mt-2">
                                        <input
                                            type="text"
                                            className="form-control ps-3 p-2"
                                            placeholder="Mobile Number"
                                            {...register("mobileNumber", { required: true })}
                                        />
                                    </div>
                                    {errors.mobileNumber && (
                                        <div className="login-error">
                                            <Label title={"Mobile Number required"} modeError={true} />
                                        </div>
                                    )}

                                    <label className="mt-3 text-white">Email</label>
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
                                            <Form.Label className='text-white'> Password</Form.Label>
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
                                    <Button id="add_country" className="btn-brand-1 w-100 mt-4"
                                        type="submit" >Save </Button>
                                    <div className="text-center my-3 text-white">
                                        Back to <Link to="/login" className="text-brand font-14">Login</Link> </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
export default ForgotPassword;