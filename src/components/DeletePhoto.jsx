import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { deletePhoto } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const DeletePhoto = () => {
  const [showModal, setShowModal] = useState(true);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();

  const mutation = useMutation(() => deletePhoto(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('photos'); // Invalidate the photos query to refetch the list
      console.log('Photo deleted successfully');
      setShowModal(false);
      navigate('/photos');
    },
    onError: (error) => {
      console.error('Error deleting photo:', error);
       
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/photos');
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <div className="modal-header">
          <h3 className='text-modal-title bg-primary text-white m-3'>DELETE PHOTO</h3>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this photo?</p>
        </div>
        <div className="modal-footer">
          <button className='btn btn-primary' onClick={handleDelete} disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Deleting...' : 'DELETE'}
          </button>
          <button className="btn btn-danger" onClick={handleClose}>CLOSE</button>
        </div>
      </Modal>
    </>
  );
};

export default DeletePhoto;
