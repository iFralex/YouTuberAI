import { db } from "@/components/firebase";
import { Container } from "@/components/sections/Container";
import { getDoc, doc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";

import { Navbar } from "@/components/sections/Navbar";
import { Separator } from "@/components/ui/separator";
import { ScriptPreview } from "../scriptDialog";
import { Pricing } from "@/components/sections/Pricing";
import { prices } from "@/components/sections/data";

export async function Dashboard({ id }) {
    const scripts = []
    const querySnapshot = await getDocs(collection(db, id));
    querySnapshot.forEach(doc => scripts.push(Object.assign({ id: doc.id }, doc.data())))
    const user = await getDoc(doc(db, "users", id));
    const { username, credits } = user.data()

    const onsubmit = () => {
        const docRef = collection(db, id)
        addDoc(docRef, { title: "Titolodasa", script: "testo", desc: "descrizione del video" })
    }
    return <>
        <Navbar logged={-1} />
        <Container>
            <h1 className="text-4xl font-bold">Dashboard di {username}</h1>
            <Separator className="my-5" />
            <h2 className="text-4xl font-bold my-3">Crediti: <span className="text-indigo-500">{credits}</span></h2>
            <Pricing data={prices} />

            <Separator className="my-5" />
            <h2 className="text-4xl font-bold my-3">Script generati</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
                {scripts.map(data => (
                    <ScriptPreview key={data.id} props={data} />
                ))}
            </div>
        </Container>
    </>
}