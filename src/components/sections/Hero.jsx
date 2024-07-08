import Image from "next/image";
import { Container } from "@/components/sections/Container";
import heroImg from "../../../public/img/hero.png";
import { MainForm } from '@/components/form';
import { BadgeCheck } from "lucide-react";

export const Hero = () => {
  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Youtuber AI: Il Tuo Script Perfetto in Pochi Clic
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Trasforma il modo in cui crei contenuti per YouTube. Con Youtuber AI, ottieni script personalizzati nello stile del tuo creator preferito o del tuo stesso canale, in una frazione del tempo tradizionale. Basta inserire un link, fornire alcune informazioni e lasciare che la nostra AI faccia il resto.
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <MainForm />
            </div>
            <div className="flex flex-wrap justify-start gap-5 mt-10 md:justify-between flex-col">
              <Vantage>
                Risparmia ore di scrittura
              </Vantage>
              <Vantage>
                Replica lo stile di qualsiasi YouTuber
              </Vantage>
              <Vantage>
                Personalizza ogni dettaglio del tuo script
              </Vantage>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
    </>
  );
}

function Vantage({ children }) {
  return (
    <div className="flex">
      <BadgeCheck className="mr-2 text-indigo-600" />
      {children}
    </div>
  );
}