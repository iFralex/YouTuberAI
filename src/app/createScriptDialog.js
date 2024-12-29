"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useActionState, useTransition, useEffect, useCallback } from 'react';
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getGeneratedTranscript, getRawTranscripts } from "./actions";
import { Result, ScriptDialog } from "./scriptDialog";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { FileUp, FileX } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
    theme: z.string().min(2, {
        message: "Theme text must be at least 2 characters.",
    }).max(50, {
        message: "Theme text must be at most 50 characters.",
    }),
    description: z.string().min(20, {
        message: "Description must be at least 20 characters.",
    }).max(600, {
        message: "Description must be at most 600 characters.",
    }),
    minutesNumber: z.number().min(2, { message: "Too short" }).max(20, { message: "Too long" }).default(10),
    videosCount: z.number().min(5, { message: "Too fiew" }).max(50, { message: "Too much" }).default(15),
    files: z.array(z.object({ value: z.custom(), }),)
        .min(1, { message: 'Please add at least one source.' })
        .max(4, { message: 'Max sources: 4' })
})

export function CreateDialog({ data }) {
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState([])

    const form = useForm({
        resolver: zodResolver(formSchema),
    })
    form.register("file");

    async function extractTextFromFiles(files) {
        const textContents = await Promise.all(
            files.map(async (file) => {
                if (file.size > 1024 * 1024) {
                    throw new Error(`File ${file.name} exceeds the 1 MB size limit.`);
                }

                if (!file.type.startsWith('text/')) {
                    throw new Error(`File ${file.name} is not a supported text file.`);
                }

                try {
                    return await (async (file) => {
                        const reader = new FileReader();
                        return new Promise((resolve, reject) => {
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = () => reject(reader.error);
                            reader.readAsText(file);
                        });
                    })(file);
                } catch (error) {
                    throw new Error(`Error reading file ${file.name}: ${error.message}`);
                }
            })
        );

        return textContents;
    }

    function onSubmit(values) {
        startTransition(async () => {
            let res = await getRawTranscripts(data.id, values.videosCount)
            console.log({ ...values, rawTranscripts: res })
            if (res.error) {
                form.setError("root.serverError", {
                    type: res.error.code,
                    message: res.error.message
                })
                return
            }
            const generatedScript = await getGeneratedTranscript({ ...values, sources: await extractTextFromFiles(values.files.map(f => f.value)), rawTranscripts: res, files: undefined });
            if (res.error) {
                form.setError("root.serverError", {
                    type: res.error.code,
                    message: res.error.message
                })
                return
            }
            setResult(...(await generatedScript.json()))
        })
    }

    return (
        <Dialog defaultOpen={true}>
            {pending ?
                <DialogContent className="flex items-center w-[50%] h-[50%]">
                    <div className="flex items-center justify-center w-full h-full">
                        <LoadingSpinner size={35} />
                    </div>
                </DialogContent>
                : (!result.length ?
                    <DialogContent className="sm:max-w-[425px] overflow-scroll max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarImage src={data.image.url} />
                                    <AvatarFallback>Profile image</AvatarFallback>
                                </Avatar>
                                <span>{data.youtuber}</span>
                            </DialogTitle>
                            <DialogDescription>
                                Upload theme and sources to generate a script with the style of {data.youtuber}
                            </DialogDescription>
                            <Separator />
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="theme"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Video Theme</FormLabel>
                                            <FormDescription>
                                                Write the theme of your video
                                            </FormDescription>
                                            <FormControl>
                                                <Input placeholder="Discovered the dinosaurs with feathers" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormDescription>
                                                Write the complete description about your video script. Include style, specific themes to highlight etc. The more information you give, the better the end result will come!
                                            </FormDescription>
                                            <FormControl>
                                                <Textarea placeholder="My video should be... with a style... talk about in particular about..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="minutesNumber"
                                    render={({ field: { value, onChange } }) => (
                                        <FormItem>
                                            <FormLabel>Duration in minutes: {value || 10}</FormLabel>
                                            <FormDescription>
                                                How many minutes do you want your video? 1 minute = 1000 words.
                                            </FormDescription>
                                            <FormControl>
                                                <Slider defaultValue={[10]} min={2} max={20} step={1} onValueChange={n => onChange(n[0])} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="videosCount"
                                    render={({ field: { value, onChange } }) => (
                                        <FormItem>
                                            <FormLabel>Videos number to analyze: {value || 15}</FormLabel>
                                            <FormDescription>
                                                Choose the number of videos to analyze. The higher the number, the more the end result will have the style of the creator, but the generation could take longer.
                                            </FormDescription>
                                            <FormControl>
                                                <Slider defaultValue={[15]} min={5} max={50} step={1} onValueChange={n => onChange(n[0])} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="files"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sources</FormLabel>
                                            <FormDescription>
                                                Upload your all sources. The quality of the sources will influence the end result. Max 4 files, 1 MB each, only text type.
                                            </FormDescription>
                                            <FormControl>
                                                <FileUpload form={form} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormRootError />
                                <DialogFooter>
                                    <Button type="submit" disabled={pending}>Submit</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                    :
                    <ScriptDialog youtuber={data.youtuber} imageUrl={data.image.url} title="Titolo del video" script={result.text} mutabled={result.cache} />
                )
            }
        </Dialog >
    )
}

const formattedResult = result => result.map(video =>
    "# Title: " + video.data.youtuber + "\n" +
    video.transcript.join("") +
    "\n\n ## Description\n" +
    video.data.description +
    "\n\n ## Keywords\n" +
    video.data.keywords.join(" - ") +
    "\n\n----\n\n ").join("")

function triggerDownload(stringContent = '', filename = 'download.blob') {
    const blob = new Blob([stringContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

export const FileUpload = ({ form }) => {
    const {
        fields: fileFields,
        append: appendFile,
        remove: removeFile,
    } = useFieldArray({
        name: 'files',
        control: form.control,
    });
    const onDrop = useCallback(
        async (acceptedFiles) => {
            appendFile(acceptedFiles.map((file) => ({ value: file })));
            await form.trigger('files');
        },
        [form],
    );
    const { isDragActive, getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        maxSize: 2000000,
        accept: { "text/*": [".*"] },
        maxFiles: 2
    })

    return <>{console.log(fileFields)}
        <div
            {...getRootProps({
                className: cn(
                    "p-3 mb-4 flex flex-col items-center justify-center w-full rounded-md cursor-pointer " + (isDragActive ? "bg-white" : "bg-[#ddf] dark:bg-[#113]")
                ),
            })}
        >
            <div className="flex items-center mt-2 mb-2">
                <Label
                    htmlFor="files"
                    className={`text-center text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline ${form.formState.errors.files && "text-red-500"}`}
                >
                    <div className="w-full flex justify-center p-4"><FileUp strokeWidth={1.25} size={48} /></div>
                    <span>{isDragActive ? "Drop here" : "Click to upload or drag and drop"}</span>
                    <input {...getInputProps()} />
                </Label>
            </div>
        </div>
        <div className="flex flex-col items-center">
            <Table>
                <TableBody>
                    {fileFields.map((f, i) => <File file={f.value} key={"file" + i} id={"file" + i} DeleteHandle={() => { removeFile(i) }} />)}
                </TableBody>
            </Table>
        </div>
    </>
    /*
    return (
        <div className="container px-4 max-w-5xl mx-auto">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setFileEnter(true);
                }}
                onDragLeave={(e) => {
                    setFileEnter(false);
                }}
                onDragEnd={(e) => {
                    e.preventDefault();
                    setFileEnter(false);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    setFileEnter(false);
                    if (e.dataTransfer.items) {
                        let urlList = [];
                        [...e.dataTransfer.items].forEach((item, i) => {
                            if (item.kind === "file") {
                                const _file = item.getAsFile();
                                if (_file) {
                                    //let blobUrl = URL.createObjectURL(files);
                                    urlList.push(_file)
                                }
                                console.log(`items file[${i}].name = ${_file?.name}`);
                            }
                        });
                        setFiles(files.concat(urlList));
                    } else {
                        [...e.dataTransfer.files].forEach((file, i) => {
                            console.log(`… file[${i}].name = ${file.name}`);
                        });
                    }
                }}
                className={`${fileEnter ? "border-4 bg-white" : "border-2 bg-[#ddf]"
                    } mx-auto flex flex-col w-full max-w-xs h-72 border-dashed items-center justify-center`}
            >
                <Label
                    htmlFor="file"
                    className="h-full flex flex-col justify-center text-center items-center"
                >
                    <div className="w-full flex justify-center p-4"><FileUp strokeWidth={1.25} size={48} /></div>
                    <span>{fileEnter ? "Drop" : "Click to upload or drag and drop"}</span>
                </Label>
                <input
                    id="file"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        console.log(e.target.files);
                        let _files = e.target.files
                        let filesList = []
                        console.log("file", _files.length)
                        for (let i = 0; i < _files.length; i++) {
                            console.log("file", _files.item(i))
                            if (_files.item(i)) {
                                //let blobUrl = URL.createObjectURL(files[0]);
                                console.log("file", _files.item(i))
                                filesList.push(_files.item(i));
                            }
                        }
                        setFiles(files.concat(filesList))
                    }}
                />
            </div>

            <div className="flex flex-col items-center">
                <Table>
                    <TableBody>
                        {files.map((f, i) => <File file={f} key={"file" + i} id={"file" + i} DeleteHandle={() => { console.log(i); setFiles(files.slice(0, i).concat(files.slice(i + 1))) }} />)}
                    </TableBody>
                </Table>
            </div>
        </div>
    );*/
};

const File = ({ file, id, DeleteHandle }) => {
    return <TableRow>
        <TableCell>{file.name}</TableCell>
        <TableCell>
            <Button size="icon" variant="destructive" onClick={DeleteHandle}><FileX strokeWidth={1.25} /></Button>
        </TableCell>
    </TableRow>
}