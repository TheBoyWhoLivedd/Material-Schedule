import EntryList from "./EntryList";

const Content = ({ entries, handleCheck, handleDelete, handleChange }) => {
  console.log(entries);
  return (
    <>
      {entries?.length ? (
        <EntryList
          entries={entries}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
          handleChange={handleChange}
        />
      ) : (
        <p style={{ marginTop: "2rem" }}>Your list is empty.</p>
      )}
    </>
  );
};

export default Content;
