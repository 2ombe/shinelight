import React, { useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useReducer } from "react";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, report: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Report() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, report }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `/api/report/all`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <Helmet>Report</Helmet>
      <h1>Report</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox></MessageBox>
      ) : (
        <Table
          className="table"
          style={{ background: "rgb(0, 102, 255)" }}
          striped
          bordered
          hover
        >
          <thead>
            <tr>
              <th>Id</th>
              <th>Date</th>
              <th>Sold at</th>
              <th>sales</th>
              <th>costs</th>
              <th>taxes</th>
              <th>Gross profit</th>
              <th>Net profit</th>
              <th>Depts</th>
              <th>Expense</th>
              {/* <td>Status</td> */}
              <td>comments</td>
              {/* <td>Action</td> */}
            </tr>
          </thead>
          <tbody>
            {report.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.createdAt.substring(0, 10)}</td>
                {/* <td>{item.user.izina}</td> */}
                <td>{item.soldAt}</td>
                <td>{item.sales}</td>

                <td>{item.costs}</td>

                <td>{item.taxPrice}</td>
                <td style={{ backgroundColor: "yellow" }} className="profit">
                  {item.grossProfit}
                </td>
                <td style={{ backgroundColor: "yellow" }} className="profit">
                  {item.netProfit}
                </td>
                <td style={{ backgroundColor: "tomato" }}>{item.depts}</td>
                <td style={{ backgroundColor: "tomato" }}>{item.expense}</td>
                {/* <td>{item.isPaid === true ? "Paid" : "No"}</td> */}
                <td>{item.comments}</td>
                {/* <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/report/${report._id}`);
                    }}
                  >
                    Details
                  </Button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
