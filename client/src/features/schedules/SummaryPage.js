import { useEffect } from "react";

import ScheduleTable from "./ScheduleTable";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useGetSummaryQuery, useGetSchedulesQuery } from "./schedulesApiSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const SummaryPage = () => {
  useTitle("techNotes: Summary Page");

  const { id } = useParams();

  console.log(id);

  const { schedule } = useGetSchedulesQuery("schedulesList", {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[id],
    }),
  });

  console.log(schedule);

  let content;

  content = (
    <div className="midde_cont">
      <div className="container-fluid">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Summary</h2>
            </div>
          </div>
        </div>
        <div className="row column1">
          <div className="col-md-12">
            <div className="white_shd full margin_bottom_30">
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>ITEM</TableCell>
                      <TableCell align="right">UNIT</TableCell>
                      <TableCell align="right">Totals</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedule?.summary?.map((child) => (
                      <TableRow
                        key={child._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Total {child._id}
                        </TableCell>
                        <TableCell align="right">{child.unit}</TableCell>
                        <TableCell component="th" scope="row" align="right">
                          {child.Value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          {/* end row */}
        </div>
      </div>
    </div>
  );

  return content;
};
export default SummaryPage;
