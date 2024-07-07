import Image from "next/image";
import { Container } from "@/components/sections/Container";

export const Testimonials = ({ data, id = "" }) => {
  return (
    <Container>
      <div id={id} className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
        {data.map((testim, index) =>
          <div key={index} className="lg:col-span-2 xl:col-auto">
            <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-gray-800">
              <p className="text-2xl leading-normal ">
                {testim.review}
              </p>

              <Avatar
                image={testim.image}
                name={testim.name}
                title={testim.title}
              />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

function Avatar(props) {
  return (
    <div className="flex items-center mt-8 space-x-3">
      <div className="flex-shrink-0 overflow-hidden rounded-full w-14 h-14">
        <Image
          src={props.image}
          width="40"
          height="40"
          alt="Avatar"
          placeholder="blur"
        />
      </div>
      <div>
        <div className="text-lg font-medium">{props.name}</div>
        <div className="text-gray-600 dark:text-gray-400">{props.title}</div>
      </div>
    </div>
  );
}

function Mark(props) {
  return (
    <>
      {" "}
      <mark className="text-indigo-800 bg-indigo-100 rounded-md ring-indigo-100 ring-4 dark:ring-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
        {props.children}
      </mark>{" "}
    </>
  );
}
