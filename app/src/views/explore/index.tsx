import { FC, useEffect, useState } from "react";
import personImage from "../../../public/images/person-opens-the-safe-with-the-money.png";
import CreateGrant from "../../components/CreateGrant";
import { ExploreCard, ExploreCardProps } from "../../components/ExploreCard";

export const ExploreView: FC = ({ }) => {
  const [projects, setProjects] = useState<ExploreCardProps[]>([]);
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
      projectLink: "/grant/1",
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
      <div className='p-4 mx-auto md:hero'>
        <div className='flex-col gap-20 mb-40 hero-content lg:flex-row'>
          <div className='flex flex-col lg:items-start'>
            <h1 className='mt-20 text-5xl font-bold text-center text-white lg:text-left bg-clip-text'>
              Fund Public Goods
              <br />
              Help grow Solana!{" "}
            </h1>
            <h4 className='my-5 text-xl text-center text-white md:w-full lg:text-left'>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                <br /> eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </p>
            </h4>
            <div className='pt-5 text-center'>
              <a href="#create-grant" className="px-6 py-2 text-sm bg-transparent border rounded-full hover:bg-slate-500 text-fuchsia-300 border-fuchsia-300 btn"  onClick={()=>{ setpreview(true) }}>
                CREATE A GRANT
              </a>
              { preview && <CreateGrant setpreview={setpreview} />}
            </div>
          </div>
          <div className='hidden pt-10 lg:block'>
            <img src={personImage.src} width='420px' />
          </div>
        </div>
      </div>
      <div className='px-2 mx-auto lg:container'>
        <div className='flex flex-wrap justify-center gap-8'>
          {projects.map((props, idx) => (
            <ExploreCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </>
  );
};
