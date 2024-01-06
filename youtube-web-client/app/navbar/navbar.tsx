import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function NavBar() {
	return (
		<nav className={styles.nav}>
			<Link className={styles.logoContainer} href="/">
				<Image width={90} height={20} src="/youtube-logo.svg" alt="YouTube Logo" />
			</Link>
		</nav>
	);
}
