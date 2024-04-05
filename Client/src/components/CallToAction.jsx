import { Button } from "flowbite-react";
import React from "react";

export const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">want to learn about JavaScript?</h2>
        <p className="text-gray-500 my-2">Checkout these resourse with 100 Javascript Projects</p>
        <Button
          className="rounded-t-xl rounded-bl-none rounded-tr-none"
          gradientDuoTone={"purpleToPink"}
        >
          <a href="https://my-portfolio-delta-neon.vercel.app/" target="_blank">
            Learn more about the developer
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
       <img src="https://img.freepik.com/free-photo/person-front-computer-working-html_23-2150040428.jpg?w=1060&t=st=1712309873~exp=1712310473~hmac=eabb2a3f2318d97f1a78eed04f444ff19fe43f74329bcb976558ff3135915c6f" alt="" />
      </div>
    </div>
  );
};