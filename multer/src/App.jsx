const url = "http://localhost:5000";
import axios from "axios";
import { useState } from "react";
import DisplayImage from "./DisplayImage";
function App() {
  const [file, setFile] = useState();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`${url}/upload`, formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(file);
  };
  return (
    <>
      <h1>Multer practice (used to upload images)</h1>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <input
          type="file"
          name="avatar"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input type="submit" value="submit" />
      </form>
      <DisplayImage />
    </>
  );
}

export default App;
