import React, { useState } from "react";
import { evaluate, parse } from "mathjs";

const Bodmas = () => {
  // Use state to store the input value
  const [input, setInput] = useState("");

  // Use state to store the validation error message (if any)
  const [errorMessage, setErrorMessage] = useState("");

  // Use state to store the calculation result (if any)
  const [result, setResult] = useState(null);

  // Regular expression for validating BODMAS strings
  const regex = new RegExp(
    /^[0-9+\-*/().]+$/
  );

  // Event handler for when the input value changes
  const onInputChange = (e) => {
    // Update the input value
    setInput(e.target.value);
    console.log(input);

    // Clear the previous validation error and calculation result
    setErrorMessage("");
    setResult(null);
  };

  // Event handler for when the form is submitted
  const onFormSubmit = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Check if the input value is a valid BODMAS string
    if (regex.test(input)) {
      const results = evaluate(input);
      // Set the calculation result
      setResult(results);
  
    } else {
      // If the input value is not a valid BODMAS string, show an error message
      setErrorMessage("Invalid input. Please enter a valid BODMAS expression.");
      console.log(errorMessage);
    }
  };
  return (
    <>
      <label>
        BODMAS Expression:
        <input type="text" value={input} onChange={onInputChange} />
      </label>
      <input type="submit" value="Calculate" onClick={onFormSubmit} />
      {errorMessage && <p>{errorMessage}</p>}
      {result !== null && <p>Result: {result}</p>}
    </>
  );
};

export default Bodmas;

// export function BODMASInput() {
//   // Use state to store the input value
//   const [input, setInput] = useState("");

//   // Use state to store the validation error message (if any)
//   const [errorMessage, setErrorMessage] = useState("");

//   // Use state to store the calculation result (if any)
//   const [result, setResult] = useState(null);

//   // Regular expression for validating BODMAS strings
//   const regex = /^(?:\s*\d+(?:\s*[+*/-]\s*\d+)*\s*)$/;

//   // Event handler for when the input value changes
//   const onInputChange = (event) => {
//     // Update the input value
//     setInput(event.target.value);

//     // Clear the previous validation error and calculation result
//     setErrorMessage("");
//     setResult(null);
//   };

//   // Event handler for when the form is submitted
//   const onFormSubmit = (event) => {
//     // Prevent the default form submission behavior
//     event.preventDefault();

//     // Check if the input value is a valid BODMAS string
//     if (regex.test(input)) {
//       // If it is, parse the input string and calculate the result
//       const tokens = input.split(/\s*([+*/-])\s*/);
//       let stack = [];
//       for (const token of tokens) {
//         if (token === "+") {
//           const b = stack.pop();
//           const a = stack.pop();
//           stack.push(a + b);
//         } else if (token === "-") {
//           const b = stack.pop();
//           const a = stack.pop();
//           stack.push(a - b);
//         } else if (token === "*") {
//           const b = stack.pop();
//           const a = stack.pop();
//           stack.push(a * b);
//         } else if (token === "/") {
//           const b = stack.pop();
//           const a = stack.pop();
//           stack.push(a / b);
//         } else {
//           stack.push(parseInt(token));
//         }
//       }

//       // Set the calculation result
//       setResult(stack.pop());
//       console.log(result)
//     } else {
//       // If the input value is not a valid BODMAS string, show an error message
//       setErrorMessage("Invalid input. Please enter a valid BODMAS expression.");
//       console.log(errorMessage)
//     }
//   };

//   return (
//     <form onSubmit={onFormSubmit}>
//       <label>
//         BODMAS Expression:
//         <input type="text" value={input} onChange={onInputChange} />
//       </label>
//       <input type="submit" value="Calculate" />
//       {errorMessage && <p>{errorMessage}</p>}
//       {result !== null && <p>Result: {result}</p>}
//     </form>
//   );
// }
