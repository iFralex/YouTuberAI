import Result from "@/app/result"
import TextInputWithButton from '@/app/InputField';

export default async function Home({ params }) {
    return <div>
        <TextInputWithButton defaultValue={params.id} />
        <Result _params={params} />
    </div>
}