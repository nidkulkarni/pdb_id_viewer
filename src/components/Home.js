import React, { useState } from 'react';


const Plas5kBox = () => {
  const plas5kData = {
    title: 'PLAS-5K',
    description: 'Accurate prediction of binding affinities between a small molecule and target proteins still remains to be a major challenge. The use of Artificial Intelligence (AI) models has been proposed as an alternative to traditional physics-based scoring functions. Despite many advances in machine learning (ML) models over affinity prediction, they have mainly relied on feature engineering from static 3-Dimensional that often mask the dynamic features of protein-ligand interactions. To this end, we have curated MD-based datasets that provide protein-ligand affinities along with non-covalent interaction components for machine learning applications. Models built over these datasets can help to capture the dynamic binding modes by considering various geometric characteristics of the interaction. PLAS-5k comprises 5000 protein-ligand complexes chosen from the PDB database. The dataset consists of binding affinities along with energy components like electrostatic, van der Waals, polar and non-polar solvation energy calculated from molecular dynamics simulations using MMPBSA (Molecular Mechanics Poisson-Boltzmann Surface Area) method. The initial structures of all the 5000 protein-ligand complexes are available in PDB format, and the CSV file contains information about binding affinity. This work is published in Scientific Data.',
    link: 'https://doi.org/10.1038/s41597-022-01631-9',
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleViewClick = () => {
    // Redirect to the ProteinViewer.js page
    window.location.href = '/ProteinViewer';
  };

  return (
    <div
      style={{
        width: '80%',
        height: '80%',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: isHovered ? '0px 0px 20px 5px rgba(0, 0, 0, 0.5)' : '5px 5px 15px 5px rgba(0, 0, 0, 0.2)',
        transition: 'box-shadow 0.3s',
        overflow: 'auto',
        backgroundColor: 'white',
        color: 'black',
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <h1>{plas5kData.title}</h1>
      <p>
        {plas5kData.description}
      </p>
      <button
        style={{
          display: 'inline-block',
          margin: '10px 0',
          padding: '10px 20px',
          backgroundColor: 'blue',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          border: 'none',
        }}
        onClick={handleViewClick}
      >
        View
      </button>
      <br />
      <span
        style={{
          color: 'blue',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
        onClick={() => window.open(plas5kData.link, '_blank')}
      >
        {' '}
        {plas5kData.link}
      </span>
    </div>
  );
};

const HomePage = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <Plas5kBox />
    </div>
  );
};

export default HomePage;
