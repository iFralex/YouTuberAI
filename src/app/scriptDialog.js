"use client"
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
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";

export const ScriptDialog = (props) => {
    const { youtuber, imageUrl, script } = props.props
    return (
        <DialogContent className=" max-h-[90%] overflow-scroll">
            <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={imageUrl} />
                        <AvatarFallback>Profile image</AvatarFallback>
                    </Avatar>
                    <span>{script.title}</span>
                </DialogTitle>
                <DialogDescription>
                    @{youtuber}
                </DialogDescription>
                <Separator />
            </DialogHeader>
            <div>
                <Label htmlFor="script">Script</Label>
                <ScrollArea id="script" className="overflow-scroll max-h-[50vh]">
                    <NewlineText text={script.text} />
                    <Scrollbar orientation="vertical" />
                </ScrollArea>
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <ScrollArea id="description" className="overflow-scroll max-h-[30vh]">
                    {script.description}
                    <Scrollbar orientation="vertical" />
                </ScrollArea>
            </div>
            <div>
                <Label htmlFor="keywords">Keywords</Label>
                <ScrollArea id="keywords" className="max-h-[50vh] flex flex-wrap">
                    {script.keywords.map(keyword => <span className="m-3">#{keyword}</span>)}
                    <Scrollbar orientation="vertical" />
                </ScrollArea>
            </div>
            <DialogFooter>
                <Button onClick={() => triggerDownload(formattedResult(result), data.title + " transcripts.md")}>Download</Button>
                <Button onClick={() => navigator.clipboard.writeText(formattedResult(result))}>Copy</Button>
            </DialogFooter>
        </DialogContent >
    )
}

export const ScriptPreview = (props) => {
    const { youtuber, imageUrl, script } = props.props
    const shortScript = script.text.slice(0, 350) + " ..."

    return <Card className="w-full">
        <CardHeader>
            <CardTitle className="flex items-center space-x-3">
                <Avatar>
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>Profile image</AvatarFallback>
                </Avatar>
                <span>{script.title}</span>
            </CardTitle>
            <CardDescription>@{youtuber}</CardDescription>
        </CardHeader>
        <CardContent>
            <NewlineText text={shortScript} />
        </CardContent>
        <CardFooter className="">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full">Dettagli</Button>
                </DialogTrigger>
                <ScriptDialog props={props.props} />
            </Dialog>
        </CardFooter>
    </Card >
}

const NewlineText = ({ text }) => (<>{text.split('——').map(str => <p>{str}</p>)}</>)

function Result({ videos }) {
    return (
        <>
            {videos.map(video =>
            (<div>
                <div>
                    <h1>{video.data.title}</h1>
                    {video.transcript.map(line =>
                        <p>{line}</p>
                    )}
                </div>
                <div style={{ margin: "30px 0" }}></div>
                <div>
                    <h2>Descrizione</h2>
                    {video.data.description}
                </div>
                <div>
                    <h2>KeyWords</h2>
                    {video.data.keywords.map(word => <span style={{ paddingRight: 10 }}>{word}</span>)}
                </div>
                <div style={{ margin: "50px 0" }}></div>
            </div>))}
        </>
    );
}