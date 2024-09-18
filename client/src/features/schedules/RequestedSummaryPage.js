import { useEffect } from "react";

import ScheduleTable from "./ScheduleTable";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useGetSummaryQuery, useGetSchedulesQuery } from "./schedulesApiSlice";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const RequestedSummaryPage = () => {
  const theme = useTheme();
  useTitle("Deemed VAT: Summary Page");

  const { id } = useParams();
  const [searchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const size = parseInt(searchParams.get('size') || '6', 10)
  const search = searchParams.get('search') || ''

  const { schedule } = useGetSchedulesQuery({ page, size, search }, {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[id],
    }),
  });

  const renderTableRows = () => {
    return schedule?.totalRequested?.map((child) => (
      <TableRow
        key={child._id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          Total {child._id} Requested
        </TableCell>
        <TableCell align="right">{child.unit}</TableCell>
        <TableCell component="th" scope="row" align="right">
          {child.amountRequested}
        </TableCell>
      </TableRow>
    ));
  };

  const renderTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ITEM</TableCell>
              <TableCell align="right">UNIT</TableCell>
              <TableCell align="right">Totals</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="container">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {renderTable()}
        </Grid>
      </Grid>
      <style jsx>{`
        .container {
          padding: ${theme.spacing(2)};
        }
      `}</style>
    </div>
  );
};

export default RequestedSummaryPage;
