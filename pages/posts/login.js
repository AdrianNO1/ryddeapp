import React, { useState } from 'react';
import styles from '../../styles/login.module.css';
import utilStyles from '../../styles/utils.module.css';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

export default function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});
		
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(errorResponse.error || 'Login failed');
			}
		
			const data = await response.json();
			let token = data.token
			console.log('Login Successful. Token:', token);
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
				<button type="submit" disabled={loading} className={styles['login-button']}>
					{loading ? 'Logging in...' : 'Login'}
				</button>
				{error && <p className={styles['error-message']}>{error}</p>}
			</form>
			<Link className={utilStyles['bluelink']} href="/posts/register">Register</Link>
		</div>
	);
}