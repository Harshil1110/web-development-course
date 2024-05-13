import axios from "axios";
import React, { useEffect, useState } from "react";
const url = "http://localhost:5000";
const DisplayImage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(`${url}/abc`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      {data.map((u) => (
        <div key={u.id}>
          <h1>{u.name}</h1>
          <h1>{u.email}</h1>
          <img src={`${url}/images/uploads/${u.image_url}`} width={100} height={100} />
        </div>
      ))}
    </>
  );
};

export default DisplayImage;
