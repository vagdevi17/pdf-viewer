import './App.css';

import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from 'react-pdf';

import PdfComp from './PdfComp';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;



function App() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    const result = await axios.get("http://localhost:5000/get-files");
    console.log(result.data.data);
    setAllImage(result.data.data);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log(title, file);

    const result = await axios.post(
      "http://localhost:5000/upload-files",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(result);
    if(result.data.status==='ok'){
      alert("Uploaded Successfully!!!");
      getPdf();
    }
  };
  const showPdf=(pdf)=>{
    // window.open(`http://localhost:5000/files/${pdf}`,"_blank","noreferrer");
    setPdfFile(`http://localhost:5000/files/${pdf}`)
  };
  return (
    <div className="App">
      <form className="formStyle" onSubmit={submitImage}>
        <h4>Ulpoad Pdf in React</h4>
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          className="form-control"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button class="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <div className="uploaded">
        <h4>Uploaded PDF:</h4>
        <div className="output-div">
          {allImage == null ? "" : allImage.map((data) => {
            return (
              <div className="inner-div" key={data.id}>
                <h6>Title: {data.title}</h6>
                <button className="btn btn-primary" onClick={()=>showPdf(data.pdf)}>Show Pdf</button>
              </div>
            );
          })}
        </div>

      </div>
      <PdfComp pdfFile={pdfFile}/>
    </div>
  );
}

export default App;

