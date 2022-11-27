import React, { Fragment, useState } from "react";

const Autocomplete = ({ suggestions, placeholder }) => {
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userInput, setUserInput] = useState("");

    const onChange = (e) => {
        const userInput = e.currentTarget.value;
        const newFilteredSuggestions = suggestions.filter(
            (suggestion) =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        setActiveSuggestion(0);
        setFilteredSuggestions(newFilteredSuggestions);
        setShowSuggestions(true);
        setUserInput(e.currentTarget.value);
    };

    const onClick = (e) => {
        setActiveSuggestion(0);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setUserInput(e.currentTarget.innerText);
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            setActiveSuggestion(0);
            setShowSuggestions(false);
            setUserInput(filteredSuggestions[activeSuggestion]);
        } else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }
            setActiveSuggestion(activeSuggestion - 1);
        } else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }
            setActiveSuggestion(activeSuggestion + 1);
            // console.log(activeSuggestion);
        }
    };

    let suggestionsListComponent;
    if (showSuggestions && userInput) {
        if (filteredSuggestions.length) {
            suggestionsListComponent = (
                <ul className="suggestions">
                    {filteredSuggestions.map((suggestion, index) => {
                        let className;

                        // Flag the active suggestion with a class
                        if (index === activeSuggestion) {
                            className = "suggestion-active";
                        }

                        return (
                            <li
                                className={className}
                                key={suggestion}
                                onClick={onClick}
                            >
                                {suggestion}
                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            suggestionsListComponent = (
                <div className="no-suggestions">
                    <em>No suggestions, you're on your own!</em>
                </div>
            );
        }
    }

    return (
        <Fragment>
            <input
                type="text"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={userInput}
                placeholder={placeholder}
            />
            {suggestionsListComponent}
        </Fragment>
    );
};

export default Autocomplete;
