import React from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
                        placeholder="Last Name..."
                        {...register("lastName", { required: true })}
                    />
                    {/* <p> {errors.lastName?.message} </p> */}
                    <input
                        type="text"
                        name="email"
                        placeholder="Email..."
                        {...register("email", { required: true })}
                    />
                    {/* <p> {errors.email?.message} </p> */}
                    <input
                        type="text"
                        name="age"
                        placeholder="Age..."
                        {...register("age", { required: true })}
                    />
                    {/* <p> {errors.age?.message} </p> */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password..."
                        {...register("password", { required: true })}
                    />
                </form>
            </div>
        </div>
    );
};

export default ReactHookForm;
