import MaterialAddForm from "../../components/MaterialAddForm";
import useTitle from "../../hooks/useTitle";

const AddMaterialsPage = () => {
    useTitle("materialSchedule: Add Materials");

    return <MaterialAddForm />;
};
export default AddMaterialsPage;
