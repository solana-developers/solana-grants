import { FC, useEffect, useRef, useState } from "react";
import personImage from "../../../public/images/person-opens-the-safe-with-the-money.png";
import CreateGrant from "../../components/CreateGrant";
import getGrants from "instructions/getGrants";
import { useWallet } from '@solana/wallet-adapter-react';
import getProvider from 'instructions/api/getProvider';
import { notify } from "../../utils/notifications";
import { BN } from "@project-serum/anchor";
import getProgram from "../../instructions/api/getProgram";
import { getProgramInfoPDA } from "../../instructions/pda/getProgramInfoPDA";
import { PublicKey } from "@solana/web3.js";
import fetchDataFromArweave from "../../utils/fetchDataFromArweave";
import fetchGithubUserDataFromUserId from "utils/fetchGithubUserDataFromUserId";

export const ExploreView: FC = ({}) => {
  const [projects, setProjects] = useState<ExploreCardProps[]>([]);
  const [preview, setpreview] = useState(false);
  const programInfo = useRef<any>();
  const currentGrantIndex = useRef(0);
  const totalGrantsFetched = useRef(0);
  const [loadingView, setLoadingView] = useState<-1 | 0 | 1>(1); // 1 -> show loading spinner, 0 -> show load more button, -1 -> show none

  const wallet = useWallet()

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
        // console.log(programInfoFetched)
        if (!programInfoFetched) {
          setLoadingView(0);
          return notify({ type: 'error', message: 'error', description: 'Something went wrong! please try again later' });
        }
        programInfo.current = programInfoFetched;
      }
  
      const numGrantsToFetchAtATime = 18;
      let grantsData = [];
  
      while (programInfo.current.grantsCount > totalGrantsFetched.current && grantsData.length < numGrantsToFetchAtATime) {
        const startIndex = currentGrantIndex.current;
        let endIndex = startIndex + numGrantsToFetchAtATime - grantsData.length - 1;
        if (endIndex > programInfo.current.grantsCount - 1) {
          endIndex = programInfo.current.grantsCount - 1;
        }
        console.log(programInfo.current.grantsCount, totalGrantsFetched.current);
  
        const grants = await getGrants(provider, startIndex, endIndex);
        console.log(grants);
        if (grants.err) {
          setLoadingView(0);
          return notify({ type: 'error', message: 'error', description: 'Something went wrong! please try again later' });
        }
  
        grantsData = grants.data;
        totalGrantsFetched.current += grants.data.length;
  
        grantsData = grantsData.filter((grant: ExplorerCardProps) => {
          if (!grant) {
            return false;
          }
  
          if (grant.dueDate instanceof BN) {
            grant.dueDate = grant.dueDate.toNumber();
          }
          if (new Date().getTime() > grant.dueDate) {
            return false;
          }
  
          if (grant.lamportsRaised instanceof BN && grant.targetLamports instanceof BN) {
            grant.lamportsRaised = grant.lamportsRaised.toNumber();
            grant.targetLamports = grant.targetLamports.toNumber();
          }
          if (grant.lamportsRaised >= grant.targetLamports) {
            return false;
          }
  
          if (!grant.matchingEligible) {
            return false;
          }
  
          if (grant.isCancelled) {
            return false;
          }

          if (grant.author instanceof PublicKey) {
            grant.author = grant.author.toString();
          }

          return true;
        });
  
        currentGrantIndex.current += grantsData.length;
      }

      await Promise.all(grantsData.map(async (grant) => {
        const arweaveResponse = await fetchDataFromArweave(grant.info);
        // console.log(arweaveResponse);
        if (arweaveResponse.err) {
          return;
        }
        const dataFromArweave = arweaveResponse.data;
        Object.keys(dataFromArweave).map((key) => {
          grant[key] = dataFromArweave[key];
        });

        const githubUserDataResponse = await fetchGithubUserDataFromUserId(dataFromArweave.githubUserId);
        if (githubUserDataResponse.err) {
          return;
        }
        grant.author = githubUserDataResponse.data.name;
        grant.authorLink = `https://github.com/${githubUserDataResponse.data.login}`;
        console.log(grant);
      }));
  
      console.log(grantsData);
      setProjects(grantsData);  
      if (programInfo.current.grantsCount === totalGrantsFetched.current) {
        setLoadingView(-1);
      }
      else {
        setLoadingView(0);
      }
    } catch (error) {
      console.log(error);
      setLoadingView(0);
      return notify({ type: 'error', message: 'error', description: 'Something went wrong! please try again later' });
    }
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
              <a
                href='#create-grant'
                className='px-6 py-2 text-sm bg-transparent border rounded-full hover:bg-slate-500 text-fuchsia-300 border-fuchsia-300 btn'
                onClick={() => {
                  setpreview(true);
                }}
              >
                CREATE A GRANT
              </a>
              {preview && <CreateGrant setpreview={setpreview} />}
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
      <div className="flex justify-center mb-4">
        {loadingView != -1 && (
          loadingView == 0 ? (
            <button className="bg-cyan-300 hover:bg-blue-700 text-black hover:text-white font-bold py-2 px-4 rounded" onClick={fetchGrants}>
              Load More
            </button>
          ) : (
            <div className='w-12 h-12 rounded-full animate-spin loading-spinner-gradients'></div>
          )
        )}
      </div>
    </>
  );
};
