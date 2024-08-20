import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getPhotos } from '../api';
import Spinner from '../modules/spinner';
import { Button, Modal, Image, Pagination, DropdownButton, Dropdown } from 'react-bootstrap';
import { FaArrowAltCircleDown } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { saveAs } from "file-saver";

import "./Photo.css";

const PhotoList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortBy, setSortBy] = useState('name'); // Default sort by name
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order ascending
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [edit, setEdit] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(''); // State for category filter

  const { data: photosData, isLoading, isError, isFetching } = useQuery(
    ['photos', searchTerm, page, sortBy, sortOrder, selectedCategory],
    () => getPhotos(searchTerm, page, limit, sortBy, sortOrder, selectedCategory),
    { keepPreviousData: true }
  );

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
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
    const url = `https://family-gallery-backend-gb9l.onrender.com${imageUrl}`;
    let download = `${title}.jpg`;
    saveAs(url, download);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);  
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div>Error fetching photos</div>;
  }

  if (!photosData || !photosData.docs) {
    console.error('Unexpected response structure:', photosData);
    return <div>Unexpected error occurred</div>;
  }

  const { docs: photos, totalPages } = photosData;

  // Apply search and category filters to photos
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = searchTerm === '' || Object.values(photo).join('').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || photo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div>
        <nav className="navbar top-0 navbar-light sticky-top bg-primary shadow-sm">
          <div className="container-fluid">
            <Link to="/photos/create" className="btn btn-outline-light">Add Photo</Link>
            {/* <h1 className="navbar-brand text-light">Photo Gallery</h1> */}
            <form
              className="d-flex input-group w-auto"
              onSubmit={(e) => e.preventDefault()} // Prevent form submission (page reload)
            >
              <input
                className="form-control rounded"
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </form>
            <DropdownButton id="category-dropdown" title="Select Category" variant="primary" className="ms-3">
              <Dropdown.Item onClick={() => handleCategoryChange('')}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategoryChange('fero')}>FERO</Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategoryChange('leo')}>LEO</Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategoryChange('pio')}>PIO</Dropdown.Item>
              <Dropdown.Item onClick={() => handleCategoryChange('rabi')}>RABISON</Dropdown.Item>
            </DropdownButton>
            <DropdownButton id="sort-dropdown" title={`Sort by ${sortBy}`} variant="primary" className="ms-3">
              <Dropdown.Item onClick={() => handleSort('name')}>Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('date')}>Date {sortBy === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}</Dropdown.Item>
            </DropdownButton>
          </div>
        </nav>
        <div className="row g-3 p-4 content">
          {filteredPhotos.map((photo) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={photo._id}>
              <div className="card border-0" onClick={() => handleItemClick(photo)}>
                <img
                  src={`https://family-gallery-backend-gb9l.onrender.com${photo.imageUrl}`}
                  alt={photo.title}
                  className="card-img-top img-fluid"
                  style={{ objectFit: 'cover', height: '200px' }}
                />
              </div>
            </div>
          ))}
        </div>
        <Pagination className="justify-content-center mt-4">
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
        <Modal show={show} onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title className='text-light'>{edit.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image
              src={`https://family-gallery-backend-gb9l.onrender.com${edit.imageUrl}`}
              alt={edit.title}
              className="img-fluid w-100 mb-4"
            />
            <h6>Description:</h6>
            <p>{edit.description}</p>
            <div><strong>Created Date:</strong> {edit.createdAt.slice(0, 10)}</div>
            <div><strong>Time:</strong> {edit.createdAt.slice(11, 19)}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={() => handleDownload(edit.imageUrl, edit.name)}>
              <FaArrowAltCircleDown />
            </Button>
            <DropdownButton align="end" variant="primary">
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
