import React from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Autocomplete from "./Autocomplete";

const ReactHookForm = () => {
    const { register, handleSubmit, errors } = useForm();

    const submitForm = (data) => {
        console.log(data);
    };
    return (
        <div className="Form">
            <div className="inputs">
                <form onSubmit={handleSubmit(submitForm)}>
                    <input
                        type="text"
                        name="firstName"
                        {...register("firstName", { required: true })}
                        placeholder="Select Material..."
                    />
                    {/* <p> {errors.firstName?.message} </p> */}
                    <input
                        type="text"
                        name="lastName"
                        placeholder="..."
                        {...register("lastName", { required: true })}
                    />
                    {/* <p> {errors.lastName?.message} </p> */}
                    <input
                        type="text"
                        name="material"
                        placeholder="..."
                        {...register("material", { required: true })}
                    />
                    {/* <p> {errors.email?.message} </p> */}
                    <input
                        type="text"
                        name="age"
                        placeholder="..."
                        {...register("age", { required: true })}
                    />
                    {/* <p> {errors.age?.message} </p> */}
                    <input
                        type="password"
                        name="concreteClass"
                        placeholder="..."
                        {...register("concreteClass", { required: true })}
                    />
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
                        ]}
                    />
                </form>
            </div>
        </div>
    );
};

export default ReactHookForm;
