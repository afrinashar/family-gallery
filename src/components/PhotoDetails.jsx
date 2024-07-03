// PhotoDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getPhotoById } from '../api';
import { useState } from 'react';
import { Modal,Button,DropdownButton } from 'react-bootstrap';
//import { CiBoxList } from "react-icons/ci";
const PhotoDetails = ({queryKey}) => {
  const [show, setShow] = useState(false);
 // const { photoId } = useParams();


 const photoId =queryKey[1]
  const { data: photo, isLoading, isError } = useQuery(['photo', photoId], () => getPhotoById(photoId));

  if (isLoading) {
    return <div className="spinner-border text-primary" role="status">
  <h1 className="visually-hidden bg-secondary">Loading...</h1>
</div>
  }

  if (isError) {
    return <div>Error fetching photo details</div>;
  }
 //  console.log(edit,"edit")
//console.log(ids,"dsatsa");
const handleClose = () => setShow(false);
  return (
    <div>
      <h1>gy</h1>
      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
         
          <Modal.Title> {photoId.name} </Modal.Title>
        </Modal.Header>
        <Modal.Body> <Image    src={photoId.imageUrl} fluid /> </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={() => handleDownload(photo.imageUrl, photo.title)}>
            Download
          </Button>
          
              <DropdownButton icon={<CiBoxList />}  >

      <Dropdown.Item  >    <Link to={`/update/${photo._id}`}>Update</Link> </Dropdown.Item>
      <Dropdown.Item className='bg-danger text-white b-2' href="/delete:id">Delete</Dropdown.Item>
  
    </DropdownButton>
        </Modal.Footer>
      </Modal>
 
    </div>
  );
};

export default PhotoDetails;
