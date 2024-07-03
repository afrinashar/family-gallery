// DeletePhoto.js
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { deletePhoto } from '../api';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
const DeletePhoto = ({}) => {
  const [showModal, setShowModal] = useState(true);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate= useNavigate
  const mutation = useMutation(() => deletePhoto(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('photos');
      console.log('Image created successfully');
      setShowModal(false)
      navigate('/photos');
    },
  });
//console.log(photoId,"iddd");
  const handleDelete = () => {
    mutation.mutate( );
    navigate('/photos');

  };
  const handleClose = () => {
    setShowModal(false);
    navigate('/photos');
  };
  return (
    <>
        <Modal show={showModal} onHide={handleClose}>
<div className="modal-header">
<h2 className='text- modal-title bg-primary text-white m-3'>DELETE photos</h2>
</div>
<div className="modal-body"> <h3>are you sure to delete</h3></div>
<div className="modal-footer">
<button className='btn btn-success'onClick={handleDelete}>DELETE</button>
<button className="btn btn-danger" onClick={handleClose}>CLOSE</button>
</div>
       </Modal>
       
    </>
  );
};

export default DeletePhoto;
