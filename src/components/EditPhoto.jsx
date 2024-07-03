import   { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query';
import { getPhotoById, updatePhoto } from '../api'; // Assuming you have an API function to get and update a photo
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const UpdatePhoto = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams()
  const { data: existingPhoto, isLoading: photoLoading } = useQuery(
    ['getPhoto', id],
    () => getPhotoById(id)
  );

  const mutation = useMutation(updatePhoto(id), {
    onSuccess: () => {
      console.log('Image updated successfully');
      setShowModal(false);
      navigate('/photos');
    },
    onError: (error) => {
      console.error('Error updating image:', error);
    },
  });

  const [photoData, setPhotoData] = useState({
    name: '',
    description: '',
    imageUrl: null,
  });

  useEffect(() => {
    if (existingPhoto) {
      setPhotoData({
        name: existingPhoto.name,
        description: existingPhoto.description,
        // You might want to handle the image separately depending on your use case
      });
    }
  }, [existingPhoto]);

  const handleUpdate = (e) => {
    e.preventDefault();
    mutation.mutate({ id, data: id });
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/photos');
  };
  console.log(photoData,"ext",id);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setPhotoData((prevData) => ({
      ...prevData,
      [name]: name === 'imageUrl' ? files[0] : value,
    }));
  };

  if (photoLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Modal show={showModal} onHide={handleClose}>
        <div className="modal-header bg-primary">
          <h3 className="modal-title text-white m-3">Edit Profile</h3>
          <button
            type="button"
            className="close p-2 m-2"
            onClick={handleClose}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form onSubmit={handleUpdate}>
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
            {/* You might want to handle the image separately based on your use case */}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary">
              Update Image
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default UpdatePhoto;
