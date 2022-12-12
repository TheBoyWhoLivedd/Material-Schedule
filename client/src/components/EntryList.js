import { Button } from "@mui/material";
import React from "react";

const EntryList = ({ entries, handleDelete }) => {
  return (
    <ul>
      {entries.map((entry) => (
        <li className="item">
          <Button
            onClick={() => handleDelete(entry.id)}
            role="button"
            tabIndex="0"
            aria-label={`Delete ${entry.item}`}
          ></Button>
        </li>
      ))}
    </ul>
  );
};

export default EntryList;
