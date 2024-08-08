import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as NGL from 'ngl';
import './ProteinViewer.css';

const ProteinViewer = () => {
    const [pdbIdentifiers, setPdbIdentifiers] = useState([]);
    const [selectedPdbId, setSelectedPdbId] = useState('');
    const [selectedPdbData, setSelectedPdbData] = useState({});
    const [parsedData, setParsedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [showLigand, setShowLigand] = useState(true);
    const [selectedVariation, setSelectedVariation] = useState('');
    const [showSelectPdbId, setShowSelectPdbId] = useState(false);

    const handleFullScreen = () => {
        const modelContainer = document.getElementById('3d-model-container');

        if (modelContainer) {
            if (!document.fullscreenElement) {
                modelContainer.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            setFullscreen(!fullscreen);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('5000_final.csv');
                const text = await response.text();
                const results = Papa.parse(text, { header: true }).data;
                setParsedData(results);

                const uniquePdbIds = [...new Set(results.map(entry => entry.pdbid))];
                setPdbIdentifiers(uniquePdbIds);
            } catch (error) {
                console.error('Error fetching or parsing data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const renderProteinModel = async () => {
            if (!selectedPdbId) {
                return;
            }

            setLoading(true);

            try {
                if (!stage) {
                    const newStage = new NGL.Stage('3d-model-container', { backgroundColor: 'black' });
                    setStage(newStage);
                } else {
                    stage.removeAllComponents();
                }

                const component = await stage.loadFile(`https://files.rcsb.org/download/${selectedPdbId}.pdb`);

                component.addRepresentation('cartoon');

                if (showLigand) {
                    component.addRepresentation('licorice', { sele: 'ligand', scale: 2.0 });
                }

                component.autoView('ligand');

                const details = parsedData.find(entry => entry.pdbid === selectedPdbId);
                setSelectedPdbData(details || {});
                setLoading(false);

                zoomIntoLigand(component, stage);
            } catch (error) {
                console.error('Error loading the PDB file:', error);
                setLoading(false);
            }
        };

        renderProteinModel();
    }, [selectedPdbId, stage, parsedData, showLigand]);

    useEffect(() => {
        setShowSelectPdbId(selectedVariation === 'PLAS-5K');
    }, [selectedVariation]);

    const zoomIntoLigand = (component, stage) => {
        const ligandSelection = component.structure.getAtomSet(new NGL.Selection('ligand'));

        if (ligandSelection.size > 0) {
            const boundingBox = new NGL.Box3();
            component.getCenterBoundingBox(boundingBox, ligandSelection);
            const ligandCenter = boundingBox.getCenter();

            stage.viewer.zoomTo(ligandCenter, boundingBox.getSize());
            stage.viewer.requestRender();
        }
    };

    const handlePdbIdChange = (event) => {
        const selectedId = event.target.value;
        setSelectedPdbId(selectedId);
    };

    const handleZoom = (factor) => {
        if (stage) {
            const viewer = stage.viewer;
            const currentZoom = viewer.camera.position.z;
            const zoomSpeed = Math.abs(currentZoom) * 0.1;
            viewer.camera.position.z += factor * zoomSpeed;
            viewer.requestRender();
        }
    };

    const handleLigandToggle = () => {
        setShowLigand(!showLigand);
    };

    const handleVariationChange = (event) => {
        const selectedVariation = event.target.value;
        setSelectedVariation(selectedVariation);
    };

    return (
        <div className={`container ${fullscreen ? 'fullscreen' : ''}`}>
            <div className="model-controls">
                <select
                    value={selectedVariation}
                    onChange={handleVariationChange}
                    className="dropdown"
                >
                    <option value="">Select Variation</option>
                    <option value="PLAS-5K">PLAS-5K</option>
                    <option value="PLAS-5K Variation 2">PLAS-5K Variation 2</option>
                    <option value="PLAS-5K Variation 3">PLAS-5K Variation 3</option>
                    <option value="APO-Bind">APO-Bind</option>
                </select>
                {showSelectPdbId && (
                    <select
                        value={selectedPdbId}
                        onChange={handlePdbIdChange}
                        className={`dropdown ${selectedPdbId === '' ? 'invalid' : ''}`}
                    >
                        <option value="">Select a PDB ID</option>
                        {pdbIdentifiers.map(id => (
                            <option key={id} value={id}>{id}</option>
                        ))}
                    </select>
                )}
                <button onClick={() => handleZoom(1)}>+</button>
                <button onClick={() => handleZoom(-1)}>-</button>
                <button onClick={handleFullScreen}>Fullscreen</button>
            </div>
            <div className="flex-container">
                <div className="model-container">
                    {loading ? <p>Loading...</p> : null}
                    <div id="3d-model-container" className={`model ${loading ? 'hide' : ''}`}></div>
                </div>
                {selectedPdbId && !loading && (
                    <div className="details-container">
                        <h2>Details for {selectedPdbId}</h2>
                        <ul>
                            {selectedPdbData && Object.keys(selectedPdbData).map(key => (
                                <li key={key}><strong>{key}:</strong> {selectedPdbData[key]}</li>
                            ))}
                        </ul>
                        {selectedVariation === 'PLAS-5K' && (
                            <div className="ligand-checkbox">
                                <label>
                                    Show Ligand Bond
                                    <input
                                        type="checkbox"
                                        checked={showLigand}
                                        onChange={handleLigandToggle}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProteinViewer;
