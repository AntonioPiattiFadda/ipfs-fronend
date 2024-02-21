import { useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import "./App.css";
import axios from "axios";

function App() {
  const [selectedFiles, setSelectedFiles] = useState(new File([], ""));
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState("");
  const [txLink, setTxLink] = useState("");
  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files[0]);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (selectedFiles && selectedFiles.size === 0) {
      toast.error("Please select at least one file");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFiles);

    // Display a loading toast
    let toastId = toast.loading("Uploading files...");

    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Assuming the API returns a JSON object with the IpfsHash
      const ipfsHash = response.data.IpfsHash;
      setTxLink(response.data.transactionHash);
      setHash(ipfsHash);
      // Dismiss the loading toast with a success message
      toast.dismiss(toastId);
      toast.success(`File uploaded succesfully`);
    } catch (error) {
      // Dismiss the loading toast with an error message
      toast.dismiss(toastId);
      toast.error("Error uploading the file");
    } finally {
      setLoading(false);
    }
  }
  const handleRedirection = (hash) => {
    // Define the base URL of the IPFS gateway
    const baseUrl = "https://ipfs.io/ipfs/";
    // Concatenate the base URL with the hash
    const fullUrl = `${baseUrl}${hash}`;
    // Open the full URL in a new tab
    window.open(fullUrl, "_blank");
  };
  const handleGoTo = (link) => {
    // Open the full URL in a new tab
    window.open(link, "_blank");
  };
  return (
    <>
      <div className="containerUpload">
        <Toaster />
        <h1 className="title">IPFS Upload Archives</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="inputFile" className="custom-input-file">
            Select file
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
            Send
          </button>
        </form>
        {selectedFiles instanceof File && selectedFiles.size === 0 && <span>You haven't select any file</span>}
        {selectedFiles instanceof File && selectedFiles.size > 0 && <span>File selected: {selectedFiles.name}</span>}

        <span className="compatibility">Compatible formats: JPG, JPEG, PNG, MP3, MP4</span>
        <p className="hash">Resulting Hash: {hash}</p>
        <button
          className="contractButton"
          onClick={() => handleGoTo("https://testnet.bscscan.com/address/0x7517FfAfF0F6C48c702eaA5eDEd5950c6fE2053b#readContract")}
        >
          See Smart Contract
        </button>
        <button className="linkButton" disabled={hash == ""} onClick={() => handleRedirection(hash)}>
          See file on browser
        </button>
        <button className="txButton" disabled={hash == ""} onClick={() => handleGoTo("https://testnet.bscscan.com/tx/" + txLink)}>
          See transaction on block explorer
        </button>
      </div>
    </>
  );
}

export default App;
