import React, { useEffect, useState } from "react";
import "./App.css";
import { loveLanguageQuiz } from "./data";
import axios from "axios";

function App() {
  const [index, setIndex] = useState(0);
  const [ans, setAns] = useState({});
  const [result, setResult] = useState("");
  const [gif, setGif] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState("");
  const [song, setSong] = useState("");
  const [details, setDetails] = useState([]);

  useEffect(() => {
    axios.get("https://love-language.onrender.com/names")
      .then(response => setDetails(response.data.data))
      .catch(error => {
        console.log(error);

      })
  },[])

  function handleSelection(optionType) {
    setAns((prev) => ({
      ...prev,
      [index]: optionType,
    }));
  }

  function handleNameSubmit() {
    if (name.trim() === "") {
      alert("Please enter your name before proceeding!");
      return;
    }
    setSubmitted(true);
  }

  function handleClick() {
    if (!ans[index]) {
      alert("Please select an answer before proceeding!");
      return;
    }

    if (index < loveLanguageQuiz.length - 1) {
      setIndex(index + 1);
    } else {
      console.log("Final Answers:", ans);
      setLoading(true);

      fetch("https://love-language.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, answers: Object.values(ans) }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResult(data.result);
          setGif(data.gif);
          setMsg(data.msg);
          setSong(data.song);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    }
  }

  return (
    <div>
       <div className="container">

{submitted ? (
  loading ? (
    <h2>Processing your responses... ⏳</h2>
  ) : result ? (
    <>
      <h2>{name}, your love language is: {result} 💖</h2>
      <center>
        <img src={gif} alt="Love Language GIF" style={{ width: "300px", borderRadius: "10px" }} />
        <p>{msg}</p>
        <p><strong>Recommended Song:</strong> {song}</p>
      </center>
     

    </>
  ) : (
    <>
      <h2>{index + 1}. {loveLanguageQuiz[index].question}</h2>
      <hr />
      <ul>
        {loveLanguageQuiz[index].options.map((option, i) => (
          <li
            key={i}
            onClick={() => handleSelection(option.type)}
            style={{
              cursor: "pointer",
              background: ans[index] === option.type ? "#ffeb99" : "white",
              padding: "10px",
              marginBottom: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            {option.text}
          </li>
        ))}
      </ul>
      <button onClick={handleClick} type="submit">
        {index < loveLanguageQuiz.length - 1 ? "Next" : "Submit"}
      </button>
      <p>{index + 1} of {loveLanguageQuiz.length} questions</p>
    </>
  )
) : (
  <div>
    <h2>What is your name, Lover? 💕</h2>
    <center>
      <input
        className="loverName"
        type="text"
        placeholder="Type your name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="sub" onClick={handleNameSubmit}>Start Quiz</button>
    </center>
  </div>
)}


</div>
      <div className="loversList">
  
  {details.length > 0 ? (
    details.map((item, index) => (
      
       
         <p key={index}>
        {item.name} - Love Language: {item.lovelanguage}
      </p>
      
     
    ))
  ) : (
    <p>No Lovers detected till now</p>
  )}
</div>
    </div>
   
  );
}

export default App;
