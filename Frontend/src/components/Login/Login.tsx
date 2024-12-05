
import { useState } from 'react';
import Logo from '../../assets/images/shan_and_co_logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { HiOutlineKey } from "react-icons/hi2";
import { Button, Form } from 'react-bootstrap'
import "./login.scss";
import { Controller, useForm } from 'react-hook-form';
import { Label } from '../Common/Label/Label';
import WebService from '../../Services/WebService';
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { USER_INFO, USER_LOGIN_SUCCESS, setDataInRedux } from '../../action/CommonAction';

const Login = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const navigate = useNavigate();
    const { handleSubmit, formState: { errors, isValid }, control, watch } = useForm<any>({});
    const watchAllFields = watch();
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const [type, setType] = useState('password');

    const handleToggle = () => {
        if (type === 'password') {
            setType('text')
        } else {
            setType('password')
        }
    }

    const handleLogin = (data: any) => {
        WebService.postAPI({ action: "api/auth/login", body: data, id: 'login_btn' })
            .then((res: any) => {
                localStorage.setItem("token", res?.data?.token);
                userMeCall(res.data.token);
            }).catch(() => {
            })
    }

    const userMeCall = async (token: string) => {
        await WebService.getAPI({ action: "api/user/me", id: "login_btn" })
            .then((res: any) => {
                toast.success("Login successfully");
                dispatch({ type: USER_LOGIN_SUCCESS, payload: { access_token: token }, });
                dispatch(setDataInRedux({ type: USER_INFO, value: res }));
                alert(token);
                localStorage.setItem("token", token);
                navigate("/dashboard")
            })
            .catch(() => {
                alert("clearrrrr........")
                typeof window !== "undefined" && localStorage.clear();
            });
    };

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
                                <form onSubmit={handleSubmit(handleLogin)}>
                                    <div className=" ">
                                        <h1 className="text-light mb-4 font-bold text-center h2">Welcome to Shan & Co Admin</h1>

                                        <Controller
                                            control={control}
                                            name="email"
                                            rules={{
                                                required: "false",
                                                pattern: {
                                                    value: emailRegex,
                                                    message: "Enter valid email address",
                                                }
                                            }}
                                            render={({
                                                field: { onChange, onBlur },
                                                fieldState: { isTouched, isDirty }
                                            }) => (
                                                <div className='mb-4'>
                                                    <div className="form-group">

                                                        <div className="input-group mb-3">
                                                            <span className="input-group-text bg-white border-end-0 text-secondary">
                                                                <HiOutlineEnvelope size={16} />
                                                            </span>
                                                            <input type="text" className="form-control border-start-0 ps-0" placeholder="Email Address" onChange={onChange} onBlur={onBlur} />
                                                        </div>
                                                    </div>
                                                    {
                                                        (errors["email"]?.message || Boolean(errors["email"]?.message) || (isTouched && !watchAllFields.email) || (watchAllFields.email && !emailRegex.test(watchAllFields.email))) &&
                                                        <div className="login-error">
                                                            <Label
                                                                title={(errors.email?.message || watchAllFields.email
                                                                    ? "Enter valid email address"
                                                                    : "Please Enter Email.")}
                                                                modeError={true}
                                                            />
                                                        </div>
                                                    }
                                                </div>
                                            )}
                                        />


                                        {/* Password  */}
                                        <Controller
                                            control={control}
                                            name="password"
                                            rules={{
                                                required: "Please Enter Password",
                                            }}
                                            render={({
                                                field: { onChange, onBlur },
                                                fieldState: { isTouched }
                                            }) => (
                                                <div className="mb-3">
                                                    <div className="form-group mb-4">
                                                        <div className="input-group mb-2">
                                                            <span className="input-group-text bg-white border-end-0 text-secondary">
                                                                <HiOutlineKey size={16} />
                                                            </span>
                                                            <input type={type} className="form-control border-end-0 border-start-0 ps-0" placeholder="Password"
                                                                onChange={onChange} onBlur={onBlur} />
                                                            <span className="input-group-text text-secondary bg-white border-start-0 cursor-pointer" onClick={handleToggle} >
                                                                {type == "password" ? <BsEye size={16} /> : <BsEyeSlash size={16} />
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {
                                                        (errors["password"]?.message || Boolean(errors["password"]?.message) || (isTouched && !watchAllFields.password))
                                                        &&
                                                        <div className="login-error">
                                                            <Label
                                                                title={(errors.password?.message || watchAllFields.password
                                                                    ? "Between 8 to 20 characters and at least one upper case, lower case, number and special character." : "Please Enter Password.")}
                                                                modeError={true}
                                                            />
                                                        </div>
                                                    }
                                                </div>
                                            )}
                                        />



                                        <Button type='submit' id='login_btn' disabled={!isValid} className="btn btn-brand-1 w-100">Login</Button>
                                        <div className="text-center my-3">
                                            <Link to="/forgot-password" className="text-brand font-14">Forgot Password?</Link> </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
export default Login;   