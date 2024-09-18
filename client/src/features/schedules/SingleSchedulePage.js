import { useState, useMemo } from "react";
import useTitle from "../../hooks/useTitle";
import { selectScheduleById, useGetSchedulesQuery } from "./schedulesApiSlice";
import { useParams, useSearchParams } from "react-router-dom";
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
import useSnackbar from "../../hooks/useSnackbar";

const SingleSchedulePage = () => {
  useTitle("Deemed VAT: Single Schedule Page");

  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [open1, setOpen1] = useState(false);
  const {
    openSnackbar,
    snackbarMessage,
    openSnackbarWithMessage,
    closeSnackbar,
  } = useSnackbar();

  const handleOpen = () => setOpen(true);
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);

  const handleClose = () => setOpen(false);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const [selectedChild, setSelectedChild] = useState(null);

  const expandModel = (child) => {
    setSelectedChild(child);
    setOpen1(true);
  };
  const closeModal = () => {
    setSelectedChild(null);
    setOpen1(false);
  };

  const [searchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const size = parseInt(searchParams.get('size') || '6', 10)

  const { schedule } = useGetSchedulesQuery({ page, size }, {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[id],
    }),
  });

  console.log(schedule);
  const [deleting, setIsDeleting] = useState(false);
  const [deleteMaterialId, setDeleteMaterialId] = useState(null);
  const [deleteMaterial] = useDeleteMaterialMutation();
  const onDeleteMaterialClicked = async (materialId) => {
    try {
      setIsDeleting(true);
      const response = await deleteMaterial({
        id: schedule.id,
        _id: deleteMaterialId,
      });
      if (response.data.isError) {
        console.log(`Error: ${response.message}`);
        openSnackbarWithMessage(`Error: ${response.data.message}`);
      } else {
        openSnackbarWithMessage(`Material Deleted`);
      }
    } catch (error) {
      openSnackbarWithMessage(`Error: ${error.message}`);
    } finally {
      setIsDeleting(false);
      handleCloseDeleteModal();
      setDeleteMaterialId(null);
    }
  };
  const [pageSize, setPageSize] = useState(40);
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
        <Button
          onClick={() => {
            setDeleteMaterialId(params.row._id);
            handleOpenDeleteModal();
          }}
          color="secondary"
        >
          <Trash size={20} />
        </Button>
      ),
    },
  ]);

  const deleteModal = (
    <DeleteModal
      deleting={deleting}
      handleOpenDeleteModal={handleOpenDeleteModal}
      handleCloseDeleteModal={handleCloseDeleteModal}
      openDeleteModal={openDeleteModal}
      handleDelete={onDeleteMaterialClicked}
      element="icon"
    />
  );
  let content;

  content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Typography sx={{ color: (theme) => theme.palette.text.primary }}>
        Materials List (Click Add Materials to add a Material or View Summary to
        view aggregations)
      </Typography>
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
          <Link to={`/dash/schedules/${id}/summary?page=${page}&size=${size}`}>
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
            <>
              <DataGrid
                columns={columns}
                rows={schedule.materials}
                rowHeight={30}
                getRowId={(row) => row._id}
                rowsPerPageOptions={[40, 80, 100]}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                getRowSpacing={(params) => ({
                  top: params.isFirstVisible ? 0 : 5,
                  bottom: params.isLastVisible ? 0 : 5,
                })}
                sx={{
                  "& .MuiDataGrid-cell": {
                    fontSize: "0.8rem",
                    padding: "8px",
                    borderBottom: "none",
                  },
                  "& .MuiDataGrid-row": {
                    height: "32px",
                  },
                }}
                onCellEditCommit={(params) => setRowId(params.id)}
              />
            </>
          )}
        </Box>
      </TableContainer>
    </div>
  );
  return (
    <>
      {content}
      <div
        style={{
          display: "none",
        }}
      >
        {deleteModal}
      </div>
    </>
  );
};
export default SingleSchedulePage;
