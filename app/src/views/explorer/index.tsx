import { FC, useEffect, useState } from "react";
import personImage from "../../../public/images/person-opens-the-safe-with-the-money.png";
import { ExplorerCard, ExplorerCardProps } from "../../components/ExplorerCard";
import CreateGrant from "../../components/CreateGrant";

export const ExplorerView: FC = ({ }) => {
  const [projects, setProjects] = useState<ExplorerCardProps[]>([]);
  const [preview, setpreview] = useState(false);
  useEffect(() => {
    // TODO: fetch projects from the API
    let exampleProject = {
      image: "https://api.lorem.space/image/shoes?w=400&h=225",
      bgColor: "yellow",
      title: "Minter Project",
      author: "minter.sol",
      authorLink: "https://minter.sol",
      summary:
        "Make minting process easier with this framework and then do a lot of subsequent lines until we reach more than 3 lines to test for line clamping",
      projectLink: "/grants/1",
      amtRaised: 3012.892,
      numContributors: 76,
    };
    setProjects([
      exampleProject,
      exampleProject,
      exampleProject,
      exampleProject,
      exampleProject,
      exampleProject,
      exampleProject,
    ]);
  }, []);

  return (
    <>
      <div className='md:hero mx-auto p-4'>
        <div className='hero-content flex-col lg:flex-row gap-20 mb-40'>
          <div className='flex flex-col lg:items-start'>
            <h1 className='text-center lg:text-left text-5xl mt-20 font-bold text-white bg-clip-text'>
              Fund Public Goods
              <br />
              Help grow Solana!{" "}
            </h1>
            <h4 className='md:w-full text-center lg:text-left text-xl text-white my-5'>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                <br /> eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </p>
            </h4>
            <div className='text-center pt-5'>
              <a href="#create-grant" className="bg-transparent hover:bg-slate-500 py-2 px-6 text-fuchsia-300 border border-fuchsia-300 text-sm rounded-full btn"  onClick={()=>{ setpreview(true) }}>
                CREATE A GRANT
              </a>
              { preview && <CreateGrant setpreview={setpreview} />}
            </div>
          </div>
          <div className='pt-10 hidden lg:block'>
            <img src={personImage.src} width='420px' />
          </div>
        </div>
      </div>
      <div className='mx-auto px-2 lg:container'>
        <div className='flex flex-wrap justify-center gap-8'>
          {projects.map((props, idx) => (
            <ExplorerCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </>
  );
};
