import Head from "next/head";
import Link from "next/link";

import Layout from "@components/Layout";
import Container from "@components/Container";
import Button from "@components/Button";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import products from "@data/products";

import styles from "@styles/Page.module.scss";

export default function Home({ home, products }) {
  const { heroTitle, heroText, heroLink, heroBackground } = home;
  return (
    <Layout>
      <Head>
        <title>Space Jelly Gear</title>
        <meta name="description" content="Get your Space Jelly gear!" />
      </Head>

      <Container>
        <h1 className="sr-only">Space Jelly Gear</h1>

        <div className={styles.hero}>
          <Link href={heroLink}>
            <a>
              <div className={styles.heroContent}>
                <h2>{heroTitle}</h2>
                <p>{heroText}</p>
              </div>
              <img
                className={styles.heroImage}
                src={heroBackground.url}
                height={heroBackground.height}
                width={heroBackground.width}
                alt="Hero Image"
              />
            </a>
          </Link>
        </div>

        <h2 className={styles.heading}>Featured Gear</h2>

        <ul className={styles.products}>
          {products.map((product) => {
            return (
              <li key={product.slug}>
                <Link href="#">
                  <a>
                    <div className={styles.productImage}>
                      <img
                        width={product.image.width}
                        height={product.image.height}
                        src={product.image.url}
                        alt={product.name}
                      />
                    </div>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <p className={styles.productPrice}>${product.price}</p>
                  </a>
                </Link>
                <p>
                  <Button>Add to Cart</Button>
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const client = new ApolloClient({
    uri: "https://api-ap-south-1.graphcms.com/v2/cl25yibjg7r8f01xtfr16e1f4/master",
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageHome {
        page(where: { slug: "home" }) {
          id
          heroLink
          heroText
          heroTitle
          name
          slug
          heroBackground
        }
        products(first: 4) {
          name
          price
          slug
          image
        }
      }
    `,
  });

  const home = data.data.page;
  const products = data.data.products;

  return { props: { home, products } };
};
