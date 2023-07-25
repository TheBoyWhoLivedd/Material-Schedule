import { useState } from "react";

const useDeleteModal = () => {
  const [deleteApplicationModalOpen, setDeleteApplicationModalOpen] =
    useState(false);
  const [deleteApplicationItemModalOpen, setDeleteApplicationItemModalOpen] =
    useState(false);

  const handleOpenDeleteApplicationModal = () =>
    setDeleteApplicationModalOpen(true);
  const handleCloseDeleteApplicationModal = () =>
    setDeleteApplicationModalOpen(false);

  const handleOpenDeleteApplicationItemModal = () =>
    setDeleteApplicationItemModalOpen(true);
  const handleCloseDeleteApplicationItemModal = () =>
    setDeleteApplicationItemModalOpen(false);

  return {
    deleteApplicationModalOpen,
    deleteApplicationItemModalOpen,
    handleOpenDeleteApplicationModal,
    handleCloseDeleteApplicationModal,
    handleOpenDeleteApplicationItemModal,
    handleCloseDeleteApplicationItemModal,
  };
};

export default useDeleteModal;
