import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Container,
  Nav,
  Tab,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import DocFileIcon from "../../assets/images/word-doc-icon.svg";
import ExcelFileIcon from "../../assets/images/excel-doc-icon.svg";
import { BiSearch } from "react-icons/bi";
import profilePic from "../../assets/images/user-profile.png";
// import { Label } from '../Common/Label/Label';

import { Label } from "../../components/Common/Label/Label";

import "./profile.scss";
import { Controller, useForm } from "react-hook-form";
import WebService from "../../Services/WebService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../config/Store";
import { reduxState } from "../../reducer/CommonReducer";
import HelperService from "../../Services/HelperService";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { USER_INFO, setDataInRedux } from "../../action/CommonAction";
import SetPassword from "../../components/ChangePassword/changePassword";
import PageTitle from "../../components/Common/PageTitle";

const Profile = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const commonData: any = useSelector<RootState, reduxState>(
    (state: any) => state.commonData
  );
  const userInfoData: any = useSelector<RootState, any>((state: any) => state.userInfoData);

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    setValue,
    register,
  } = useForm<any>({});
  const watchAllFields = watch();
  const nameRegex = /^[A-Za-z][A-Za-z_ ]{2,30}$/;
  const [profileImage, setProfileImage] = useState<any>();
  const [imageLocalUrl, setImageLocalUrl] = useState<any>();
  const [isShowForgotPasswordModal, setIsShowForgotPasswordModal] =
    useState<any>(false);

  useEffect(() => {
    if (
      userInfoData &&
      userInfoData?.user_info &&
      !HelperService.isEmptyObject(userInfoData?.user_info)
    ) {
      setValue("first_name", userInfoData?.user_info?.first_name);
      setValue("middle_name", userInfoData?.user_info?.middle_name);
      setValue("last_name", userInfoData?.user_info?.last_name);
      setValue("company_name", userInfoData?.user_info?.company_name);
      setValue("email", userInfoData?.user_info?.email);

      setImageLocalUrl(userInfoData?.user_info?.avtar);
    }
  }, [userInfoData?.user_info]);

  const handleUploadImage = (event: any) => {
    var sizeInBytes = event.target.files[0].size;
    var sizeInKb = sizeInBytes / 1024;
    var sizeInMb = sizeInKb / 1024;
    // if (sizeInMb > IMAGE_SIZE_LIMIT) {
    //   toast.warn("Image must be less then 1 MB!", { theme: "colored" });
    //   return;
    // }

    const { files } = event.target;
    if (files && files[0]) {
      setProfileImage(files[0]);
      const blob = URL.createObjectURL(files[0]);
      setImageLocalUrl(blob);
      var image_url = document.getElementById("myImage") as HTMLElement;
      if (image_url) {
        (image_url as HTMLMediaElement).src = blob;
      }
    }
    event.target.value = "";
  };

  const uploadImage = async () => {
    await WebService.fileUploadAPI({
      action: "upload-image",
      file: profileImage,
      key: "image",
      body: {},
      id: "update-btn",
    })
      .then((res: any) => {
        toast.success(res.message);
      })
      .catch(() => {});
  };

  const onSave = (data: any) => {
    WebService.putAPI({
      action: `/update-profile`,
      body: data,
      id: "update-btn",
    })
      .then((res: any) => {
        toast.success(res.message);
        userMeCall();
      })
      .then(() => {});
  };

  const onSubmitNEW = async (data: any) => {
    profileImage && (await uploadImage());
    data && (await onSave(data));
  };

  const userMeCall = async () => {
    WebService.getAPI({ action: "me", id: "login_btn" })
      .then((res: any) => {
        dispatch(setDataInRedux({ type: USER_INFO, value: res }));
      })
      .catch(() => {
        typeof window !== "undefined" && localStorage.clear();
      });
  };

  return (

    <>
    <div className="app-page page-dashboard">
  
        <div className="d-flex justify-content-between align-items-center ">
            <PageTitle title="Profile" backArrow={false} />
        </div>

        <Card className="table-card">
              
  
              <form onSubmit={handleSubmit(onSubmitNEW)}>
                {/* <Form className="form-style"> */}
                <Row className="justify-content-center mb-4">
                  <Col lg={4}>
                    <Card.Body className="text-center">
                      <p className="font-medium">Your profile picture</p>
                      <img
                        //   src={}
                        src={imageLocalUrl ? imageLocalUrl : profilePic}
                        width={150}
                        height={150}
                        className=" rounded-circle object-fit-cover mb-3 border border-brand border-3"
                        alt={"Profile Image"}
                      />
                      <div className="upload-btn-container mb-2">
                        <label
                          htmlFor="tb-file-upload"
                          className="bg-white"
                          style={{ height: "45px" }}
                        >
                          {" "}
                          + Upload new photo
                        </label>
                        <input
                          type="file"
                          id="tb-file-upload"
                          onChange={handleUploadImage}
                        />
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} lg={4}>
                    <Controller
                      control={control}
                      name="first_name"
                      rules={{
                        required: "Please Enter First Name",
                        pattern: {
                          value: nameRegex,
                          message:
                            "Between 3 to 30 characters, letters only.",
                        },
                      }}
                      render={({
                        field: { onChange, onBlur },
                        fieldState: { isTouched, isDirty },
                      }) => (
                        <div className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>
                              First Name{" "}
                              <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Control
                              type="text"
                              value={watchAllFields.first_name}
                              placeholder="First Name"
                              onChange={onChange}
                              onBlur={onBlur}
                            />
                          </Form.Group>
                          {(errors["first_name"]?.message ||
                            Boolean(errors["first_name"]?.message) ||
                            (isTouched && !watchAllFields.first_name) ||
                            (watchAllFields.first_name &&
                              !nameRegex.test(
                                watchAllFields.first_name
                              ))) && (
                            <div className="login-error">
                              <Label
                                title={
                                  errors.first_name?.message ||
                                  watchAllFields.first_name
                                    ? "Between 3 to 30 characters, letters only"
                                    : "Please Enter First Name."
                                }
                                modeError={true}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </Col>

                  <Col xs={6} lg={4}>
                    <Controller
                      control={control}
                      name="last_name"
                      rules={{
                        required: "Please Enter lAST Name",
                        pattern: {
                          value: nameRegex,
                          message:
                            "Between 3 to 30 characters, letters only.",
                        },
                      }}
                      render={({
                        field: { onChange, onBlur },
                        fieldState: { isTouched, isDirty },
                      }) => (
                        <div className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Last Name <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Control
                              type="text"
                              value={watchAllFields.last_name}
                              placeholder="First Name"
                              onChange={onChange}
                              onBlur={onBlur}
                            />
                          </Form.Group>
                          {(errors["last_name"]?.message ||
                            Boolean(errors["last_name"]?.message) ||
                            (isTouched && !watchAllFields.last_name) ||
                            (watchAllFields.last_name &&
                              !nameRegex.test(watchAllFields.last_name))) && (
                            <div className="login-error">
                              <Label
                                title={
                                  errors.last_name?.message ||
                                  watchAllFields.last_name
                                    ? "Between 3 to 30 characters, letters only"
                                    : "Please Enter First Name."
                                }
                                modeError={true}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </Col>

                  <Col lg={4} md={6} xs={6}>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <span className="text-danger">*</span>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                          required: false,
                          pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
                        })}
                        disabled
                      />
                      <div
                        className="cursor-pointer text-end font-14"
                        style={{ textDecoration: "underline" }}
                        onClick={() => {
                          setIsShowForgotPasswordModal(true);
                        }}
                      >
                        Change Password?
                      </div>
                      {errors.email?.type == "required" && (
                        <Label title="Please enter email" modeError={true} />
                      )}
                      {errors.email?.type == "pattern" && (
                        <Label
                          title="Please enter valid email"
                          modeError={true}
                        />
                      )}
                    </Form.Group>
                  </Col>

                  <Col lg={12} className="text-center">
                    <Button
                      className="btn-brand-1 me-3"
                      type="submit"
                      id="update-btn"
                    >
                      {" "}
                      Save{" "}
                    </Button>
                    {/* <Button className="btn-outline-brand">Cancel </Button> */}
                  </Col>
                </Row>

              </form>
              
              </Card>
              <SetPassword
              isShow={isShowForgotPasswordModal}
              isClose={() => {
                setIsShowForgotPasswordModal(false);
              }}
            />
     

    </div>
</>
    // <>
    //   <div className="page-profile">
    //     <Container>
    //         <Row className="gx-lg-5">
    //           <Col lg={9}>
    //             <h2 className="font-22 heading-font mb-4 text-brand-dark border-bottom pb-2">
    //               Profile
    //             </h2>
    //             <Card className="table-card">
              
  
    //             <form onSubmit={handleSubmit(onSubmitNEW)}>
    //               {/* <Form className="form-style"> */}
    //               <Row className="justify-content-center mb-4">
    //                 <Col lg={4}>
    //                   <Card.Body className="text-center">
    //                     <p className="font-medium">Your profile picture</p>
    //                     <img
    //                       //   src={}
    //                       src={imageLocalUrl ? imageLocalUrl : profilePic}
    //                       width={150}
    //                       height={150}
    //                       className=" rounded-circle object-fit-cover mb-3 border border-brand border-3"
    //                       alt={"Profile Image"}
    //                     />
    //                     <div className="upload-btn-container mb-2">
    //                       <label
    //                         htmlFor="tb-file-upload"
    //                         className="bg-white"
    //                         style={{ height: "45px" }}
    //                       >
    //                         {" "}
    //                         + Upload new photo
    //                       </label>
    //                       <input
    //                         type="file"
    //                         id="tb-file-upload"
    //                         onChange={handleUploadImage}
    //                       />
    //                     </div>
    //                   </Card.Body>
    //                 </Col>
    //               </Row>
    //               <Row>
    //                 <Col xs={6} lg={4}>
    //                   <Controller
    //                     control={control}
    //                     name="first_name"
    //                     rules={{
    //                       required: "Please Enter First Name",
    //                       pattern: {
    //                         value: nameRegex,
    //                         message:
    //                           "Between 3 to 30 characters, letters only.",
    //                       },
    //                     }}
    //                     render={({
    //                       field: { onChange, onBlur },
    //                       fieldState: { isTouched, isDirty },
    //                     }) => (
    //                       <div className="mb-4">
    //                         <Form.Group className="mb-3">
    //                           <Form.Label>
    //                             First Name{" "}
    //                             <span className="text-danger">*</span>
    //                           </Form.Label>

    //                           <Form.Control
    //                             type="text"
    //                             value={watchAllFields.first_name}
    //                             placeholder="First Name"
    //                             onChange={onChange}
    //                             onBlur={onBlur}
    //                           />
    //                         </Form.Group>
    //                         {(errors["first_name"]?.message ||
    //                           Boolean(errors["first_name"]?.message) ||
    //                           (isTouched && !watchAllFields.first_name) ||
    //                           (watchAllFields.first_name &&
    //                             !nameRegex.test(
    //                               watchAllFields.first_name
    //                             ))) && (
    //                           <div className="login-error">
    //                             <Label
    //                               title={
    //                                 errors.first_name?.message ||
    //                                 watchAllFields.first_name
    //                                   ? "Between 3 to 30 characters, letters only"
    //                                   : "Please Enter First Name."
    //                               }
    //                               modeError={true}
    //                             />
    //                           </div>
    //                         )}
    //                       </div>
    //                     )}
    //                   />
    //                 </Col>

    //                 <Col xs={6} lg={4}>
    //                   <Controller
    //                     control={control}
    //                     name="last_name"
    //                     rules={{
    //                       required: "Please Enter lAST Name",
    //                       pattern: {
    //                         value: nameRegex,
    //                         message:
    //                           "Between 3 to 30 characters, letters only.",
    //                       },
    //                     }}
    //                     render={({
    //                       field: { onChange, onBlur },
    //                       fieldState: { isTouched, isDirty },
    //                     }) => (
    //                       <div className="mb-4">
    //                         <Form.Group className="mb-3">
    //                           <Form.Label>
    //                             Last Name <span className="text-danger">*</span>
    //                           </Form.Label>

    //                           <Form.Control
    //                             type="text"
    //                             value={watchAllFields.last_name}
    //                             placeholder="First Name"
    //                             onChange={onChange}
    //                             onBlur={onBlur}
    //                           />
    //                         </Form.Group>
    //                         {(errors["last_name"]?.message ||
    //                           Boolean(errors["last_name"]?.message) ||
    //                           (isTouched && !watchAllFields.last_name) ||
    //                           (watchAllFields.last_name &&
    //                             !nameRegex.test(watchAllFields.last_name))) && (
    //                           <div className="login-error">
    //                             <Label
    //                               title={
    //                                 errors.last_name?.message ||
    //                                 watchAllFields.last_name
    //                                   ? "Between 3 to 30 characters, letters only"
    //                                   : "Please Enter First Name."
    //                               }
    //                               modeError={true}
    //                             />
    //                           </div>
    //                         )}
    //                       </div>
    //                     )}
    //                   />
    //                 </Col>

    //                 <Col lg={4} md={6} xs={6}>
    //                   <Form.Group controlId="formBasicEmail">
    //                     <Form.Label>Email</Form.Label>
    //                     <span className="text-danger">*</span>
    //                     <Form.Control
    //                       type="email"
    //                       placeholder="Email"
    //                       {...register("email", {
    //                         required: false,
    //                         pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
    //                       })}
    //                       disabled
    //                     />
    //                     <div
    //                       className="cursor-pointer  font-14"
    //                       style={{ textDecoration: "underline" }}
    //                       onClick={() => {
    //                         setIsShowForgotPasswordModal(true);
    //                       }}
    //                     >
    //                       Change Password?
    //                     </div>
    //                     {errors.email?.type == "required" && (
    //                       <Label title="Please enter email" modeError={true} />
    //                     )}
    //                     {errors.email?.type == "pattern" && (
    //                       <Label
    //                         title="Please enter valid email"
    //                         modeError={true}
    //                       />
    //                     )}
    //                   </Form.Group>
    //                 </Col>

    //                 <Col lg={12} className="text-center">
    //                   <Button
    //                     className="btn-brand-1 me-3"
    //                     type="submit"
    //                     id="update-btn"
    //                   >
    //                     {" "}
    //                     Save{" "}
    //                   </Button>
    //                   {/* <Button className="btn-outline-brand">Cancel </Button> */}
    //                 </Col>
    //               </Row>

    //               {/* </Form> */}
    //             </form>
    //             </Card>
    //           </Col>
    //         </Row>
    //         <SetPassword
    //           isShow={isShowForgotPasswordModal}
    //           isClose={() => {
    //             setIsShowForgotPasswordModal(false);
    //           }}
    //         />
    //     </Container>
    //   </div>
    // </>
  );
};

export default Profile;
