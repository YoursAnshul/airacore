import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import "./dashboard.scss";
import { IoTodayOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { BsBoxes } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { PiUsersThree } from "react-icons/pi";
import WebService from "../../Services/WebService";
import ShancoDatePicker from "../../components/Common/ShancoDatePicker/ShancoDatePicker";
import Chart from "chart.js";
import HelperService from "../../Services/HelperService";

const Dashboard = () => {
  const barChartRef = useRef<Chart | null>(null);
  const barChartRefCountry = useRef<Chart | null>(null);
  const lineChartRef = useRef<Chart | null>(null);
  const [salesAndOrdres, setSalesAndOrdres] = useState<any>({
    total_amount: 0,
    record_count: 0,
  });
  const [productAndCategoryAndUser, setProductAndCategoryAndUser] =
    useState<any>({
      total_product_count: 0,
      total_category_count: 0,
      total_users: 0,
    });
  const [ShowLoader, setShowLoader] = useState(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();

  const [ProductData, setProductData] = useState<any>();
  const [CountryData, setCountryData] = useState<any>();
  const [dayWiseData, setDayWiseData] = useState<any>();

  useEffect(() => {
    getTamplates();
    getProductData();
    getCountryData()
    getDayWiseSale()
    getProductAndCategoryANdUser();
    
  }, [startDate, endDate]);

  const getTamplates = () => {
    var obj: any = {};
    obj.date_from = startDate ? startDate : "";
    obj.date_to = endDate ? endDate : "";
    setShowLoader(true);
    WebService.getAPI({
      action: `total-sales`,
      body: obj,
    })
      .then((res: any) => {
        setSalesAndOrdres(res);
      })
      .catch((e) => {
        setShowLoader(false);
      });
  };

  const getProductAndCategoryANdUser = (
    keyword?: string,
    startDate?: Date,
    endDate?: Date
  ) => {
    setShowLoader(true);
    WebService.getAPI({
      action: `total-count?date_from=${startDate ? startDate : ""}&date_to=${
        endDate ? endDate : ""
      }`,
      body: null,
    })
      .then((res: any) => {
        setProductAndCategoryAndUser(res);
      })
      .catch((e) => {
        setShowLoader(false);
      });
  };


  const getProductData = () => {
    WebService.getAPI({
      action: `orders/top-product?date_from=${startDate ? startDate : ""}&date_to=${endDate ? endDate : ""}`,
    })
      .then((res: any) => {
        const names:any = [];
        const quantities:any = [];
        res.list.forEach((item: any) => {
          if (item) {
            names.push(item.name);
            quantities.push(item.quantity);
          }
        });
        setProductData({ names, quantities });
      })
      .catch(() => {});
  };

  const getCountryData = () => {
    WebService.getAPI({
      action: `orders/top-countries?date_from=${startDate ? startDate : ""}&date_to=${endDate ? endDate : ""}`,
    })
      .then((res: any) => {
        const names:any = [];
        const quantities:any = [];
        res.list.forEach((item: any) => {
          if (item) {
            names.push(item.name);
            quantities.push( item.quantity);
          }
        });
        setCountryData({ names, quantities });
      })
      .catch(() => {});
  };


  const getDayWiseSale = () => {
    WebService.getAPI({
      // action: `orders/top-countries`,
      action: `orders/day-wise?date_from=${startDate ? startDate : ""}&date_to=${endDate ? endDate : ""}`,
    })
      .then((res: any) => {
        const Date:any = [];
        const Value:any = [];
        res.list.forEach((item: any) => {
          if (item) {
            Date.push(HelperService.getFormatedDate(item.date));
            Value.push(item.value);
          }
        });
        setDayWiseData({ Date, Value });
      })
      .catch(() => {});
  };
  
  const LineChart = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    if (lineChartRef.current) {
      lineChartRef.current.destroy();
    }
    const ctx = canvas.getContext("2d");
    if (ctx) {
      lineChartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels : dayWiseData?.Date.reverse(),
         
          datasets: [
            {
              data:dayWiseData?.Value ,
              backgroundColor: "transparent",
              borderColor: "rgb(255, 99, 132)",
              lineTension: 0,
            },
          ],
        },
        options: {
          // layout: {
          //   padding: {
          //     top: 10,
          //     right: 10,
          //     bottom: 10,
          //     left: 10
          //   }
          // },
          responsive: true,
          cutoutPercentage: 75,
          legend: {
            position: "bottom",
            display: false,
            labels: {
              boxWidth: 15,
              fontSize: 15

            },
          },
          showLines: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  display: true,
                },
                gridLines: {
                  display: true,
                },
                scaleLabel: {
                  display: false,
                  labelString: "Amount",
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  display: true,
                },
                gridLines: {
                  display: true,
                },
              },
            ],
          },
        },
      });
    }
  };

  const CountryCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    if (barChartRef.current) {
      barChartRef.current.destroy();
    }
    const ctx = canvas.getContext("2d");
    if (ctx) {
      barChartRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: CountryData?.names,

          datasets: [
            {
              data:CountryData?.quantities,
              backgroundColor: [
              
                "rgb(255, 99, 132)",
"rgb(54, 162, 235)",
"rgb(255, 206, 86)",
"rgb(75, 192, 192)",
"rgb(153, 102, 255)",
"rgb(255, 159, 64)",
"rgb(0, 128, 0)",
"rgb(255, 0, 0)",
"rgb(0, 0, 255)",
"rgb(128, 128, 128)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          layout: {
            padding: {},
          },
          cutoutPercentage: 80,
          legend: {
            position: "bottom",
            display: true,
            labels: {
              boxWidth: 15,     
              fontSize: 14

            },
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  display: false,
                },
                gridLines: {
                  display: false,
                },
                scaleLabel: {
                  display: false,
                  labelString: "Amount",
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  display: false,
                },
                gridLines: {
                  display: false,
                },
              },
            ],
          },
        },
      });
    }
  };


  const ProductCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    if (barChartRefCountry.current) {
      barChartRefCountry.current.destroy();
    }

    const ctx = canvas.getContext("2d");
    if (ctx) {
      barChartRefCountry.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ProductData?.names,
          datasets: [
            {
              data: ProductData?.quantities,
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 206, 86)",
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)",
                "rgb(255, 159, 64)",
                "rgb(0, 128, 0)",
                "rgb(255, 0, 0)",
                "rgb(0, 0, 255)",
                "rgb(128, 128, 128)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          layout: {
            padding: {},
          },
          cutoutPercentage: 80,
          legend: {
            position: "bottom",
            display: true,
            labels: {
              boxWidth: 15,
              fontSize: 14

            },
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  display: false,
                },
                gridLines: {
                  display: false,
                },
                scaleLabel: {
                  display: false,
                  labelString: "Amount",
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  display: false,
                },
                gridLines: {
                  display: false,
                },
              },
            ],
          },
        },
      });
    }
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
          <Col>
            <Card className="overview-card bg-primary-subtle">
              <div className="d-flex gap-3 text-primary">
                <div>
                  <IoTodayOutline size={28} />
                </div>
                <div className="">
                  <p className="mb-1 ">Today's sales</p>
                  <h2 className="mb-0 font-bold">
                    ${HelperService.formateDecimal(salesAndOrdres?.total_amount)}
                  </h2>
                </div>
              </div>
            </Card>
          </Col>
          <Col>
            <Card className="overview-card bg-success-subtle">
              <div className="d-flex gap-3 text-success">
                <div>
                  <FiShoppingBag size={28} />
                </div>
                <div className="">
                  <p className="mb-1 ">Total Order</p>
                  <h2 className="mb-0 font-bold">
                    {salesAndOrdres.record_count}
                  </h2>
                </div>
              </div>
            </Card>
          </Col>
          <Col>
            <Card className="overview-card bg-warning-subtle">
              <div className="d-flex gap-3 text-warning-emphasis">
                <div>
                  <BsBoxes size={28} />
                </div>
                <div className="">
                  <p className="mb-1 ">Total Products</p>
                  <h2 className="mb-0 font-bold">
                    {productAndCategoryAndUser.total_product_count}
                  </h2>
                </div>
              </div>
            </Card>
          </Col>
          <Col>
            <Card className="overview-card bg-info-subtle">
              <div className="d-flex gap-3 text-info-emphasis">
                <div>
                  <MdOutlineCategory size={28} />
                </div>
                <div className="">
                  <p className="mb-1 ">Total Category</p>
                  <h2 className="mb-0 font-bold">
                    {productAndCategoryAndUser.total_category_count}
                  </h2>
                </div>
              </div>
            </Card>
          </Col>
          <Col>
            <Card className="overview-card bg-danger-subtle">
              <div className="d-flex gap-3 text-danger-emphasis">
                <div>
                  <PiUsersThree size={28} />
                </div>
                <div className="">
                  <p className="mb-1 ">Total no of Users</p>
                  <h2 className="mb-0 font-bold">
                    {productAndCategoryAndUser.total_users}
                  </h2>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={4}>
            <Card className="bg-white border-0 p-3">
              <h4 className="font-bold font-18 mb-4 text-center">
                Day wise sale
              </h4>
              <canvas ref={LineChart} height={150} width={200}></canvas>
              {/* <img src={GraphDaywiseSale} className=" img-fluid" alt="" /> */}
            </Card>
          </Col>
          <Col lg={4} className="ml-4">
            <Card className="bg-white border-0 p-3">
              <h4 className="font-bold font-18 text-center mb-4">
                Top Country
              </h4>

              <canvas ref={CountryCanvas} width={200} height={150}></canvas>
              {/* <img src={GraphTopGraph} className=" img-fluid" alt="" /> */}
            </Card>
          </Col>
          <Col lg={4} className="ml-4">
            <Card className="bg-white border-0 p-3">
              <h4 className="font-bold font-18 text-center mb-4">
                Top Products
              </h4>

              <canvas ref={ProductCanvas} width={200} height={150}></canvas>
              {/* <img src={GraphTopGraph} className=" img-fluid" alt="" /> */}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
