import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';

export default function Custom404() {
	return <>
		<h1>404 - Page Not Found</h1>
		<Link className={utilStyles['bluelink']} href="/">Back to home</Link>
	</>
}