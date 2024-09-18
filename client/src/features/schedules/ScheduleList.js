// ScheduleList.jsx

import React, { useEffect, useState, useCallback } from "react";
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
  TextField,
  InputAdornment,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash"; // Import lodash debounce
import { GridSearchIcon } from "@mui/x-data-grid";

const ScheduleList = () => {
  useTitle("Deemed VAT: Schedule List");

  // Manage URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract page, size, and search from search params or default values
  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 6;
  const initialSearch = searchParams.get("search") || "";

  // Local state for search input
  const [searchInput, setSearchInput] = useState(initialSearch);

  // Debounce search input using lodash.debounce
  const debouncedSetSearch = useCallback(
    debounce((value) => {
      // Update search params: set page to 1, update search, preserve size
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", 1);
        newParams.set("search", value);
        newParams.set("size", size);
        return newParams;
      });
    }, 500),
    [setSearchParams, size]
  );

  // Handle search input changes
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    debouncedSetSearch(event.target.value);
  };

  // Fetch schedules with current page, size, and search
  const {
    data: schedules,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSchedulesQuery({ page, size, search: initialSearch });

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
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", value);
        newParams.set("size", size);
        // Preserve the current search query
        if (searchInput) {
          newParams.set("search", searchInput);
        } else {
          newParams.delete("search");
        }
        return newParams;
      });
    };

    const handleSizeChange = (event) => {
      const newSize = event.target.value;
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("size", newSize);
        newParams.set("page", 1); // Reset to first page when size changes
        // Preserve the current search query
        if (searchInput) {
          newParams.set("search", searchInput);
        } else {
          newParams.delete("search");
        }
        return newParams;
      });
    };

    content = (
      <>
        <Typography
          variant="h4"
          sx={{
            color: (theme) => theme.palette.text.primary,
            mb: 3,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          Project List
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            },
          }}
        >
          <TextField
            label="Search schedules"
            variant="outlined"
            fullWidth
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Enter keywords..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GridSearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
          />
        </Box>

        {/* Schedule Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {ScheduleContent}
        </Grid>

        {/* Pagination and Page Size Controls */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ alignSelf: { xs: "center", sm: "flex-start" } }}
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
