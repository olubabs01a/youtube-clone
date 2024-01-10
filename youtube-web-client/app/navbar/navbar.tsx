"use client";

import Image from "next/image";
import Link from "next/link";
import SignInOut from "./sign-in-out";
import styles from "./navbar.module.css";
import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { onAuthStateChangedHelper } from "../firebase";
import Upload from "./upload";

export default function NavBar() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChangedHelper((user) => {
			setUser(user);
		});

		return () => unsubscribe();
	}, []);

	return (
		<nav className={styles.nav}>
			<Link className={styles.logoContainer} href="/">
				<Image width={90} height={20} src="/youtube-logo.svg" alt="YouTube Logo" />
			</Link>
			{user?.displayName && (
				<p>
					<i>Welcome, {user?.displayName.split(" ")[0]}!</i>
				</p>
			)}
			<div className={styles.action}>
				{user !== null && <Upload />}
				<SignInOut user={user} />
				{user?.photoURL ? (
					<Image
						className={styles.profile}
						width={35}
						height={35}
						src={user?.photoURL}
						alt="user-profile"
					/>
				) : (
					user?.displayName && (
						<circle width={35}>
							{user?.displayName.split(" ")[0][0].toUpperCase()}
						</circle>
					)
				)}
			</div>
		</nav>
	);
}
