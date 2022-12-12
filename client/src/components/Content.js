import EntryList from "./EntryList";

const Content = ({ entries, handleCheck, handleDelete }) => {
  return (
    <>
      {entries?.length ? (
        <EntryList
          items={entries}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />
      ) : (
        <p style={{ marginTop: "2rem" }}>Your list is empty.</p>
      )}
    </>
  );
};

export default Content;
