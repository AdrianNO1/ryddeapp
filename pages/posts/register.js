import React, { useState } from 'react';
import utilStyles from '../../styles/utils.module.css';
import styles from '../../styles/login.module.css';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';


export default function RegisterForm() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [isChild, setIsChild] = useState(true);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, password, password2, isChild }),
			});
		
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(errorResponse.error || 'Register failed');
			}
		
			const data = await response.json();
			let token = data.token
			console.log('Register Successful. Token:', token);
			var inTenYears = new Date();
			inTenYears.setFullYear(inTenYears.getFullYear() + 10);

			Cookie.set('token', token, { expires: inTenYears  }); // Expires in 10 years
			router.push('/');

		} catch (error) {
			console.error(error.message);
			setError(error.message); 
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles['login-form-container']}>
			<form onSubmit={handleLogin} className={styles['login-form']}>
				<div className={styles['form-group']}>
					<label htmlFor="name">Name:</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className={styles['form-group']}>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className={styles['form-group']}>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className={styles['form-group']}>
					<label htmlFor="password">Confirm password:</label>
					<input
						type="password"
						id="password2"
						value={password2}
						onChange={(e) => setPassword2(e.target.value)}
						required
					/>
				</div>

				<div className={`${styles['form-group']} ${styles['checkbox-group']}`}>
					<label htmlFor="isChild">Are you a child?</label>
					<input
						type="checkbox"
						id="isChild"
						checked={isChild}
						onChange={(e) => setIsChild(e.target.checked)}
					/>
				</div>

				<button type="submit" disabled={loading} className={styles['login-button']}>
					{loading ? 'Registering...' : 'Register'}
				</button>
				{error && <p className={styles['error-message']}>{error}</p>}
			</form>
			<Link className={utilStyles['bluelink']} href="/posts/login">Login</Link>
		</div>
	);
}
