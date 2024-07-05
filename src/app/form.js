"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useActionState, useTransition } from 'react';
import { useForm } from "react-hook-form"

import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormRootError,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading"
import { getChannelData } from './actions';
import { Result } from "@/app/result"
import { CreateDialog } from "@/app/createScriptDialog"

const formSchema = z.object({
    channel_id: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export function MainForm() {
    const [pending, startTransition] = useTransition();
    const [channelData, setChannelData] = useState({})

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            channel_id: "UCHi6Q3Z-5oJUC691WLlSntA",
        },
    })
    console.log(form)
    // 2. Define a submit handler.
    function onSubmit(values) {
        console.log(values)
        startTransition(async () => {
            let res = await getChannelData(values.channel_id)
            console.log("res: ", res)
            if (!res.error)
                setChannelData(res)
            else
                form.setError("root.serverError", {
                    type: res.error.code,
                    message: res.error.message
                })
            return
        })
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="channel_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Channel ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="xxxxxxxxxxxxx" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormRootError />
                    <Button type="submit" disabled={pending}>{pending ? <LoadingSpinner /> : "Submit"}</Button>
                </form>
            </Form>
            {Object.keys(channelData).length > 0 && !pending && <CreateDialog data={channelData} />}
        </div>
    )
}
