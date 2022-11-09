import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Autocomplete } from "@mui/material/Autocomplete";
import { Box } from "@mui/system";

function LiveSearch() {
  const [jsonResults, setJsonResults] = useState([]);

  useEffect(() => {
    fetch("https://www.balldontlie.io/api/v1/players")
      .then((response) => response.json())
      .then((json) => setJsonResults(json.data));
  }, []);
  console.log(jsonResults);

  return (
    <div>
      <Stack sx={{ width: 300, margin: "auto" }}>
        <Autocomplete
          id="nba_player-demo"
          getOptionLabel={(jsonResults) =>
            `${jsonResults.first_name} ${jsonResults.last_name}`
          }
          options={jsonResults}
          sx={{ width: 300 }}
          isOptionEqualToValue={(option, value) =>
            option.first_name === value.first_name
          }
          noOptionsText={"Not Available"}
          renderOption={(props, jsonResults) => (
            <Box>
              {jsonResults.first_name} {jsonResults.last_name}
            </Box>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Search for a player" />
          )}
        />
      </Stack>
    </div>
  );
}

export default LiveSearch;
