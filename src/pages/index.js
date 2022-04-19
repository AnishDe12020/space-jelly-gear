import Head from "next/head";
import Link from "next/link";

import Layout from "@components/Layout";
import Container from "@components/Container";
import Button from "@components/Button";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import products from "@data/products";

import styles from "@styles/Page.module.scss";

export default function Home({ home }) {
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
								alt=""
							/>
						</a>
					</Link>
				</div>

				<h2 className={styles.heading}>Featured Gear</h2>

				<ul className={styles.products}>
					{products.slice(0, 4).map((product) => {
						return (
							<li key={product.id}>
								<Link href="#">
									<a>
										<div className={styles.productImage}>
											<img
												width="500"
												height="500"
												src={product.image}
												alt=""
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
					heroBackground {
						width
						url
						height
					}
				}
			}
		`,
	});

	const home = data.data.page;

	return { props: { home } };
};
