import { loremIpsum } from "lorem-ipsum";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { GrantView, Props as GrantViewProps } from "views/grant";

const GrantPage: NextPage<{grantViewProps: GrantViewProps}> = (props) => {
  return (
    <div>
      <Head>
        <title>{props.grantViewProps.title}</title>
        <meta name='description' content='Grant details' />
      </Head>
      <GrantView {...props.grantViewProps} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
// TODO: fetch them from the API
  const grants = [
    {
      id: 1,
    },
  ];
  
  const paths = grants.map((grant) => ({
    params: { id: grant.id.toString() },
  }));

  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // TODO: fetch from the API
  // If the route is like /grants/1, then params.id is 1
  // const res = await fetch(`https://.../posts/${params.id}`)
  // const grant = await res.json()
  const grantViewProps: GrantViewProps = {
    grantNum: 1,
    title: "Miner Project",
    author: {
      name: "Miners Collective",
      ghAccount: "github.com/miners-collective",
      ghAvatar: "https://avatars.githubusercontent.com/u/62079184?s=400&u=9939b9ad01eff085a4cd473cc27afff5662a247e&v=4",
      walletAddress: "bvzr23a5sd1315s13d5f13c5sa1sd5fasfsa651scxz",
    },
    about: loremIpsum({ count: 30, units: "words" }),
    description: `# Heading 1 

${loremIpsum({ count: 50, units: "words" })}

## Heading 2

This has lists as well:
- number one
- number two
- etc

### Heading 3
      
${loremIpsum({ count: 50, units: "words" })}`,
    amountRaised: 23050,
    amountGoal: 100000,
    numContributors: 203,
    targetDate: new Date("08/22/2022").getTime(),
    repo: "github.com/miner-project",
    website: "miner-project.com",
    image: "https://api.lorem.space/image/shoes?w=400&h=225",
    bgColor: "#9945FF",
  };

  // Pass grant data to the page via props
  return { props: { grantViewProps } }
}

export default GrantPage;
