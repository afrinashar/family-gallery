import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getPhotos } from '../api';
import Spinner from '../modules/spinner';
import { Button, Modal, Image, Pagination, DropdownButton, Dropdown } from 'react-bootstrap';
import { FaArrowAltCircleDown } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const PhotoList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [edit, setEdit] = useState(null);
  const [show, setShow] = useState(false);

  const { data: photosData, isLoading, isError, isFetching } = useQuery(
    ['photos', searchTerm, page, sortBy, sortOrder],
    () => getPhotos(searchTerm, page, limit, sortBy, sortOrder),
    { keepPreviousData: true }
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to the first page when search term changes
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1); // Reset to the first page when sort field changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemClick = (photo) => {
    setEdit(photo);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleDownload = (imageUrl, title) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || isFetching) {
    return <Spinner />;
  }

  if (isError) {
    return <div>Error fetching photos</div>;
  }

  // Check if photosData is defined and has the expected structure
  if (!photosData || !photosData.docs) {
    console.error('Unexpected response structure:', photosData);
    return <div>Unexpected error occurred</div>;
  }

  const { docs: photos, totalDocs, totalPages } = photosData;
console.log(photosData);
  return (
    <>
      <div>
        <nav className="navbar top-0 navbar-light sticky-top bg-primary">
          <div className="container-fluid">
            <Link to="/photos/create" className="btn btn-outline-light">Add Photo</Link>
            <h1 className="text-white">Photo Gallery</h1>
            <form className="d-flex input-group w-auto">
              <input
                className="form-control rounded"
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </form>
          </div>
        </nav>
        <div className="row p-5">
          <div className="d-flex justify-content-end mb-3">
            <Button variant="link" onClick={() => handleSort('name')}>
              Sort by Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
            <Button variant="link" onClick={() => handleSort('createdAt')}>
              Sort by Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
          </div>
          {photos.map((photo) => (
            <div className="col-lg-4 col-sm-12" key={photo._id}>
              <Link className="Link" onClick={() => handleItemClick(photo)}>
                <div className="card p-3 shadow mb-5 bg-body rounded">
                  <img src={`https://photo-gallery-nxf3.onrender.com${photo.imageUrl}`} alt={photo.title} className="mw-100 hover hover-shadow border-dark shadow-1-strong rounded mb-4" />
                  <div className="card-title">{photo.name}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <Pagination className="justify-content-center">
          {Array.from({ length: totalPages }).map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === page}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
      {edit && (
        <Modal show={show} key={edit._id} className="shadow p-3 mb-5 bg-body rounded" onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title className="text-white">{edit.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="bg-image hover-zoom">
              <Image className="w-100" src={`https://photo-gallery-nxf3.onrender.com${edit.imageUrl}`} />
            </div>
       <h6>Description :</h6>  <p className='pl-5 ml-5'>  {edit.description}</p> 
        <div className='float-left'>  <h6 >Created Date</h6>  {edit.createdAt.slice(0,10)}   </div>  
        <h6 >Time</h6>  {edit.createdAt.slice(11,19)}   

          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>Close</Button>
            <FaArrowAltCircleDown className='' variant="primary" type="button" onClick={() => handleDownload(edit.imageUrl, edit.title)} />
            <DropdownButton>
              <Dropdown.Item as={Link} to={`/photos/update/${edit._id}`}>Update</Dropdown.Item>
              <Dropdown.Item as={Link} to={`/photos/delete/${edit._id}`}>Delete</Dropdown.Item>
            </DropdownButton>
           </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default PhotoList;
