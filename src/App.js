import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import './App.css';
import axios from 'axios';

function App() {
  const [selectedFiles, setSelectedFiles] = useState(new File([], ''));
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFiles && selectedFiles.size === 0) {
      toast.error('Por favor selecciona al menos un archivo');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFiles);
    const res = axios.post('http://localhost:3000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setLoading(false);
    toast.promise(res, {
      loading: 'Subiendo archivos...',
      success: 'Archivos subidos correctamente',
      error: 'Hubo un error en la carga de tus archivos',
    });

    // setSelectedFiles(new File([], ''));
  };

  return (
    <div className="containerUpload">
      <Toaster />
      <h1 className="title">IPFS Upload Archives</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="inputFile" className="custom-input-file">
          Seleccionar archivo
        </label>
        <input
          disabled={loading}
          type="file"
          id="inputFile"
          name="inputFile"
          className="input-file-hidden"
          onChange={handleFileChange}
          multiple
          accept=".jpg, .jpeg, .png, .mp4, .mp3"
        />
        <span id="fileName"></span>
        <button disabled={loading} type="submit" className="button">
          Enviar
        </button>
      </form>
      {selectedFiles instanceof File && selectedFiles.size === 0 && (
        <span>No has seleccionado ningun archivo</span>
      )}
      {selectedFiles instanceof File && selectedFiles.size > 0 && (
        <span>Archivo seleccionado: {selectedFiles.name}</span>
      )}

      <span className="compatibility">
        Tipos de archivos compatibles: JPG, JPEG, PNG, MP3, MP4
      </span>
    </div>
  );
}

export default App;
