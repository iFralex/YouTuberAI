"use client"

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from "react-dom";
import { getTranscripts } from './actions';
import { Result } from "@/app/result"

const initialState = {
    message: "",
    result: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" aria-disabled={pending}>
            Add
        </button>
    );
}

export function Form() {
    const [state, formAction] = useActionState(getTranscripts, initialState);

    return (<div>
        <form action={formAction}>
            <label htmlFor="todo">Enter Task</label>
            <input type="text" id="channelId" name="channelId" required />
            <SubmitButton />
            <p aria-live="polite" className="sr-only" role="status">
                {state?.message}
            </p>
            {state.result && <Result videos={state.result} />}
        </form>
    </div>
    );
}

export default Form;