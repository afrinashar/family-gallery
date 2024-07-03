import   { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';
import { createPhoto } from '../api';
import { useNavigate } from 'react-router-dom';

const CreatePhoto = () => {
  const [showModal, setShowModal] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(createPhoto, {
    onSuccess: () => {
      queryClient.invalidateQueries('photos');
      console.log('Image created successfully');
      navigate('/photos');
    },
    onError: (error) => {
      console.error('Error creating image:', error.response.data);
    },
  });

  const [photoData, setPhotoData] = useState({
    name: '',
    description: '',
    imageUrl: null,
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', photoData.name);
    formData.append('description', photoData.description);
    formData.append('image', photoData.imageUrl);

    mutation.mutate(formData);
  };

  const handleClose = () => {
    setPhotoData({
      name: '',
      description: '',
      imageUrl: null,
    });
    setShowModal(false);
    navigate('/photos');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhotoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangePhoto = (e) => {
    setPhotoData((prevData) => ({
      ...prevData,
      imageUrl: e.target.files[0],
    }));
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleClose}>
        <div className="modal-header">
          <h3 className="modal-title bg-primary text-white m-3">Create Profile</h3>
          <button type="button" className="close p-2 m-2" onClick={handleClose} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form onSubmit={handleCreate}>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={photoData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={photoData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Upload Image:</label>
              <input
                type="file"
                className="form-control bg-primary"
                id="imageUrl"
                name="imageUrl"
                accept="image/*"
                onChange={handleChangePhoto}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary">
              Create Image
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default CreatePhoto;
