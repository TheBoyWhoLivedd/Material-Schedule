import { useState, useMemo } from "react";
import useTitle from "../../hooks/useTitle";
import { selectScheduleById, useGetSchedulesQuery } from "./schedulesApiSlice";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { Button, Box, Typography, Snackbar } from "@mui/material";
import { grey } from "@mui/material/colors";
import ModalComponent from "../../components/ModalComponent";
import ModalSecondary from "../../components/ModalSecondary";
import MaterialAddForm from "../../components/MaterialAddForm";
import { Plus, Edit, Trash } from "feather-icons-react";
import { useDeleteMaterialMutation } from "./schedulesApiSlice";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import DeleteModal from "../../components/DeleteModal";

const SingleSchedulePage = () => {
  useTitle("techNotes: Single Schedule Page");

  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const openSnackbarWithMessage = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const [selectedChild, setSelectedChild] = useState(null);

  const expandModel = (child) => {
    setSelectedChild(child);
    setOpen1(true);
  };
  const closeModal = () => {
    setSelectedChild(null);
    setOpen1(false);
  };

  const { schedule } = useGetSchedulesQuery("schedulesList", {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[id],
    }),
  });
  // const sortedScheduleMaterials = schedule.materials.sort();
  console.log(schedule);
  const [deleteMaterial] = useDeleteMaterialMutation();

  const onDeleteMaterialClicked = async (materialId) => {
    await deleteMaterial({ id: schedule.id, _id: materialId });
  };
  const [pageSize, setPageSize] = useState(20);
  const [rowId, setRowId] = useState(null);

  const columns = useMemo(() => [
    { field: "materialName", headerName: "Item", width: 170 },
    { field: "elementName", headerName: "Element", width: 200 },
    { field: "materialDescription", headerName: "Description", width: 400 },
    { field: "unit", headerName: "Unit", width: 100 },
    { field: "computedValue", headerName: "Quantity", width: 100 },
    {
      field: "actions",
      headerName: "Edit",
      type: "actions",
      width: 200,
      renderCell: (params) => (
        <Button onClick={() => expandModel(params.row)}>
          <Edit size={20} />
        </Button>
      ),
    },
    {
      field: "action",
      headerName: "Delete",
      type: "actions",
      width: 200,
      renderCell: (params) => (
        // <Button onClick={() => onDeleteMaterialClicked(params.row._id)}>
        //   <Trash size={20} />
        // </Button>
        <DeleteModal
          handleDelete={() => onDeleteMaterialClicked(params.row._id)}
          element="icon"
        />
      ),
    },
  ]);
  let content;

  content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ModalComponent
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          openModal={
            <Button variant="outlined">
              <Plus width={20} />
              Add Materials
            </Button>
          }
          
        >
          <MaterialAddForm
            id={id}
            handleClose={handleClose}
            openSnackbarWithMessage={openSnackbarWithMessage}
          />
        </ModalComponent>

        <div style={{ marginLeft: "1rem" }}>
          <Link to={`/dash/schedules/${id}/summary`}>
            <Button variant="outlined">View Summary</Button>
          </Link>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        message={snackbarMessage}
        autoHideDuration={3000} // closes after 3 seconds
        onClose={closeSnackbar}
        style={{
          width: "500px",
          color: "white !important",
        }}
      />
      <TableContainer component={Paper}>
        <ModalSecondary open={open1} handleClose={closeModal}>
          <MaterialAddForm
            formData={selectedChild}
            id={id}
            handleClose={closeModal}
            openSnackbarWithMessage={openSnackbarWithMessage}
          />
        </ModalSecondary>
        <Box
          sx={{
            height: 580,
            width: "100%",
          }}
        >
          {schedule && (
            <DataGrid
              columns={columns}
              rows={schedule.materials}
              getRowId={(row) => row._id}
              rowsPerPageOptions={[20, 40, 60]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              })}
              sx={{
                [`& .${gridClasses.row}`]: {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? grey[200] : grey[900],
                },
              }}
              onCellEditCommit={(params) => setRowId(params.id)}
            />
          )}
        </Box>
      </TableContainer>
    </div>
  );

  return content;
};
export default SingleSchedulePage;
