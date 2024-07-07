import { cloneElement } from "react"
import Image from "next/image";
import { Container } from "@/components/sections/Container";
import { CheckCheck, X } from "lucide-react"
import { SectionTitle } from "./SectionTitle";

export const Comparison = (props) => {
    const { data, id } = props;
    return (
        <SectionTitle id={id} preTitle={data.pretitle} title={data.title} custom={true}>
            <p className="max-w-2xl py-4 text-lg leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
                {data.desc}
            </p>
            <div className="w-full">
                <div className={`flex flex-wrap items-start w-full text-left justify-around`}>
                    <div className="max-w-full mt-5  lg:max-w-1/2">
                        {data.leftBullets.map((item, index) => (
                            <BulletPoint key={index} title={item} icon={<CheckCheck />} />
                        ))}
                    </div>
                    <div className="max-w-full mt-5  lg:max-w-1/2">
                        {data.rightBullets.map((item, index) => (
                            <BulletPoint key={index} title={item} icon={<X />} />
                        ))}
                    </div>
                </div>
            </div>
            {data.note && <p className="max-w-2xl py-4 text-md text-left leading-normal text-gray-500 dark:text-gray-500">
                <strong>Nota: </strong>{data.note}
            </p>}
        </SectionTitle>
    );
};

function BulletPoint(props) {
    return (
        <div className="flex items-center mt-8 space-x-3">
            <div className="flex items-center justify-center flex-shrink-0 mt-1 rounded-md w-11 h-11 ">
                {cloneElement(props.icon, {
                    className: "w-7 h-7 text-indigo-600",
                })}
            </div>
            <div>
                <h4 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                    {props.title}
                </h4>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {props.children}
                </p>
            </div>
        </div>
    );
}