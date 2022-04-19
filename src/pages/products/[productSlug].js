import Head from "next/head";

import Layout from "@components/Layout";
import Header from "@components/Header";
import Container from "@components/Container";
import Button from "@components/Button";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import styles from "@styles/Product.module.scss";

export default function Product({ product }) {
  return (
    <Layout>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={`${product.name} on Space Jelly!`} />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <img
              width={product.image.width}
              height={product.image.height}
              src={product.image.url}
              alt=""
            />
          </div>
          <div className={styles.productContent}>
            <h1>{product.name}</h1>
            <div
              className={styles.productDescription}
              dangerouslySetInnerHTML={{
                __html: product.description?.html,
              }}
            />
            <p className={styles.productPrice}>${product.price}</p>
            <p className={styles.productBuy}>
              <Button>Add to Cart</Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const client = new ApolloClient({
    uri: "https://api-ap-south-1.graphcms.com/v2/cl25yibjg7r8f01xtfr16e1f4/master",
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageProduct($slug: String!) {
        product(where: { slug: $slug }) {
          id
          image
          name
          price
          description {
            html
          }
        }
      }
    `,
    variables: {
      slug: params.productSlug,
    },
  });

  console.log(data);

  const product = data.data.product;

  return { props: { product } };
};

export const getStaticPaths = async () => {
  const client = new ApolloClient({
    uri: "https://api-ap-south-1.graphcms.com/v2/cl25yibjg7r8f01xtfr16e1f4/master",
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageProducts {
        products {
          slug
        }
      }
    `,
  });

  const paths = data.data.products.map((product) => {
    return {
      params: {
        productSlug: product.slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};
