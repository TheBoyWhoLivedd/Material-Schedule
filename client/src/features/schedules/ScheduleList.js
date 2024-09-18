// ScheduleList.jsx

import React, { useEffect } from "react";
import { useGetSchedulesQuery } from "./schedulesApiSlice";
import useTitle from "../../hooks/useTitle";
import Schedule from "./Schedule";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import {
  Card,
  Skeleton,
  Typography,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

const ScheduleList = () => {
  useTitle("Deemed VAT: Schedule List");

  // Manage URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract page and size from search params or default values
  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 6;

  // Fetch schedules with current page and size
  const {
    data: schedules,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSchedulesQuery({ page, size });

  let content;

  if (isLoading) {
    content = (
      <Grid container spacing={4}>
        {[...Array(size)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: "100%", p: 2 }}>
              <Skeleton variant="rectangular" height={118} />
              <Skeleton variant="text" height={40} width="80%" sx={{ mt: 2 }} />
              <Skeleton variant="text" height={20} width="60%" />
              <Skeleton variant="text" height={20} width="60%" />
              <Skeleton variant="text" height={20} width="40%" />
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  } else if (isError) {
    content = (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error?.data?.message || "An error occurred."}
        </Typography>
      </Container>
    );
  } else if (isSuccess) {
    const { ids, entities, totalPages, currentPage } = schedules;

    const ScheduleContent = ids.length ? (
      ids.map((scheduleId) => (
          <Schedule schedule={entities[scheduleId]} key={scheduleId} />
      ))
    ) : (
      <Typography variant="h6">No schedules available.</Typography>
    );

    const handlePageChange = (event, value) => {
      setSearchParams({ page: value, size });
    };

    const handleSizeChange = (event) => {
      const newSize = event.target.value;
      setSearchParams({ page: 1, size: newSize });
    };

    content = (
      <>
        <Typography
          variant="h4"
          sx={{ color: (theme) => theme.palette.text.primary, mb: 2 }}
        >
          Project List
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {ScheduleContent}
        </Grid>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
          />

          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="page-size-label">Page Size</InputLabel>
            <Select
              labelId="page-size-label"
              value={size}
              onChange={handleSizeChange}
              label="Page Size"
            >
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={24}>24</MenuItem>
              <MenuItem value={48}>48</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </>
    );
  }

  return <>{content}</>;
};

export default ScheduleList;
