import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../../public/img/benefit-one.png";
import benefitTwoImg from "../../../public/img/benefit-two.png";
import userOneImg from "../../../public/img/user1.jpg";
import userTwoImg from "../../../public/img/user2.jpg";
import userThreeImg from "../../../public/img/user3.jpg";

const benefitOne = {
  title: "Velocizza la Tua Produzione",
  desc: "Con Youtuber AI, puoi accelerare significativamente il processo di creazione dei tuoi contenuti.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Replica Stili Unici",
      desc: "Genera script che catturano l'essenza e lo stile di qualsiasi YouTuber, mantenendo la tua voce autentica.",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Migliora la Qualità dei Contenuti",
      desc: "Accedi a script ben strutturati e ricchi di informazioni, basati su fonti affidabili che fornisci.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Aumenta la Frequenza di Upload",
      desc: "Riduci il tempo di scrittura e dedica più energie alla produzione, aumentando la regolarità dei tuoi contenuti.",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Adatto a Ogni Creator",
  desc: "Youtuber AI si adatta alle esigenze di diversi tipi di content creator.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Per YouTuber Esperti",
      desc: "Ottimizza il tuo processo di scrittura, mantenendo il tuo stile unico e risparmiando tempo prezioso.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Per Creatori Emergenti",
      desc: "Impara dagli stili dei top creator mentre sviluppi la tua voce personale nel mondo di YouTube.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Per Scopi Educativi",
      desc: "Trasforma argomenti complessi in script coinvolgenti, nello stile del tuo YouTuber preferito.",
      icon: <SunIcon />,
    },
  ],
};

const comparison = {
  pretitle: "GUIDA ALLA SCELTA DEL CREATOR",
  title: "Massimizza l'Efficacia di Youtuber AI",
  desc: "La scelta del creator giusto può ottimizzare i risultati di Youtuber AI. Ecco alcuni suggerimenti:",
  leftBullets: [
    "Divulgatori scientifici e storici",
    "Creatori di documentari",
    "Youtuber di infotainment",
    "Esperti di analisi e approfondimenti",
  ],
  rightBullets: [
    "Gamer e streamer di gameplay",
    "Vlogger spontanei",
    "Creator di contenuti prevalentemente visivi",
  ],
  note: "Con una descrizione dettagliata delle tue esigenze, puoi ottenere ottimi risultati con qualsiasi tipo di creator. La chiave è essere specifici nel comunicare il risultato desiderato.",
};

const reviews = [
  {
    review: "Youtuber AI ha dimezzato i miei tempi di scrittura. Ora posso concentrarmi di più sulla qualità del montaggio.",
    name: "Marco V.",
    title: "Tech Reviewer",
    image: userOneImg,
  },
  {
    review: "All'inizio ero scettica, ma gli script generati catturano davvero il mio stile. Un aiuto prezioso per la mia crescita su YouTube.",
    name: "Giulia S.",
    title: "Creator Educativa",
    image: userTwoImg,
  },
  {
    review: "Fantastico per esplorare nuovi argomenti. Mi ha aiutato a diversificare i contenuti del mio canale senza perdere la mia voce.",
    name: "Luca T.",
    title: "Divulgatore Scientifico",
    image: userThreeImg,
  },
]

const faq = [
  {
    question: "Come funziona esattamente Youtuber AI?",
    answer: "Inserisci il link del canale YouTube, fornisci dettagli sul tema e carica le fonti. Il nostro sistema analizza lo stile del creator e genera uno script personalizzato in base alle tue specifiche.",
  },
  {
    question: "Quanto costa il servizio?",
    answer: "Il servizio funziona con un sistema a crediti. I prezzi variano in base al piano scelto. Visita la nostra pagina dei prezzi per i dettagli aggiornati.",
  },
  {
    question: "Gli script generati sono originali?",
    answer: "Sì, ogni script è unico e creato specificamente per te, basandosi sullo stile del creator scelto e sulle informazioni fornite.",
  },
  {
    question: "Posso modificare lo script una volta generato?",
    answer: "Certamente! Offriamo fino a 5 revisioni gratuite entro 15 minuti dalla generazione dello script.",
  },
  {
    question: "Come faccio a sapere se le informazioni nello script sono accurate?",
    answer: "Raccomandiamo sempre di fare un fact-checking sullo script generato. Il sistema si basa sulle fonti fornite, ma è importante verificare l'accuratezza delle informazioni.",
  },
  {
    question: "Youtuber AI può replicare lo stile di qualsiasi creator?",
    answer: "Funziona meglio con creator che seguono script strutturati, ma con istruzioni dettagliate può adattarsi a vari stili. La qualità dipende dalle informazioni fornite.",
  },
  {
    question: "C'è un limite al numero di script che posso generare?",
    answer: "Il numero di script dipende dai crediti disponibili nel tuo account. Puoi sempre acquistare crediti aggiuntivi se necessario.",
  },
];

const prices = [
  {
    price: 14.99,
    creditsN: 1
  },
  {
    price: 34.99,
    creditsN: 3
  },
  {
    price: 59.99,
    creditsN: 5
  },
  {
    price: 99.99,
    creditsN: 10
  },
]

const navigation = [
  {
    text: "Vantaggi",
    id: "benefits-1",
  },
  {
    text: "Scegli Creator",
    id: "choose-creators",
  },
  {
    text: "Prezzi",
    id: "pricing",
  },
  {
    text: "Testimonianze",
    id: "testimonies",
  },
  {
    text: "FAQ",
    id: "faq",
  },
];

export { navigation, benefitOne, benefitTwo, comparison, reviews, prices, faq };