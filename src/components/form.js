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
import { getChannelData, getChannelIdFromUsername } from '../app/actions';
import { CreateDialog } from "@/app/createScriptDialog"

const formSchema = z.object({
    channel_id: z.string().min(10, {
        message: "Value must be at least 10 characters.",
    }).max(80, { message: "Value must be at most 80 characters.", }),
})

export function MainForm() {
    const [pending, startTransition] = useTransition();
    const [channelData, setChannelData] = useState({})

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            channel_id: ""//"UCHi6Q3Z-5oJUC691WLlSntA",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values) {
        console.log(values)
        startTransition(async () => {
            let id = await getChannelId(values.channel_id)
            let res = await getChannelData(id)
            if (!res.error && id && !id.error)
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
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex md:space-x-3 flex-col md:flex-row items-center w-full">
                        <FormField
                            control={form.control}
                            name="channel_id"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <Input className="text-lg h-[60px]" placeholder="Channel url (e.g. youtube.com/@name...)" {...field} />
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={pending} className="px-8 py-7 text-lg font-bold w-full md:w-auto mt-2 md:mt-0">{pending ? <LoadingSpinner /> : "Vai"}</Button>
                    </div>
                    <FormRootError />
                </form>
            </Form>
            {Object.keys(channelData).length > 0 && !pending && <CreateDialog data={channelData} />}
        </div>
    )
}

async function getChannelId(url) {
    console.log("url", url)
    url = url.split("?")[0]
    // Verifica se corrisponde ai casi con @{username}
    const usernameRegex = /youtube\.com\/@([a-zA-Z0-9_]+)/;
    const channelIdRegex = /youtube\.com\/channel\/([a-zA-Z0-9_\-]+)/;
    const directChannelIdRegex = /^[a-zA-Z0-9_\-]+$/;

    if (usernameRegex.test(url)) {
        let username = url.match(usernameRegex)[1];
        return await getChannelIdFromUsername(username);
    } else if (channelIdRegex.test(url)) {
        let channelId = url.match(channelIdRegex)[1];
        return channelId; // Restituisce il channelId
    } else if (directChannelIdRegex.test(url)) {
        return url; // Restituisce il channelId direttamente
    } else {
        return null; // Non corrisponde a nessun caso
    }
}