import { reteriveTranscript, getVideosIds } from './actions';
import { MainForm } from './form';

export default async function Home() {
  return <div>
    <MainForm/>
  </div>
}