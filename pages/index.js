import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';

export async function getServerSideProps(context) {
	const { req, res } = context;
	const token = req.cookies.token;

	if (!token) {
		res.writeHead(302, { Location: '/posts/login' });
		res.end();
	} 

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const url = `${protocol}://${host}/api/getUserInfo`;

    const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ token }),
	});
	if (!response.ok) {
		const errorResponse = await response.json();
		//throw new Error(errorResponse.error || 'oh no');
		res.writeHead(302, { Location: '/posts/login' });
		res.end();
	}
	let data = await response.json();
	console.log("DATA:", data)
	return {
		props: {
			name: data.name,
			points: data.points ?? 0,
			pfpscr: "data.pfpscr",
		},
	}
}

export default function Home({ name, points, pfpscr}) {
	return (
		<Layout pfp={"large"} name={name} points={points} pfpscr={pfpscr}>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<section className={utilStyles.headingMd}>
				<p>[Insert stuff here]</p>
			</section>
		</Layout>
	);
}