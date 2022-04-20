import Head from "next/head";

import Layout from "@components/Layout";
import Header from "@components/Header";
import Container from "@components/Container";
import Button from "@components/Button";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import styles from "@styles/Product.module.scss";
import client from "@lib/client";

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
              alt={product.name}
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
              <Button
                className="snipcart-add-item"
                data-item-id={product.id}
                data-item-price={product.price}
                data-item-url={`/products/${product.slug}`}
                data-item-image={product.image.url}
                data-item-name={product.name}
              >
                Add to Cart
              </Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getStaticProps = async ({ params, locale }) => {
  const data = await client.query({
    query: gql`
      query PageProduct($slug: String!, $locale: Locale!) {
        product(where: { slug: $slug }) {
          id
          image
          name
          price
          slug
          description {
            html
          }
          localizations(locales: [$locale]) {
            description {
              html
            }
            locale
          }
        }
      }
    `,
    variables: {
      slug: params.productSlug,
      locale,
    },
  });

  let product = data.data.product;

  if (product.localizations.length > 0) {
    product = {
      ...product,
      ...product.localizations[0],
    };
  }

  return { props: { product } };
};

export const getStaticPaths = async ({ locales }) => {
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
    paths: [
      ...paths,
      ...paths.flatMap((path) => {
        return locales.map((locale) => {
          return { ...path, locale };
        });
      }),
    ],
    fallback: false,
  };
};
