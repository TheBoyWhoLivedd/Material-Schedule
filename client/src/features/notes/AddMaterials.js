import ReactHookForm from "../../components/ReactHookForm";
import useTitle from "../../hooks/useTitle";

const AddMaterials = () => {
    useTitle("materialSchedule: Add Materials");

    return (
        <>
        <ReactHookForm/>
        </>
    )
};
export default AddMaterials;
