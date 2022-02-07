import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

interface Launch {
  id: string;
  launch_date_local: string;
  launch_site: {
    site_name_long: string;
  };
  links: {
    mission_patch: string;
    video_link: string;
  };
  mission_name: string;
  rocket: {};
  __typename: string;
}

const Home: NextPage = ({ launches }: { launches: Launch[] }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>SpaceX Launches</h1>
        <p className={styles.description}>Latest launches from SpaceX. Click to see launch.</p>

        {/* Start of the GRID */}
        <div className={styles.grid}>
          {launches.map((launch: Launch) => {
            let url;
            launch.links.mission_patch ? (url = launch.links.mission_patch) : (url = 'https://images2.imgbox.com/d2/3b/bQaWiil0_o.png');
            return (
              <a key={launch.id} href={launch.links.video_link} className={styles.card}>
                <Image alt='Mission Patch' src={url} width='300' height='300' />
                <h2>{launch.mission_name}</h2>
                <p>
                  <strong>Date:</strong>
                  {new Date(launch.launch_date_local).toLocaleDateString('en-US')}
                </p>
                <br />
                <p>
                  <strong>Location: </strong>
                  {launch.launch_site.site_name_long}
                </p>
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `
  });

  return {
    props: {
      launches: data.launchesPast
    }
  };
}
