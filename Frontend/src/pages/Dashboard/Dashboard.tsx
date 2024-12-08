import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import "./dashboard.scss";
import { IoTodayOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import { PiUsersThree } from "react-icons/pi";
import WebService from "../../Services/WebService";
import ShancoDatePicker from "../../components/Common/ShancoDatePicker/ShancoDatePicker";
import Chart from "chart.js";
import HelperService from "../../Services/HelperService";

const Dashboard = () => {
  const [totalUsers, setTotalUser] = useState<any>({
    total_active: 0,
    total: 0,
  });
  const [ShowLoader, setShowLoader] = useState(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();

  useEffect(() => {
    getUsersData();
  }, [startDate, endDate]);

  const getUsersData = () => {
    var obj: any = {};
    obj.date_from = startDate ? startDate : "";
    obj.date_to = endDate ? endDate : "";
    setShowLoader(true);
    WebService.postAPI({
      action: `api/user/total-user`,
      body: obj,
    })
      .then((res: any) => {
        setTotalUser(res.data);
      })
      .catch((e) => {
        setShowLoader(false);
      });
  };

  return (
    <>
      <div className="app-page page-dashboard">
        <div className="d-flex justify-content-between mb-4 align-items-center">
          <h1 className="page-heading mb-lg-0 mb-3">Dashboard</h1>
          <>
            <Row className="mb-3 text-end">
              <Col lg={6}>
                <ShancoDatePicker
                  placeholderText="From Date"
                  selected={startDate}
                  onChange={(date: any) => setStartDate(date)}
                  maxData={new Date(endDate)}
                />
              </Col>
              <Col lg={6}>
                <ShancoDatePicker
                  placeholderText="To Date"
                  selected={endDate}
                  onChange={(date: any) => setEndDate(date)}
                  minData={new Date(startDate)}
                />
              </Col>
            </Row>
          </>
        </div>

        <Row className=" row-cols-lg-5 mb-4">
          <Col lg={6}>
            <Card className="overview-card bg-primary-subtle">
              <div className="d-flex gap-3 text-primary">
                <div>
                  <PiUsersThree size={28} />
                </div>
                <div className="">
                  <p className="mb-1 ">Total Active User's</p>
                  <h2 className="mb-0 font-bold">
                    {totalUsers.total_active}
                  </h2>
                </div>
              </div>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="overview-card bg-success-subtle">
              <div className="d-flex gap-3 text-success">
                <div>
                  <PiUsersThree size={28} />
                </div>
                <div className="">
                  <p className="mb-1 ">Total User's</p>
                  <h2 className="mb-0 font-bold">
                    {totalUsers.total}
                  </h2>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
