"use client";

import { startTransition, useTransition } from "react";
import { auth, db } from "@/components/firebase";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { z } from "zod";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormRootError,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/sections/Container";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading";
import { signInWithEmailAndPassword } from "firebase/auth";

export const LoginAccount = async (email, password) => {
    const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
    const idToken = await credential.user.getIdToken();

    await fetch("/api/login", {
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });
    return credential.user.uid
}

const logInSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be 6 characters long"),
    })

export default function Login() {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(logInSchema),
    })

    async function onSubmit(values) {
        startTransition(async () => {
            try {
                await LoginAccount(values.email, values.password)
                router.push("/dashboard");
            } catch (e) {
                form.setError(e.message);
            }
        })
    }

    return (
        <>
            <Navbar />
            <Container className="flex justify-center">
                <Card className="w-[350px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardHeader>
                                <CardTitle>Log in</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <Label htmlFor="email">Your email address</Label>
                                                <Input id="email" type="email" placeholder="example@name.com..." {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <Label htmlFor="password">Password</Label>
                                                <Input id="password" type="password" placeholder="··········" {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormRootError />
                            </CardContent>
                            <CardFooter className="grid grid-cols-1 text-right">
                            <Button type="submit" disabled={pending} className="my-2">{pending ? <LoadingSpinner /> : "Login"}</Button>
                                <p>Don't have an account yet? <Link href="/signup" className="text-link">Sign up</Link></p>
                            </CardFooter>
                        </form>
                    </Form >
                </Card >
            </Container>
        </>
    );
}