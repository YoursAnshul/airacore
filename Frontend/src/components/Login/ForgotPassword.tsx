
import { Dispatch, useState } from 'react';
import Logo from '../../assets/images/shan_and_co_logo.png'
import { Link, Route, useNavigate, useNavigation } from 'react-router-dom';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { HiOutlineKey } from "react-icons/hi2";
import { Button, Form } from 'react-bootstrap'
import "./login.scss";
import { Controller, useForm } from 'react-hook-form';
import { Label } from '../Common/Label/Label';
import WebService from '../../Services/WebService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FORGET_PASSWORD_DATA, setDataInRedux } from '../../action/CommonAction';


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState<any>(BsEyeSlash);
    const { handleSubmit, formState: { errors, isValid }, control, watch } = useForm<any>({});
    const watchAllFields = watch();
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^^(?=.*[A-Za-z0-9])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    const dispatch: Dispatch<any> = useDispatch();


    const handleToggle = () => {
        if (type === 'password') {
            setIcon(BsEye);
            setType('text')
        } else {
            setIcon(BsEyeSlash)
            setType('password')
        }
    }

    const handleSendOtp = (data: any) => {
        WebService.postAPI({
            action: `users/forget-password`,
            body: data
        }).then((res: any) => {
            toast.success(res.message)
            dispatch(setDataInRedux({ type: FORGET_PASSWORD_DATA, value: data }));

            
            setTimeout(() => {
                navigate("/otp")
            }, 100)
        })
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

                                <Form onSubmit={handleSubmit(handleSendOtp)}>
                                    <div className=" ">
                                        <h1 className="text-light mb-4 font-bold text-center h3">Forgot Password?</h1>
                                        <Controller
                                            control={control}
                                            name="email"
                                            rules={{
                                                required: "Please Enter Email",
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
                                                        <label className='font-14 text-white mb-2'> Entered your registered Email ID to recover the password</label>
                                                        <div className="input-group mb-3">
                                                            <span className="input-group-text bg-white border-end-0 text-secondary">
                                                                <HiOutlineEnvelope size={16} />
                                                            </span>
                                                            <input type="text" className="form-control border-start-0 ps-0" placeholder="Email Address"
                                                                onChange={onChange} onBlur={onBlur} />
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

                                        <Button type='submit' id='send_opt_button' disabled={!isValid} className="btn btn-brand-1 w-100">Send OTP</Button>
                                        <div className="text-center my-3 text-white">
                                            Back to <Link to="/login" className="text-brand font-14">Login</Link> </div>
                                    </div>
                                </Form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
export default ForgotPassword;