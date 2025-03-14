import React, { useContext, useEffect, useState } from 'react';
import { TheatreContext } from '../../hooks/controller';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { CgTrash } from 'react-icons/cg';
import { MdEditSquare } from 'react-icons/md';
import { RiSearchLine } from 'react-icons/ri';

function Theatre() {
  const {  theatres, getTheatres,searchTheatre, deleteTheatre,setEditTheatre } = useContext(TheatreContext)
  const navigate = useNavigate();
  const [theatreName, setTheatreName] = useState('');

  console.log(theatres);

  const search = () => {
    const data = { name: theatreName };
    searchTheatre(data);
  };

  useEffect(() => {
    if (theatreName.length === 0) {
      getTheatres();
    }
  }, [theatreName]); 

  return (
    <div className='theatre'>
      <div className='theatreHeader'>
        <div className='adsearch'>
          <label htmlFor='theatreName'>Theatre: </label>
          <input
            type='text'
            id='theatreName'
            placeholder='Theatre name'
            value={theatreName}
            onChange={(e) => setTheatreName(e.target.value)}
          />
          <button type='submit' className='aSearch' onClick={search}>
            <RiSearchLine size={30} />
          </button>
        </div>
        <button className='create' onClick={() => navigate('/adminhome/createTheatre')}>
          New Theatre <IoMdAdd size={20} />
        </button>
      </div>
      {theatres.length ? (
        theatres.map((theatre, index) => (
          <div key={index} className='theatreItem'>
            <div className='info'>
              <div>{theatre.name}</div>
              <div>{theatre.location}</div>
              <div>{theatre.capacity}</div>

              <div className='row'>
                <button
                  className='edit'
                  onClick={() => {
                    setEditTheatre(theatre);
                    navigate('/adminhome/EditTheatre');
                  }}
                >
                  Edit <MdEditSquare size={25} />
                </button>
                <button className='delete' onClick={() => deleteTheatre(theatre._id)}>
                  Delete <CgTrash size={25} />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Theatre not found</p>
      )}
    </div>
  );
}

export default Theatre;
