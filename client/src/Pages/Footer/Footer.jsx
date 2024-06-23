import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {BsFacebook,BsInstagram,BsWhatsapp,BsLinkedin,BsGithub} from "react-icons/bs"
import React from "react";

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace--nowrap text-sm 
        sm:text-xl font-semibold dark:text-white"
            >
              {/* <span
                className="px-2 py-1 bg-gradient-to-r from-indigo-500
            via-purple-500 to-pink-500 rounded-lg text-white "
              >
                Live
              </span>
              Auction */}
              <span className="ml-3 text-2xl font-bold">
               <span className="text-cyan-500">Live</span>Auction
             </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.hackerrank.com/profile/kushwahadheeraj1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hacker Rank
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Auction
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/Kushwahadheeraj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="https://discord.com/channels/@me/821066846941085786">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider/>
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="Live Auction"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="https://firebasestorage.googleapis.com/v0/b/mern-blog-95d9d.appspot.com/o/WhatsApp%20Image%202024-03-07%20at%2000.13.36.jpeg?alt=media&token=9afa0f0f-c63d-4969-b551-325b5c40c234" icon={BsWhatsapp}/>
            <Footer.Icon href='https://www.facebook.com/dheeraj.kushwaha.71653318' icon={BsFacebook}/>
            <Footer.Icon href='https://www.instagram.com/dheerajkushwaha387/' icon={BsInstagram}/>
            <Footer.Icon href='https://www.linkedin.com/in/dheeraj-kushwaha-6145201b9/' icon={BsLinkedin}/>
            <Footer.Icon href='https://github.com/Kushwahadheeraj' icon={BsGithub}/>

          </div>
        </div>
      </div>
    </Footer>
  );
}

