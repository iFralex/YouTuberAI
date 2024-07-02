import Result from "@/app/result"

export default async function Home({ params }) {
    return <div>
        <Result _params={params} />
    </div>
}