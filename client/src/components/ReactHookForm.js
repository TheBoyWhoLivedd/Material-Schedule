import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Autocomplete from "./Autocomplete";

const ReactHookForm = () => {
    const { register, handleSubmit, errors } = useForm();
    const [choseConcrete, setChoseConcrete] = useState("block");
    const [choseSteel, setChoseSteel] = useState("block");

    const submitForm = (data) => {
        console.log(data);
    };
    return (
        <div className="Form">
            <div className="inputs">
                <form onSubmit={handleSubmit(submitForm)}>
                    <Autocomplete
                        suggestions={[
                            "Cement",
                            "Sand",
                            "Aggregate",
                            "Tiles",
                            "Beams",
                            "Hardcore",
                            "Sections",
                            "Roofing",
                            "Curbstones",
                            "Granite",
                            "Concrete",
                        ]}
                        placeholder="Select Material"
                    />
                    <Autocomplete
                        suggestions={["C25", "C30", "C40"]}
                        placeholder="Select Concrete Class"
                    />
                    <input
                        type="text"
                        name="cum"
                        placeholder="Enter Cubic Metres"
                        {...register("cum", { required: true })}
                    />
                    <Autocomplete
                        suggestions={[
                            "127x76x13",
                            "152x89x16",
                            "178x102x19",
                            "203x102x23",
                            "203x133x25",
                            "203x133x30",
                            "254x102x22",
                            "254x102x25",
                            "254x102x28",
                            "254x146x31",
                            "254x146x37",
                            "254x146x43",
                        ]}
                        placeholder="Select Beam Size"
                    />
                    <input
                        type="text"
                        name="kgm3"
                        placeholder="Enter Total Kilograms"
                        {...register("cum", { required: true })}
                    />
                    <button
                        type="submit"
                        className="button"
                    >
                        Generate
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReactHookForm;
