import axios from "axios";
import React, { useEffect, useContext, useReducer } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { Link } from "react-router-dom";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, report: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export default function ReportScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: reportId } = params;
  const navigate = useNavigate();

  const [{ report }, dispatch] = useReducer(reducer, {
    loading: true,
    report: {},
    error: "",
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/report/${reportId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    if (!userInfo) {
      return navigate("/login");
    }
    if (!report._id || (report._id && report._id !== reportId)) {
      fetchReport();
    }
  }, [report, navigate, userInfo, reportId]);

  return (
    <div>
      <Helmet>
        <title>Report ${reportId}</title>
      </Helmet>
      <h1 className="my-3">Report {reportId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Report</Card.Title>

              <Card.Text>
                <strong>depts:</strong>
                {report.depts}
              </Card.Text>
              <Card.Text>
                <strong>Sold at:</strong>
                {report.soldAt}
                <br />
              </Card.Text>
              <Card.Text>
                <strong>Comments:</strong>
                {report.comments}
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payments</Card.Title>
              <Card.Text>
                <strong>Mathod: </strong>
                {report.paymentMethod}
              </Card.Text>
              {report.paymentMethod === "Cash" ||
              report.paymentMethod === "MoMo" ? (
                <h4 style={{ color: "green" }}>Paid</h4>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {report.reportItems &&
                  report.reportItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-item-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          />
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={2}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={2}>{item.price} RWF</Col>
                        <Col md={2}>{item.costPrice} RWF</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Report Summary</Card.Title>
              <ListGroup variant="flush">
                <Row>
                  <Col>Sales</Col>
                  <Col>{report.sales}RWF</Col>
                </Row>
                <Row>
                  <Col>
                    <strong>Total costs:</strong>{" "}
                  </Col>
                  <Col>
                    <strong>{report.costs}RWF</strong>{" "}
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <strong>Tax:</strong>{" "}
                  </Col>
                  <Col>
                    <strong>{report.taxPrice}RWF</strong>{" "}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <strong>Gross profit:</strong>{" "}
                  </Col>
                  <Col>
                    <strong>{report.grossProfit}</strong>{" "}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <strong>Net profit:</strong>{" "}
                  </Col>
                  <Col>
                    <strong>{report.netProfit}</strong>{" "}
                  </Col>
                </Row>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
