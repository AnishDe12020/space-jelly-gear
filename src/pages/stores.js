import Head from "next/head";
import { FaExternalLinkAlt } from "react-icons/fa";
import center from "@turf/center";
import { points } from "@turf/helpers";

import Layout from "@components/Layout";
import Container from "@components/Container";
import Button from "@components/Button";

import styles from "@styles/Page.module.scss";
import { gql } from "@apollo/client";
import client from "@lib/client";
import Map from "@components/Map";

export default function Stores({ storeLocations }) {
  const features = points(
    storeLocations.map(({ location }) => {
      return [location.latitude, location.longitude];
    })
  );

  const [defaultLatitude, defaultLongitude] =
    center(features)?.geometry.coordinates;

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Container>
        <h1>Locations</h1>

        <div className={styles.stores}>
          <div className={styles.storesLocations}>
            <ul className={styles.locations}>
              {storeLocations.map((store) => (
                <li key={store.id}>
                  <p className={styles.locationName}>{store.name}</p>
                  <address>{store.address}</address>
                  <p>{store.phoneNumber}</p>
                  <p className={styles.locationDiscovery}>
                    <button>View on Map</button>
                    <a
                      href={`https://www.google.com/maps/dir//${store.location.latitude},${store.location.longitude}/@${store.location.latitude},${store.location.longitude},17z`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get Directions
                      <FaExternalLinkAlt />
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.storesMap}>
            <div className={styles.storesMapContainer}>
              <Map
                className={styles.map}
                center={[defaultLatitude, defaultLongitude]}
                zoom={4}
                scrollWheelZoom={false}
              >
                {({ TileLayer, Marker, Popup }, map) => {
                  return (
                    <>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {storeLocations.map((store) => (
                        <Marker
                          position={[
                            store.location.latitude,
                            store.location.longitude,
                          ]}
                          key={store.id}
                        >
                          <Popup>
                            <p>{store.name}</p>
                          </Popup>
                        </Marker>
                      ))}
                    </>
                  );
                }}
              </Map>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const data = await client.query({
    query: gql`
      query PageStores {
        storeLocations {
          id
          address
          name
          phoneNumber
          location {
            latitude
            longitude
          }
        }
      }
    `,
  });

  const storeLocations = data.data.storeLocations;

  return { props: { storeLocations } };
};
