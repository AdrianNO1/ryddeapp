import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import Sidebar from '../components/sidebar';

export const siteTitle = 'Next.js Sample Website';

export default function Layout({ children, pfp, name, points, pfpscr, title }) {
	return (
		<div className={styles.container}>
			<Sidebar></Sidebar>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta
					name="description"
					content="Learn how to build a personal website using Next.js"
				/>
				<meta
					property="og:image"
					content={`https://og-image.vercel.app/${encodeURI(
						siteTitle,
					)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
				/>
				<meta name="og:title" content={siteTitle} />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<header className={styles.header}>
				{pfp === "large" ? (
					<>
						<Image
							priority
							src="/images/profile.jpg"
							className={utilStyles.borderCircle}
							height={144}
							width={144}
							alt=""
						/>
						<h1 className={utilStyles.headingName}>{name}</h1>
						{title ? <h1 className={utilStyles.headingXllight}>{title}</h1> : <h1 className={utilStyles.headingXl}>Points: {points}</h1>}
					</>
				) : pfp === "small" ? (
					<>
						<Link href="/">
							<Image
								priority
								src="/images/profile.jpg"
								className={utilStyles.borderCircle}
								height={75}
								width={75}
								alt=""
							/>
						</Link>
						{title ? <h1 className={utilStyles.headingXllight}>{title}</h1> : <h1 className={utilStyles.headingXllight}>Points: {points}</h1>}
					</>
				) : pfp === "corner" ? (
					<>
						<Link href="/">
							<Image
								priority
								src="/images/profile.jpg"
								className={`${utilStyles.borderCircle} ${utilStyles.cornerpfp}`}
								height={75}
								width={75}
								alt=""
							/>
						</Link>
						{title ? <h1 className={utilStyles.headingXllight}>{title}</h1> : <h1 className={utilStyles.headingXllight}>Points: {points}</h1>}
					</>
				) : <></>}
			</header>
			<main>{children}</main>
		</div>
	);
}