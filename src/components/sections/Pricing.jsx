import { Check } from "lucide-react";
import { cloneElement } from "react";
import { Button } from "../ui/button";

export const Pricing = ({ data }) => {
    return (
        <div className="w-full">
            <div className={`flex flex-wrap w-full text-left justify-center`}>
                {data.map((offer, index) => (
                    <div key={index} className="max-w-1/2 p-3 m-2 lg:max-w-1/2 border border-indigo-500 rounded-md">
                        <p><span className="text-7xl font-bold">{offer.price}</span> € <br/>
                            E ottieni: <span className="text-5xl font-bold text-indigo-500">{offer.creditsN}</span><span className="text-indigo-500 font-bold text-3xl"> CREDIT{offer.creditsN == 1 ? "O" : "I"}</span>
                        </p>
                        <Button className={"w-full font-bold mt-1 text-lg" + (index == 1 ? " bg-indigo-500 text-white" : "")}>Acquista</Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

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