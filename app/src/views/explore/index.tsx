import { FC, useEffect, useRef, useState } from "react";
import personImage from "../../../public/images/person-opens-the-safe-with-the-money.png";
import { ExploreCard, ExploreCardProps } from "../../components/ExploreCard";
import getGrants from "instructions/getGrants";
import { useWallet } from '@solana/wallet-adapter-react';
import getProvider from 'instructions/api/getProvider';
import { BN } from "@project-serum/anchor";
import getProgram from "../../instructions/api/getProgram";
import { getProgramInfoPDA } from "../../instructions/pda/getProgramInfoPDA";
import { PublicKey } from "@solana/web3.js";
import fetchDataFromArweave from "../../utils/fetchDataFromArweave";
import fetchGithubUserDataFromUserId from "utils/fetchGithubUserDataFromUserId";
import { useRouter } from "next/router";
import { toastError } from "components/Toast";

export const ExplorerView: FC = ({ }) => {
  const [projects, setProjects] = useState<ExploreCardProps[]>([]);
  const programInfo = useRef<any>();
  const currentGrantIndex = useRef(0);
  const totalGrantsFetched = useRef(0);
  const [loadingView, setLoadingView] = useState<-1 | 0 | 1>(1); // 1 -> show loading spinner, 0 -> show load more button, -1 -> show none

  const wallet = useWallet()
  const router = useRouter();

  useEffect(() => {
    fetchGrants()
  }, [])
  
  const fetchGrants = async () => {
    try {
      setLoadingView(1);
      const provider = getProvider(wallet, true);
  
      if (!programInfo.current) {
        const program = getProgram(provider);
        const programInfoPDA = await getProgramInfoPDA(program);
        const programInfoFetched = await program.account.programInfo.fetch(programInfoPDA);
        if (!programInfoFetched) {
          setLoadingView(0);
          toastError('Something went wrong! please try again later');
          return;
        }
        programInfo.current = programInfoFetched;
      }
  
      const numGrantsToFetchAtATime = 12;
      let grantsData = [];
      let cardProps: ExploreCardProps[];
      
      while (programInfo.current.grantsCount > totalGrantsFetched.current && grantsData.length < numGrantsToFetchAtATime) {
        const startIndex = currentGrantIndex.current;
        let endIndex =
          startIndex + numGrantsToFetchAtATime - grantsData.length - 1;
        if (endIndex > programInfo.current.grantsCount - 1) {
          endIndex = programInfo.current.grantsCount - 1;
        }

        const fetchedGrants = await getGrants(provider, startIndex, endIndex);
        if (fetchedGrants.err) {
          setLoadingView(0);
          toastError('Something went wrong! please try again later');
          return;
        }

        grantsData = fetchedGrants.data;
        totalGrantsFetched.current += fetchedGrants.data.length;

        // filter valid grants
        grantsData = grantsData.filter((grant) => {
          return grant
            && new Date().getTime() <= grant.dueDate.toNumber()
            && grant.lamportsRaised < grant.targetLamports.toNumber()
            && grant.fundingState.hasOwnProperty('active')
            && grant.isMatchingEligible
        });
        
        // transform to ExploreCardProps compatible types
        grantsData = grantsData.map((grant) => {
          const idx = grant.grantNum;

          const author = grant.author.toString();

          return {
            ...grant,
            idx,
            author,
          };
        });

        currentGrantIndex.current += grantsData.length;
      }

      await Promise.all(grantsData.map(async (grant) => {
        const arweaveResponse = await fetchDataFromArweave(grant.info);

        if (arweaveResponse.err) {
          return;
        }

        const dataFromArweave = arweaveResponse.data;

        Object.keys(dataFromArweave).forEach((key) => {
          grant[key] = dataFromArweave[key];
        });
      }));

      const currentProjects = [...projects];

      // we setProjects data and render it before creator details are fetched from github to reduce the waiting time of the user
      // since its better to load and display some content for the user early (Lazy rendering), than to load and display all content together but late
      /* @ts-ignore */
      // setProjects([...currentProjects, ...grantsData]);

      if (programInfo.current.grantsCount === totalGrantsFetched.current) {
        setLoadingView(-1);
      }
      else {
        setLoadingView(0);
      }

      await Promise.all(grantsData.map(async (grant) => {
        const githubUserDataResponse = await fetchGithubUserDataFromUserId(grant.githubUserId);
        if (githubUserDataResponse.err) {
          grant.author = "Author name could not be loaded";
          grant.authorLink = "";
          return;
        }
        grant.author = githubUserDataResponse.data.name;
        grant.authorLink = `https://github.com/${githubUserDataResponse.data.login}`;
      }));

      // coerce into card props
      cardProps = grantsData as ExploreCardProps[];

      // since we have now loaded the creator details from github, we rerender by setting projects again
      setProjects([...currentProjects, ...cardProps]);
    } catch (error) {
      console.log(error);
      setLoadingView(0);
      toastError('Something went wrong! please try again later');
      return;
    }
  }

  const navigateToCreateGrantPage = () => {
    router.push("/create-grant");
  }

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
              <button className="px-6 py-2 text-sm bg-transparent border rounded-full hover:bg-slate-500 text-fuchsia-300 border-fuchsia-300 btn"  onClick={navigateToCreateGrantPage}>
                CREATE A GRANT
              </button>
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
            <ExploreCard {...props} key={idx} idx={props.idx}/>
          ))}
        </div>
      </div>
      <div className="flex justify-center mb-10">
        {loadingView == -1 ? (
          <div className="my-10">
            {projects.length == 0
              ? <div className="text-xl font-bold">No grants available</div>
              : <div className="text-xl font-bold">That{"'"}s all folks</div>
            }
          </div>
        ) : (
          <>
            {loadingView == 0 ? (
              <button className="px-4 py-2 font-bold text-black rounded bg-cyan-300 hover:bg-blue-700 hover:text-white" onClick={fetchGrants}>
                Load More
              </button>
            ) : (
              <div className='w-12 h-12 rounded-full animate-spin loading-spinner-gradients'></div>
            )}
          </>
        )}
      </div>
    </>
  );
};
